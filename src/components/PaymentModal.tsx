import React, { useState } from 'react';
import { TokenProject, PaymentStatus } from '../types';
import { ArrowLeft, CreditCard, Banknote, Shield, Clock, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface PaymentModalProps {
  project: TokenProject;
  amount: number;
  tokensToReceive: number;
  onClose: () => void;
  onBack: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  project, 
  amount, 
  tokensToReceive, 
  onClose, 
  onBack 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [referenceId] = useState(() => `FR${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);

  const bankDetails = {
    accountHolder: 'FundRaise Platform',
    iban: 'GB29 NWBK 6016 1331 9268 19',
    bic: 'NWBKGB2L',
    reference: referenceId,
    amount: amount
  };

  const handlePaymentMethodSelect = (method: 'crypto' | 'fiat') => {
    setSelectedPaymentMethod(method);
    
    if (method === 'fiat') {
      setShowBankDetails(true);
    } else {
      // Crypto placeholder
      setPaymentStatus({
        status: 'pending',
        message: 'Crypto payment option coming soon!'
      });
    }
  };

  const simulatePaymentProcessing = () => {
    setPaymentStatus({
      status: 'processing',
      message: 'Processing your bank transfer...'
    });

    // Simulate backend processing
    setTimeout(() => {
      setPaymentStatus({
        status: 'completed',
        message: 'Payment received! Your tokens will be distributed within 24 hours.',
        transactionId: `TX${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (paymentStatus?.status === 'completed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-medium">{paymentStatus.transactionId}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Tokens Reserved:</span>
                <span className="font-medium">{tokensToReceive} {project.symbol}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus?.status === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showBankDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setShowBankDetails(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Bank Transfer Details</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure Payment via Circle</p>
                  <p className="text-xs text-blue-700">Your EUR will be automatically converted to EURC and transferred to the project's escrow smart contract.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Account Holder</span>
                  <button 
                    onClick={() => copyToClipboard(bankDetails.accountHolder)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                </div>
                <p className="font-medium text-gray-900">{bankDetails.accountHolder}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">IBAN</span>
                  <button 
                    onClick={() => copyToClipboard(bankDetails.iban)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                </div>
                <p className="font-mono font-medium text-gray-900">{bankDetails.iban}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">BIC/SWIFT</span>
                  <button 
                    onClick={() => copyToClipboard(bankDetails.bic)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                </div>
                <p className="font-mono font-medium text-gray-900">{bankDetails.bic}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-800">Payment Reference (Required)</span>
                  <button 
                    onClick={() => copyToClipboard(bankDetails.reference)}
                    className="text-yellow-700 hover:text-yellow-800 text-xs flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                </div>
                <p className="font-mono font-bold text-yellow-900">{bankDetails.reference}</p>
                <p className="text-xs text-yellow-700 mt-1">Include this reference to ensure proper token allocation</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-bold text-xl text-gray-900">€{amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-2">Important Instructions:</p>
                  <ul className="text-xs text-orange-800 space-y-1">
                    <li>• Use the exact reference number provided above</li>
                    <li>• Transfer the exact amount (€{amount})</li>
                    <li>• Processing time: 1-3 business days</li>
                    <li>• Tokens will be distributed within 24h of payment confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={simulatePaymentProcessing}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                I've Made the Transfer
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Need help? Contact our support team at support@fundraise.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Investment Amount</span>
              <span className="font-bold text-gray-900">€{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Tokens to Receive</span>
              <span className="font-medium text-gray-900">{tokensToReceive.toLocaleString()} {project.symbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Project</span>
              <span className="font-medium text-gray-900">{project.name}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handlePaymentMethodSelect('fiat')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Bank Transfer (EUR)</h3>
                  <p className="text-sm text-gray-600">Transfer EUR to Circle IBAN</p>
                  <p className="text-xs text-blue-600">Recommended • Secure • 1-3 days</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePaymentMethodSelect('crypto')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Crypto Payment</h3>
                  <p className="text-sm text-gray-600">Pay with cryptocurrency</p>
                  <p className="text-xs text-orange-600">Coming Soon</p>
                </div>
              </div>
            </button>
          </div>

          {paymentStatus && paymentStatus.status === 'pending' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                <p className="text-sm text-blue-800">{paymentStatus.message}</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your payment is secured with industry-standard encryption and processed through regulated financial institutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;