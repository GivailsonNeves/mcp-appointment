# MCP Appointment Assistant

## Proof of Concept Summary
This proof of concept demonstrates an integrated chat interface that both answers queries and dynamically interacts with the application UI.

## Architecture:
-APP: A simple scheduler app built with Next.js
-MCP Server: Exposes application context and functionality to any compatible client through standardized tools
-MCP Client: REST API-based client with endpoints that interact with the MCP server tools
-Chat Widget: Integrated UI component that communicates with both the chat API and the frontend application

## Interactive Capabilities: 
The system goes beyond traditional chatbots by providing contextual UI navigation alongside conversational responses. Examples include:

```bash
> What is the schedule for Doctor Who today?
→ The system provides the answer and automatically navigates to the relevant schedule view
```

```bash
> Create an appointment for July 20th with Givailson and Doctor Lee
→ The system creates the appointment and displays the filtered view showing Doctor Lee appointments for that date
```

##Core Concept:

The approach combines conversational interfaces with automated UI navigation, enabling users to interact with applications through natural language while simultaneously receiving visual feedback through dynamic interface updates.

## Demo
<img  src="https://github.com/user-attachments/assets/d802fe75-b4bc-4c6a-9546-0ff664793feb" />
