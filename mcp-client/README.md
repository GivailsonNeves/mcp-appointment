# MCP Client

An Express.js server that acts as a bridge between the web application and the Model Context Protocol (MCP) server. This client enables AI-powered appointment management by connecting the frontend chat interface with MCP tools.

## Overview

The MCP Client serves as the middleware layer that:
- Receives chat requests from the frontend application
- Communicates with the MCP Server via stdio transport
- Integrates with Anthropic's Claude API for AI processing

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **AI Integration**: Anthropic AI SDK
- **MCP**: Model Context Protocol SDK

## Prerequisites

- Node.js 18.0 or higher
- Anthropic API key
- MCP Server built and ready (see ../mcp-server/README.md)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3005
MCP_SERVER_PATH=/absolute/path/to/mcp-server/build/main.js
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables (see Environment Setup above)

3. Ensure the MCP Server is built and executable:
```bash
cd ../mcp-server
npm run build
```

## Building the Client

Compile TypeScript and make the executable:

```bash
npm run build
```

This will:
- Compile TypeScript files to JavaScript in the `build/` directory
- Make the `build/main.js` file executable with proper permissions

## Running the Client

### Method 1: Using Environment Variable
If you've set `MCP_SERVER_PATH` in your `.env` file:

```bash
node build/main.js
```

### Method 2: Using Command Line Argument
Provide the MCP server path directly:

```bash
node build/main.js /absolute/path/to/mcp-server/build/main.js
```


## API Endpoints

### Health Check
```
GET /health
```

Returns the health status of both the MCP Client and connected MCP Server.

**Response:**
```json
{
  "status": "ok",
  "mcpServer": "connected",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Chat Interface
```
POST /chat
```

Sends a message to the AI assistant with access to MCP tools for appointment management.

**Request Body:**
```json
{
  "message": "Book an appointment with Dr. Smith for tomorrow at 2 PM for patient John Doe"
}
```

**Response:**
```json
{
  "response": "I've successfully booked an appointment with Dr. Smith for John Doe tomorrow at 2:00 PM. The appointment has been confirmed and added to the system.",
  "toolsUsed": ["create-appointment", "get-doctor", "get-patient"]
}
```

## Architecture

```
┌─────────────────┐    HTTP     ┌─────────────────┐    Stdio    ┌─────────────────┐
│   Frontend      │   Request   │   MCP Client    │   Transport │   MCP Server    │
│   (Next.js)     │ ──────────→ │   (Express)     │ ──────────→ │   (MCP Tools)   │
│                 │             │                 │             │                 │
│ Chat Interface  │ ←────────── │ Anthropic API   │ ←────────── │ Appointment     │
│                 │   Response  │ Integration     │   Results   │ Management      │
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

### MCP Tool Integration
The client provides access to these MCP tools:
- `get-doctor` - Retrieve doctor information
- `get-patient` - Retrieve patient information
- `create-appointment` - Schedule new appointments
- `list-appointments` - View existing appointments
- `get-date` - Get current date/time
- `list-doctor-available-times` - Check available slots

For more information about MCP integration, see the [MCP Server README](../mcp-server/README.md).