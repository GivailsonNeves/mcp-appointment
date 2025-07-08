// Anthropic SDK
import { Anthropic } from "@anthropic-ai/sdk";
import { MessageParam, Tool } from "@anthropic-ai/sdk/resources";

// MCP Client
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const llmsModel = "claude-sonnet-4-20250514";
// const llmsModel = 'claude-3-5-sonnet-20241022';

export class MCPClient {
  private mcp: Client;
  private llm: Anthropic;
  private transport: StdioClientTransport | null = null;
  public tools: Tool[] = [];

  constructor(apiKey: string) {
    this.llm = new Anthropic({
      apiKey,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  async connectToServer(serverScriptPath: string) {
    try {
      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server script must be a .js or .py file");
      }
      const command = isPy
        ? process.platform === "win32"
          ? "python"
          : "python3"
        : process.execPath;

      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });
      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });
      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    const messages: MessageParam[] = [
      {
        role: "assistant",
        content: `You are a helpful assistant that can call tools to answer questions. Available tools: ${this.tools
          .map((tool) => tool.name)
          .join(", ")},
          Your purpose is to assist users by providing accurate and helpful information based on the tools available.
          If you need to use a tool, you will respond with a tool_use message containing the tool name and the arguments to pass to the tool.
          You will only answer questions that can be answered using the tools available.
          `,
      },
      {
        role: "user",
        content: query,
      },
    ];

    const response = await this.llm.messages.create({
      model: llmsModel,
      max_tokens: 1000,
      messages,
      tools: this.tools,
    });

    const finalText = [];
    const toolResults = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        const toolName = content.name;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;

        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });
        toolResults.push(result);
        finalText.push(
          `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
        );

        messages.push({
          role: "user",
          content: result.content as string,
        });

        const response = await this.llm.messages.create({
          model: llmsModel,
          max_tokens: 1000,
          messages,
          tools: this.tools,
        });

        console.log(response)

        response.content.forEach((content) => {
          if (content.type === "text") {
            finalText.push(content.text);
          } else if (content.type === "tool_use") {
            const toolName = content.name;
            const toolArgs = content.input as { [x: string]: unknown } | undefined; 
            finalText.push(
              `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
            );
          }
        });
      }
    }

    return finalText.join("\n");
  }

  async cleanup() {
    await this.mcp.close();
  }
}
