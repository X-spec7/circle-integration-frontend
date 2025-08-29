# FundRaise - Next.js App

A modern token investment platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Dashboard**: Real-time project statistics and filtering
- **Investment Platform**: Browse and invest in token projects
- **SME Dashboard**: Project management for Small and Medium Enterprises
- **Polygon Integration**: Smart contract deployment and management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **API**: RESTful API with fetch

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd circle-integration-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_POLYGONSCAN_URL=https://polygonscan.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── project/[id]/      # Project detail page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (dashboard)
├── components/            # Reusable components
│   ├── dashboard.tsx      # Investor dashboard
│   ├── sme-dashboard.tsx  # SME dashboard
│   └── header.tsx         # Navigation header
├── contexts/              # React Context providers
│   ├── auth-context.tsx   # Authentication state
│   └── projects-context.tsx # Projects state
├── lib/                   # Utility libraries
│   ├── api.ts            # API service
│   └── env.ts            # Environment configuration
└── types/                # TypeScript type definitions
    └── index.ts          # API and component types
```

## API Integration

The app integrates with a RESTful API with the following endpoints:

- **Authentication**: `/auth/login`, `/auth/register`
- **Projects**: `/projects/`, `/projects/{id}`
- **Payments**: `/payments/initiate`, `/payments/crypto`
- **Users**: `/users/me`

## Key Features

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Token expiration handling

### Project Management
- Real-time project filtering
- Search functionality
- Category-based filtering
- Progress tracking

### Investment Process
- Project discovery
- Investment amount calculation
- Fiat and crypto payment options
- Transaction tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_POLYGONSCAN_URL` | Polygon blockchain explorer | `https://polygonscan.com` |
