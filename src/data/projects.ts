import { TokenProject } from '../types';

export const mockProjects: TokenProject[] = [
  {
    id: '1',
    name: 'GreenTech Solutions',
    symbol: 'GTS',
    description: 'Innovative renewable energy solutions for smart cities. Building the future of sustainable urban infrastructure.',
    image: 'https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=800',
    totalSupply: 1000000,
    currentRaised: 750000,
    targetAmount: 1000000,
    pricePerToken: 1.5,
    endDate: '2025-03-15',
    category: 'Clean Energy',
    riskLevel: 'Medium',
    status: 'Active'
  },
  {
    id: '2',
    name: 'HealthTech Innovations',
    symbol: 'HTI',
    description: 'Revolutionary healthcare technology platform connecting patients with AI-powered diagnostic tools.',
    image: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800',
    totalSupply: 500000,
    currentRaised: 300000,
    targetAmount: 750000,
    pricePerToken: 2.0,
    endDate: '2025-04-20',
    category: 'Healthcare',
    riskLevel: 'Low',
    status: 'Active'
  },
  {
    id: '3',
    name: 'AgriTech Revolution',
    symbol: 'ATR',
    description: 'Smart farming solutions using IoT and machine learning to optimize crop yields and reduce environmental impact.',
    image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=800',
    totalSupply: 800000,
    currentRaised: 200000,
    targetAmount: 600000,
    pricePerToken: 1.25,
    endDate: '2025-05-10',
    category: 'Agriculture',
    riskLevel: 'High',
    status: 'Active'
  },
  {
    id: '4',
    name: 'FinTech Bridge',
    symbol: 'FTB',
    description: 'Cross-border payment solutions for emerging markets with focus on financial inclusion.',
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800',
    totalSupply: 1500000,
    currentRaised: 1200000,
    targetAmount: 1500000,
    pricePerToken: 1.8,
    endDate: '2025-02-28',
    category: 'Financial Services',
    riskLevel: 'Medium',
    status: 'Active'
  }
];