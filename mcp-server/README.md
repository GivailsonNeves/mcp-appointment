# MCP Server

A Model Context Protocol (MCP) server that provides AI assistant with tools for appointment management, such as doctor and patient management, appointment scheduling, and utility functions.

## Overview

The MCP Server implements the Model Context Protocol standard to provide:
- **Doctor Management Tools**: Get doctor information and schedules
- **Patient Management Tools**: Retrieve patient data and appointments
- **Appointment Tools**: Create, list, and manage appointments
- **Utility Tools**: Date/time functions and availability checking
- **MCP Resources**: Structured data resources for templates, profiles, and histories

## Tech Stack

- **Runtime**: Node.js 18+
- **Protocol**: Model Context Protocol (MCP) SDK
- **Transport**: Stdio (Standard Input/Output)
- **Validation**: Zod schema validation

## Installation

1. Install dependencies:
```bash
npm install
```

## Building the Server

Compile TypeScript and make the executable:

```bash
npm run build
```

This will:
- Compile TypeScript files to JavaScript in the `build/` directory
- Make the `build/main.js` file executable with proper permissions

## Running the Server

The MCP server is designed to be launched by an MCP client via stdio transport. It's not meant to be run directly.

### Via MCP Client
The server is typically launched by the MCP Client:

```bash
# From mcp-client directory
node build/main.js /absolute/path/to/mcp-server/build/main.js
```

### Direct Testing (Development Only)
For development testing, you can run it directly, but it will only respond to MCP protocol messages:

```bash
node build/main.js
```

## Available MCP Tools

### Doctor Management

#### `get-doctor`
Retrieve doctor information by ID or name.

**Parameters:**
- `id` (optional): Doctor ID string
- `name` (optional): Doctor name string

**Usage:**
```json
{
  "name": "get-doctor",
  "arguments": {
    "id": "doctor123"
  }
}
```

#### `get-doctor-appointments`
Get all appointments for a specific doctor.

**Parameters:**
- `doctorId` (required): Doctor ID string
- `date` (optional): Date filter in YYYY-MM-DD format

**Usage:**
```json
{
  "name": "get-doctor-appointments",
  "arguments": {
    "doctorId": "doctor123",
    "date": "2024-01-20"
  }
}
```

### Patient Management

#### `get-patient`
Retrieve patient information by ID or name.

**Parameters:**
- `id` (optional): Patient ID string
- `name` (optional): Patient name string

**Usage:**
```json
{
  "name": "get-patient",
  "arguments": {
    "name": "John Doe"
  }
}
```

#### `get-patient-appointments` ⚠️
Get all appointments for a specific patient.

**Parameters:**
- `patientId` (required): Patient ID string
- `date` (optional): Date filter in YYYY-MM-DD format

### Appointment Management

#### `get-appointment`
Retrieve a specific appointment by ID.

**Parameters:**
- `id` (required): Appointment ID string

#### `list-appointments`
List all appointments with optional date filtering.

**Parameters:**
- `date` (optional): Date filter in YYYY-MM-DD format

#### `create-appointment`
Create a new appointment with automatic conflict checking.

**Parameters:**
- `patientId` (required): Patient ID string
- `doctorId` (required): Doctor ID string
- `date` (required): Date in YYYY-MM-DD format
- `time` (required): Time slot from available options

**Available Time Slots:**
- "08:00", "09:00", "10:00", "11:00", "12:00"
- "13:00", "14:00", "15:00", "16:00", "17:00"

**Features:**
- Automatic conflict detection
- Past date validation
- Time slot validation
- Marks appointments as created by assistant

#### `list-doctor-available-times`
Get available time slots for a doctor on a specific date.

**Parameters:**
- `doctorId` (required): Doctor ID string
- `date` (required): Date in YYYY-MM-DD format

### Utility Tools

#### `get-date`
Get the current date and time in São Paulo timezone.

**Parameters:** None

**Returns:** Current date, time, and timezone information

## MCP Resources

The server provides structured data resources that can be accessed by MCP clients:

### Appointment Templates
Pre-configured appointment type templates with duration, requirements, and time slot information.

**Available Templates:**
- `appointment-templates://consultation` - General medical consultation (30 min)
- `appointment-templates://checkup` - Annual health checkup (45 min)
- `appointment-templates://followup` - Follow-up appointment (20 min)
- `appointment-templates://emergency` - Emergency consultation (15 min)

**Template Structure:**
```json
{
  "type": "consultation",
  "duration": 30,
  "description": "General medical consultation",
  "requirements": ["patient_id", "doctor_id", "date", "time"],
  "defaultNotes": "General consultation appointment",
  "category": "routine",
  "allowedTimeSlots": ["09:00", "09:30", ...]
}
```

### Doctor Profiles
Comprehensive doctor information including schedules, specialties, and statistics.

**Available Resources:**
- `doctor-profiles://all` - All doctor profiles
- `doctor-profiles://{doctor_id}` - Individual doctor profile

**Profile Structure:**
```json
{
  "id": 1,
  "name": "Dr. Smith",
  "email": "doctor@example.com",
  "specialty": "General Practice",
  "schedule": {
    "monday": "9:00-17:00",
    "tuesday": "9:00-17:00",
    ...
  },
  "consultationTypes": ["consultation", "checkup"],
  "acceptsEmergencies": false,
  "statistics": {
    "totalAppointments": 150,
    "upcomingAppointments": 12
  }
}
```

### Patient History
Complete appointment history and statistics for patients.

**Available Resources:**
- `patient-history://all` - All patient histories
- `patient-history://{patient_id}` - Individual patient history

**History Structure:**
```json
{
  "patient": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "totalAppointments": 5,
  "appointments": [...],
  "summary": {
    "firstAppointment": "2024-01-01",
    "lastAppointment": "2024-03-01",
    "frequentDoctors": [...],
    "averageInterval": 45
  }
}
```

### Schedule Templates
Pre-configured schedule patterns for different practice types.

**Available Templates:**
- `schedule-templates://standard-weekday` - Monday-Friday 9AM-5PM (40h/week)
- `schedule-templates://extended-hours` - Extended weekdays + Saturday morning (54h/week)
- `schedule-templates://part-time` - 3 days per week (24h/week)
- `schedule-templates://emergency` - 24/7 emergency coverage (168h/week)
- `schedule-templates://specialist` - Specialist consultations with longer slots (28h/week)

**Template Structure:**
```json
{
  "name": "Standard Weekday Schedule",
  "type": "weekday",
  "description": "Standard Monday to Friday office hours",
  "schedule": {
    "monday": {
      "start": "09:00",
      "end": "17:00",
      "lunchBreak": {"start": "12:00", "end": "13:00"},
      "slots": ["09:00", "09:30", ...]
    },
    ...
  },
  "totalWeeklyHours": 40,
  "maxDailyAppointments": 16
}
```

## API Integration

The MCP server communicates with the appointment system via HTTP calls to:

**Base URL:** `http://localhost:3000/api`

### Endpoints Used:
- `GET /doctors` - Retrieve doctors
- `GET /patients` - Retrieve patients
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointments
- `GET /appointments/doctor/{id}` - Doctor's appointments
- `GET /appointments/patient/{id}` - Patient's appointments
- `GET /appointments/doctor/{id}/available-times/{date}` - Available slots

## Error Handling

The server provides comprehensive error handling:

### Validation Errors
- Invalid date formats
- Missing required parameters
- Invalid time slots
- Malformed requests

### Appointment Logic Errors
- Appointment conflicts
- Past date scheduling
- Non-existent doctors/patients
- No available time slots

## Tool Response Format

All tools return structured responses:

```json
{
  "success": true,
  "data": { /* tool-specific data */ },
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details"
}
```

## Development

### Project Structure
```
src/
├── main.ts              # Server entry point and setup
├── tools/
│   ├── doctors-tool.ts      # Doctor management tools
│   ├── patient-tool.ts      # Patient management tools
│   ├── appointment-tools.ts # Appointment operations
│   └── utils-tools.ts       # Utility functions
├── resources/
│   └── index.ts             # MCP resources handler
├── lib/
│   └── api-client.ts        # HTTP client for API calls
└── types/               # TypeScript type definitions
```

### Adding New Tools

1. Create tool definition with Zod schema validation:
```typescript
const myToolSchema = z.object({
  param1: z.string(),
  param2: z.string().optional()
});
```

2. Register the tool:
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "my-tool",
      description: "Description of what the tool does",
      inputSchema: zodToJsonSchema(myToolSchema)
    }
  ]
}));
```

3. Implement tool handler:
```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "my-tool") {
    // Tool implementation
  }
});
```

For more information about connecting to this server, see the [MCP Client README](../mcp-client/README.md).