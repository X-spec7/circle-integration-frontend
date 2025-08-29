// Environment configuration
export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  POLYGONSCAN_URL: process.env.NEXT_PUBLIC_POLYGONSCAN_URL || 'https://polygonscan.com',
}; 