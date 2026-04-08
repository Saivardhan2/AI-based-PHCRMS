import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/outline';

const Transactions = () => {
  const { t } = useTranslation();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const { data: transactions, isLoading } = useQuery(
    ['transactions', userRole, userId],
    async () => {
      const endpoint = userRole === 'farmer' 
        ? `/api/transactions/farmer/${userId}`
        : `/api/transactions/buyer/${userId}`;
      
      const response = await axios.get(endpoint);
      return response.data.data;
    },
    {
      enabled: !!userId && !!userRole
    }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'confirmed':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = async () => {
    if (!negotiationMessage.trim() || !selectedTransaction) return;
    
    try {
      await axios.post(`/api/transactions/${selectedTransaction._id}/negotiation`, {
        message: negotiationMessage,
        sender: userRole
      });
      
      setNegotiationMessage('');
      setShowNegotiation(false);
      // Refetch transactions would happen here
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('transactions.title')}
          </h1>
          <p className="text-gray-600">
            Track your transaction history and manage negotiations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('transactions.transaction_history')}
              </h2>
              
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(transaction.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">
                                {userRole === 'farmer' ? t('transactions.buyer') : t('transactions.farmer')}
                              </p>
                              <p className="font-medium text-gray-900">
                                {userRole === 'farmer' 
                                  ? transaction.buyerId?.businessName 
                                  : transaction.farmerId?.name
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('transactions.quantity')}</p>
                              <p className="font-medium text-gray-900">
                                {transaction.quantity} tons
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('transactions.total_price')}</p>
                              <p className="font-medium text-gray-900">
                                ${transaction.totalPrice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Crop: {transaction.residueDetails?.cropType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No transactions found</div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="lg:col-span-1">
            {selectedTransaction ? (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Transaction Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-900">
                      {selectedTransaction._id.slice(-8)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      {userRole === 'farmer' ? t('transactions.buyer') : t('transactions.farmer')}
                    </p>
                    <p className="font-medium text-gray-900">
                      {userRole === 'farmer' 
                        ? selectedTransaction.buyerId?.businessName 
                        : selectedTransaction.farmerId?.name
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {userRole === 'farmer' 
                        ? selectedTransaction.buyerId?.location?.district
                        : selectedTransaction.farmerId?.location?.district
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Residue Details</p>
                    <p className="font-medium text-gray-900">
                      {selectedTransaction.residueDetails?.cropType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {selectedTransaction.residueDetails?.totalResidue} tons
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('transactions.quantity')}</p>
                      <p className="font-medium text-gray-900">
                        {selectedTransaction.quantity} tons
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price/ton</p>
                      <p className="font-medium text-gray-900">
                        ${selectedTransaction.pricePerUnit}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">{t('transactions.total_price')}</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedTransaction.totalPrice}
                    </p>
                  </div>

                  {/* Negotiation Section */}
                  {selectedTransaction.status !== 'completed' && selectedTransaction.status !== 'cancelled' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-900">
                          {t('transactions.negotiation')}
                        </p>
                        <button
                          onClick={() => setShowNegotiation(!showNegotiation)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {showNegotiation ? 'Hide' : t('transactions.send_message')}
                        </button>
                      </div>

                      {showNegotiation && (
                        <div className="space-y-3">
                          <textarea
                            value={negotiationMessage}
                            onChange={(e) => setNegotiationMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="input-field resize-none"
                            rows="3"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="btn-primary w-full text-sm"
                          >
                            Send Message
                          </button>
                        </div>
                      )}

                      {/* Display negotiation history */}
                      {selectedTransaction.negotiation && selectedTransaction.negotiation.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {selectedTransaction.negotiation.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-lg text-sm ${
                                msg.sender === userRole
                                  ? 'bg-green-50 text-green-800 ml-auto max-w-[80%]'
                                  : 'bg-gray-50 text-gray-800 max-w-[80%]'
                              }`}
                            >
                              <p>{msg.message}</p>
                              <p className="text-xs opacity-75 mt-1">
                                {new Date(msg.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Environmental Impact */}
                  {selectedTransaction.environmentalImpact && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Environmental Impact
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">CO₂ Reduction:</span>
                          <span className="font-medium text-green-600">
                            {selectedTransaction.environmentalImpact.co2Reduction} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trees Saved:</span>
                          <span className="font-medium text-green-600">
                            {selectedTransaction.environmentalImpact.treesSaved}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-8">
                  <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a transaction to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
