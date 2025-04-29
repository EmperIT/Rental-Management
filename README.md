# Rental Management System

## Overview

A comprehensive property rental management system built on microservices architecture.
The system supports management of rooms, tenants, contracts, invoices, and finances.

## System Architecture

The project follows a microservices architecture, including:

### Backend
- **API Gateway**: Main entry point for frontend communications
- **Auth Service**: Handles user authentication and authorization
- **Rental Service**: Manages rooms, tenants, and invoices
- **Contract Service**: Handles rental contracts
- **Email Service**: Sends notification emails

### Frontend
- Single Page Application (SPA) developed with React

## Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: MongoDB (with Mongoose)
- **Communication**: gRPC (between services)
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger
- **Containerization**: Docker, Docker Compose

### Frontend
- **Framework**: React (Create React App)
- **Routing**: React Router
- **UI**: Custom CSS, React Icons
- **API calls**: Axios

## Main Features

1. **Room Management**
   - Add, edit, and delete room information
   - Monitor room status (vacant, occupied)
   - Manage room prices and deposits

2. **Tenant Management**
   - Register new tenants
   - Manage tenant personal information
   - Track deposit and rental status

3. **Contract Management**
   - Create and manage rental contracts
   - Manage temporary residence registration
   - Extend or terminate contracts

4. **Invoice Management**
   - Automatically generate monthly invoices
   - Integrate with utility meter readings
   - Track payment status

5. **Financial Management**
   - Monitor income and expenses
   - Generate financial reports
   - Categorize transactions

6. **Asset & Service Management**
   - Manage room assets
   - Manage associated services
   - Configure service pricing

## Installation and Setup

### Requirements
- Node.js (>= 14.x)
- MongoDB
- Docker and Docker Compose (recommended)

### Installation

#### Using Docker
```bash
# Clone repo
git clone <repository-url>
cd Rental-Management

# Run the entire system
docker-compose up -d
```

#### Manual Installation

1. Backend
```bash
cd backend
npm install
npm run start:dev
```

2. Frontend
```bash
cd frontend
npm install
npm start
```

## Code Structure

```
Rental-Management/
├── backend/
│   ├── apps/
│   │   ├── api-gateway/    # API Gateway 
│   │   ├── auth/           # Authentication Service
│   │   ├── rental/         # Rental Management Service
│   │   ├── contract/       # Contract Management Service
│   │   └── email/          # Email Service
│   │
│   ├── libs/
│   │   └── commonn/        # Shared types and interfaces
│   │
│   └── proto/              # gRPC Protocol Buffers
│
└── frontend/
    ├── public/             # Static files
    └── src/
        ├── components/     # React components
        ├── pages/          # Page components
        ├── services/       # API services
        ├── styles/         # CSS styles
        └── utils/          # Utility functions
```