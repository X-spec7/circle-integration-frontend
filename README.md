# Circle Integration Frontend

A React-based frontend for the Circle-powered fundraising platform that enables SMEs to launch token projects and investors to purchase tokens using both fiat (EUR via SEPA) and crypto payments.

## Features

- **User Authentication**: JWT-based authentication for investors and SMEs
- **Project Management**: Create, view, and manage fundraising projects
- **Investment Platform**: Browse and invest in token projects
- **Payment Integration**: Support for fiat (SEPA) and crypto payments via Circle API
- **Real-time Updates**: Live project status and investment tracking
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **API Integration**: Custom API service layer

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend implementation guide)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd circle-integration-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8001/api/v1
   
   # Circle Configuration
   VITE_CIRCLE_ENVIRONMENT=sandbox
   
   # Polygon Network Configuration
   VITE_POLYGON_RPC_URL=https://polygon-rpc.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Integration

The frontend is fully integrated with the backend API using the following endpoints:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user profile

### Projects
- `GET /api/v1/projects/` - List projects
- `GET /api/v1/projects/{id}` - Get project details
- `POST /api/v1/projects/` - Create project (SME only)
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project
- `GET /api/v1/projects/user/projects` - Get user's projects

### Payments
- `POST /api/v1/payments/initiate` - Initiate fiat payment
- `POST /api/v1/payments/crypto` - Initiate crypto payment
- `GET /api/v1/payments/{id}/status` - Get payment status
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/investments` - Get user investments

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Dashboard.tsx   # Investor dashboard
│   ├── SMEDashboard.tsx # SME dashboard
│   ├── ProjectCard.tsx # Project display card
│   ├── ProjectModal.tsx # Project details modal
│   ├── PaymentModal.tsx # Payment processing modal
│   └── CreateProjectModal.tsx # Project creation form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
└── data/              # Static data (if any)
    └── projects.ts    # Mock data (replaced with API)
```

## Key Components

### Authentication Flow
- Users can register as either investors or SMEs
- JWT tokens are stored in localStorage
- Automatic token refresh and session management

### Project Management
- SMEs can create new fundraising projects
- Multi-step form with validation
- Project status tracking (pending, active, completed, rejected)

### Investment Process
- Investors can browse available projects
- Real-time project statistics and progress
- Secure payment flow with Circle integration

### Payment Integration
- Fiat payments via SEPA bank transfer
- Crypto payments via direct transfer (coming soon)
- Payment status tracking and confirmation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
