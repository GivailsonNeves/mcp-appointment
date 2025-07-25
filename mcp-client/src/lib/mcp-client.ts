// Anthropic SDK
import { Anthropic } from "@anthropic-ai/sdk";
import {
  MessageParam,
  Tool,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources";

// MCP Client
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

enum ContentType {
  Text = "text",
  ToolUse = "tool_use",
  ToolResult = "tool_result",
}

export class MCPClient {
  private mcp: Client;
  private llm: Anthropic;
  private transport: StdioClientTransport | null = null;
  public tools: Tool[] = [];

  private readonly llmsModel: string = "claude-sonnet-4-20250514";
  private readonly systemMessage: MessageParam[] = [
    {
      role: MessageRole.Assistant,
      content: `You are a helpful assistant that can call tools to answer questions. Available tools: ${this.tools
        .map((tool) => tool.name)
        .join(", ")},
        Your purpose is to assist users by providing accurate and helpful information based on the tools available.
        If you need to use a tool, you will respond with a tool_use message containing the tool name and the arguments to pass to the tool.
        Your answers and questions to the user will always be a json object with the following structure:
        {
          "llm_response": "your response to the user",
          "success": true/false,
          "tool_name": "name of the last tool used",
          "tool_params": {
            "param1": "value1",
            "param2": "value2",
            ...
          }
        }
        If there is no last tool used, you can omit the "tool_name" and "tool_params" fields.
        `,
    },
  ];

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

  async processQuery(query: string, history: MessageParam[] = []) {
    let conversation: MessageParam[] = [
      {
        role: MessageRole.User,
        content: query,
      },
    ];

    if (history && history.length > 0) {
      console.log("Using provided history for conversation:", history);
      conversation = [
        ...history,
        ...conversation,
      ] as MessageParam[];
    }

    while (true) {
      try {
        const messages = await this.runInference(conversation);
        conversation = [
          ...conversation,
          {
            role: MessageRole.Assistant,
            content: messages.content,
          },
        ] as MessageParam[];

        let toolResults = [];
        for (const content of messages.content) {
          if (content.type === ContentType.Text) {
            console.log("LLM Response:", content.text);
          } else if (content.type === ContentType.ToolUse) {
            toolResults.push(await this.runTool(content as ToolUseBlock));
          }
        }

        if (!toolResults.length) {
          // If no tool results, break the loop
          console.log("No tool results, breaking the loop.");
          break;
        }

        conversation = [
          ...conversation,
          {
            role: MessageRole.User,
            content: toolResults,
          },
        ] as MessageParam[];

        console.log("Updated conversation:", conversation);
      } catch (error) {
        console.error("Error during inference:", error);
        throw error;
      }
    }

    return conversation;
  }

  async runTool(content: ToolUseBlock) {
    console.log("Tool Use Detected:", content);
    const toolName = content.name;
    const toolArgs = content.input as { [x: string]: unknown } | undefined;

    console.log("Calling tool:", toolName, "with args:", toolArgs);
    const result = await this.mcp.callTool({
      name: toolName,
      arguments: toolArgs,
    });
    console.log("Tool Result:", result.content);
    return {
      type: ContentType.ToolResult,
      tool_use_id: content.id,
      content: result.content,
    };
  }

  async runInference(conversation: MessageParam[]) {
    try {
      const response: Anthropic.Messages.Message =
        await this.llm.messages.create({
          model: this.llmsModel,
          max_tokens: 1000,
          messages: [...this.systemMessage, ...conversation],
          tools: this.tools,
        });

      console.log("LLM Response:", response);

      return response;
    } catch (error) {
      console.error("Error during inference:", error);
      throw error;
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}
