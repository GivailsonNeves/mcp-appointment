# MCP Appointment Management App

Appointment management system built with Next.js 15

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with Radix UI components
- **Validation**: Zod schema validation
- **Database**: Firebase Firestore

## Features

### Core Modules
- **Doctors Management**: Complete CRUD operations for medical professionals
- **Patients Management**: Patient registration and profile management
- **Appointments**: Scheduling system with time slot management and conflict prevention
- **AI Assistant Integration**: Chat interface powered by MCP for natural language appointment management

### Key Capabilities
- Appointment and scheduling management application
- AI-assisted appointment booking through chat interface

## Prerequisites

- Node.js 18.0 or higher
- Firebase project with Firestore enabled
- MCP Client running (see ../mcp-client/README.md)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CHAT_API_URL=http://localhost:3005

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```


## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure Firebase Firestore is configured with the following collections:
   - `doctors`
   - `patients` 
   - `appointments`

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                
│   ├── api/            # API routes for doctors, patients, appointments
│   ├── appointments/   # Appointment management pages
│   ├── doctors/        # Doctor management pages
│   └── patients/       # Patient management pages
├── components/         
│   ├── ui/            # Base UI components
│   └── layout/        # Layout components
├── modules/           
│   ├── appointments/ 
│   ├── doctors/       
│   └── patients/      
├── api-services/      
├── services/          # HTTP client and utilities
└── lib/              # Shared utilities and configurations
```

## API Integration

The app communicates with:
1. **Internal API Routes** (`/api/*`) - For CRUD operations
2. **MCP Client** (`http://localhost:3005`) - For AI assistant chat functionality

### Available Endpoints

- `GET/POST /api/doctors` - Doctor management
- `GET/POST /api/patients` - Patient management  
- `GET/POST /api/appointments` - Appointment management
- `POST http://localhost:3005/chat` - AI assistant chat

## MCP Integration

This application showcases Model Context Protocol integration through:

- **AI Assistant**: Natural language appointment booking and management
- **Real-time Communication**: Direct integration with MCP tools for appointment operations
- **Smart Scheduling**: AI-powered appointment suggestions and conflict resolution

The chat interface allows users to:
- Book appointments using natural language
- Query appointment schedules
- Get available time slots
- Manage patient and doctor information