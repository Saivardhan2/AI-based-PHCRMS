import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = userType === 'farmer' ? '/api/farmers/login' : '/api/buyers/login';
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        toast.success(t('login.login_success'));
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', response.data.data[userType].id);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.server_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('login.title')}
          </h2>
          <p className="text-gray-600">
            {t('login.register_prompt')} <Link to="/farmer-register" className="text-green-600 hover:text-green-700">{t('common.register')}</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          {/* User Type Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserType('farmer')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  userType === 'farmer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('login.farmer_login')}
              </button>
              <button
                onClick={() => setUserType('buyer')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  userType === 'buyer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('login.buyer_login')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.email')} *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')} *
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button className="font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.loading') : t('login.login')}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  to="/farmer-register"
                  className="btn-outline text-center"
                >
                  Farmer Register
                </Link>
                <Link
                  to="/buyer-register"
                  className="btn-outline text-center"
                >
                  Buyer Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
