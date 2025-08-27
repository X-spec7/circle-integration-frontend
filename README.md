# Circle Integration Frontend

A React-based frontend for the blockchain-enabled investment platform that integrates with Circle payments and Polygon blockchain.

## Features

- **User Authentication**: Register and login with support for investors and SMEs
- **Project Management**: Create, view, and manage investment projects
- **Payment Integration**: Support for both fiat (SEPA) and crypto payments via Circle
- **Blockchain Integration**: View token contracts and transactions on Polygonscan
- **Real-time Updates**: Monitor payment status and project progress
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **API Integration**: Fetch API with custom service layer

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_POLYGONSCAN_URL=https://polygonscan.com
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd circle-integration-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user

### Projects
- `GET /api/v1/projects/` - List projects with filtering
- `GET /api/v1/projects/{id}` - Get project details
- `POST /api/v1/projects/` - Create new project (SME only)
- `PUT /api/v1/projects/{id}` - Update project (owner only)
- `GET /api/v1/projects/{id}/escrow-address` - Get project escrow address

### Payments
- `POST /api/v1/payments/initiate` - Initiate fiat payment
- `POST /api/v1/payments/crypto` - Initiate crypto payment
- `GET /api/v1/payments/{id}/status` - Get payment status
- `GET /api/v1/payments/investments` - Get user investments

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Dashboard.tsx   # Main dashboard
│   ├── ProjectCard.tsx # Project display card
│   ├── ProjectModal.tsx # Project details modal
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── services/           # API services
│   └── api.ts         # API client
├── types/              # TypeScript types
│   └── index.ts       # Type definitions
└── config/             # Configuration
    └── env.ts         # Environment variables
```

## Key Features

### Authentication Flow
1. Users can register as either investors or SMEs
2. Login uses username/password combination
3. JWT tokens are stored in localStorage
4. Automatic token validation on app load

### Project Management
1. SMEs can create new projects with token deployment
2. Projects include blockchain contract addresses
3. Real-time progress tracking and status updates
4. Integration with Polygonscan for contract verification

### Payment Processing
1. **Fiat Payments**: SEPA bank transfers via Circle API
2. **Crypto Payments**: Direct transfers to escrow contracts
3. **Status Tracking**: Real-time payment status updates
4. **Token Distribution**: Automatic token allocation on payment completion

### Blockchain Integration
1. **Contract Addresses**: Display token and escrow contract addresses
2. **Transaction Links**: Direct links to Polygonscan for verification
3. **Deployment Tracking**: Monitor contract deployment status
4. **Escrow Protection**: Funds held in smart contracts until conditions met

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling
