import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { triggerTokenExpiration } from '../utils/tokenUtils';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FundRaise</h1>
              <p className="text-xs text-gray-500">Token Investment Platform</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Development test button - only show in development */}
            {import.meta.env.DEV && (
              <button
                onClick={triggerTokenExpiration}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Test Token Expiration"
              >
                Test Token Exp
              </button>
            )}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="bg-blue-600 p-1.5 rounded-full">
                {user?.user_type === 'sme' ? (
                  <Coins className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-gray-500">
                  {user?.user_type === 'investor' 
                    ? 'Investor Account'
                    : 'SME Account'
                  }
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;