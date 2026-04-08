import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ChartBarIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/outline';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const { data: dashboardData, isLoading, error } = useQuery(
    ['dashboard', userRole, userId],
    async () => {
      if (!userId || !userRole) {
        throw new Error('User not authenticated');
      }
      
      const endpoint = userRole === 'farmer' 
        ? `/api/marketplace/dashboard/${userId}`
        : `/api/marketplace/buyer-dashboard/${userId}`;
      
      const response = await axios.get(endpoint);
      return response.data.data;
    },
    {
      enabled: !!userId && !!userRole
    }
  );

  if (!userId || !userRole) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{t('errors.server_error')}</div>
      </div>
    );
  }

  const quickActions = userRole === 'farmer' ? [
    {
      title: t('dashboard.estimate_residue'),
      description: 'Get AI-powered residue estimation',
      icon: SparklesIcon,
      link: '/residue-estimation',
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.find_buyers'),
      description: 'Connect with potential buyers',
      icon: UserGroupIcon,
      link: '/marketplace',
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.view_transactions'),
      description: 'Track your transaction history',
      icon: CurrencyDollarIcon,
      link: '/transactions',
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.environmental_impact'),
      description: 'View your environmental contribution',
      icon: ChartBarIcon,
      link: '/environmental-impact',
      color: 'bg-emerald-500'
    }
  ] : [
    {
      title: 'Browse Residues',
      description: 'Find available crop residues',
      icon: SparklesIcon,
      link: '/marketplace',
      color: 'bg-green-500'
    },
    {
      title: 'View Transactions',
      description: 'Manage your transactions',
      icon: CurrencyDollarIcon,
      link: '/transactions',
      color: 'bg-blue-500'
    },
    {
      title: 'Update Profile',
      description: 'Manage your business details',
      icon: UserGroupIcon,
      link: '/profile',
      color: 'bg-purple-500'
    }
  ];

  const stats = userRole === 'farmer' ? [
    {
      label: t('dashboard.total_residue'),
      value: dashboardData?.recentEstimations?.[0]?.totalResidue || 0,
      unit: 'tons',
      icon: SparklesIcon,
      color: 'bg-green-500'
    },
    {
      label: t('dashboard.transactions'),
      value: dashboardData?.stats?.reduce((acc, stat) => acc + stat.count, 0) || 0,
      unit: '',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500'
    },
    {
      label: t('dashboard.environmental_impact'),
      value: dashboardData?.stats?.find(stat => stat._id === 'completed')?.totalValue || 0,
      unit: '$',
      icon: ChartBarIcon,
      color: 'bg-emerald-500'
    },
    {
      label: 'Active Listings',
      value: dashboardData?.recentEstimations?.length || 0,
      unit: '',
      icon: TrendingUpIcon,
      color: 'bg-purple-500'
    }
  ] : [
    {
      label: 'Total Purchased',
      value: dashboardData?.stats?.reduce((acc, stat) => acc + stat.totalQuantity, 0) || 0,
      unit: 'tons',
      icon: SparklesIcon,
      color: 'bg-green-500'
    },
    {
      label: t('dashboard.transactions'),
      value: dashboardData?.stats?.reduce((acc, stat) => acc + stat.count, 0) || 0,
      unit: '',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Spent',
      value: dashboardData?.stats?.reduce((acc, stat) => acc + stat.totalValue, 0) || 0,
      unit: '$',
      icon: ChartBarIcon,
      color: 'bg-emerald-500'
    },
    {
      label: 'Active Orders',
      value: dashboardData?.stats?.find(stat => stat._id === 'pending')?.count || 0,
      unit: '',
      icon: TrendingUpIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')} {dashboardData?.farmer?.name || dashboardData?.buyer?.businessName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {userRole === 'farmer' ? 'Manage your farm residue and connect with buyers' : 'Manage your purchases and find quality residues'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.color} text-white rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {stat.value.toLocaleString()}{stat.unit}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-white/50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('dashboard.quick_actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.link)}
                  className="card text-left hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-green-600 group-hover:text-green-700">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('dashboard.recent_activities')}
            </h2>
            <div className="space-y-4">
              {dashboardData?.recentTransactions?.length > 0 ? (
                dashboardData.recentTransactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {userRole === 'farmer' 
                          ? transaction.buyerId?.businessName 
                          : transaction.farmerId?.name
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.quantity} tons • ${transaction.totalPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent transactions</p>
              )}
            </div>
            {dashboardData?.recentTransactions?.length > 0 && (
              <button
                onClick={() => navigate('/transactions')}
                className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View all transactions →
              </button>
            )}
          </div>

          {/* Recent Estimations (Farmer only) */}
          {userRole === 'farmer' && dashboardData?.recentEstimations && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Residue Estimations
              </h2>
              <div className="space-y-4">
                {dashboardData.recentEstimations.length > 0 ? (
                  dashboardData.recentEstimations.slice(0, 5).map((estimation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {estimation.residueTypes?.[0]?.type || 'Mixed'} Residue
                        </p>
                        <p className="text-sm text-gray-600">
                          {estimation.totalResidue} tons total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(estimation.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No residue estimations yet</p>
                )}
              </div>
              {dashboardData.recentEstimations.length > 0 && (
                <button
                  onClick={() => navigate('/residue-estimation')}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  New estimation →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
