'use client';

import React, { useState } from 'react';
import { X, DollarSign, Coins, CreditCard, Building2 } from 'lucide-react';
import type { Project } from '@/types';
import { apiService } from '@/lib/api';

interface PaymentModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'fiat' | 'crypto';

export default function PaymentModal({ project, isOpen, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('fiat');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 100) {
        throw new Error('Minimum investment amount is €100');
      }

      if (paymentMethod === 'fiat') {
        const response = await apiService.initiatePayment({
          project_id: project.id,
          amount: numAmount,
          currency: 'EUR',
          payment_method: 'sepa'
        });

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data) {
          setSuccess(true);
          console.log('Payment initiated:', response.data);
        }
      } else {
        const response = await apiService.initiateCryptoPayment({
          project_id: project.id,
          amount: numAmount,
          crypto_currency: 'USDC'
        });

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data) {
          setSuccess(true);
          console.log('Crypto payment initiated:', response.data);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTokens = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return Math.floor(numAmount / project.price_per_token);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Initiated!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been initiated successfully. You will receive further instructions shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Invest in {project.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
                             <button
                 type="button"
                 onClick={() => setPaymentMethod('fiat')}
                 className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                   paymentMethod === 'fiat'
                     ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                     : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                 }`}
               >
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Fiat (SEPA)</div>
              </button>
                             <button
                 type="button"
                 onClick={() => setPaymentMethod('crypto')}
                 className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                   paymentMethod === 'crypto'
                     ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                     : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                 }`}
               >
                <Coins className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Crypto (USDC)</div>
              </button>
            </div>
          </div>

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount ({paymentMethod === 'fiat' ? 'EUR' : 'USDC'})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter amount (min €100)"
                min="100"
                step="0.01"
                required
              />
            </div>
            {amount && parseFloat(amount) < 100 && (
              <p className="text-sm text-red-600 mt-1">Minimum investment amount is €100</p>
            )}
          </div>

          {/* Token Calculation */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tokens you&apos;ll receive:</span>
                <span className="font-bold text-gray-900">{calculateTokens().toLocaleString()} {project.symbol}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Price per token: €{project.price_per_token.toFixed(2)}
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-800 mb-2">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Project Details</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Project: {project.name}</div>
              <div>Token: {project.symbol}</div>
              <div>Category: {project.category}</div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) < 100}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : `Invest ${amount ? `€${amount}` : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
} 