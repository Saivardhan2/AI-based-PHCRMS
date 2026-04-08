import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PlayIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/outline';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: ChartBarIcon,
      title: t('home.features.ai_estimation'),
      description: 'Advanced ML algorithms predict crop residue quantity and types with high accuracy',
      color: 'bg-blue-500'
    },
    {
      icon: UserGroupIcon,
      title: t('home.features.smart_recommendations'),
      description: 'Intelligent matching system connects farmers with optimal buyers based on location and price',
      color: 'bg-green-500'
    },
    {
      icon: SparklesIcon,
      title: t('home.features.environmental_tracking'),
      description: 'Track CO₂ reduction, air quality improvement, and environmental benefits',
      color: 'bg-emerald-500'
    },
    {
      icon: PlayIcon,
      title: t('home.features.marketplace'),
      description: 'Digital platform for seamless transactions and negotiations between farmers and buyers',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Farmers Registered' },
    { number: '500+', label: 'Active Buyers' },
    { number: '50,000+', label: 'Tons of Residue Processed' },
    { number: '100,000+', label: 'Trees Saved Equivalent' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/farmer-register"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {t('home.get_started')}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/marketplace"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {t('home.learn_more')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform leverages cutting-edge technology to revolutionize crop residue management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to transform crop residue into valuable resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', description: 'Farmers and buyers create their accounts with detailed information' },
              { step: '2', title: 'Estimate', description: 'AI predicts residue quantity based on crop data and yield' },
              { step: '3', title: 'Connect', description: 'Smart recommendation system matches farmers with optimal buyers' },
              { step: '4', title: 'Transact', description: 'Complete transactions and track environmental impact' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join thousands of farmers and buyers already benefiting from our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/farmer-register"
              className="bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition duration-200"
            >
              Register as Farmer
            </Link>
            <Link
              to="/buyer-register"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 font-medium py-3 px-8 rounded-lg transition duration-200"
            >
              Register as Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
