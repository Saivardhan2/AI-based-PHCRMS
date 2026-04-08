import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const FarmerRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const cropTypes = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'pulses', 'others'];
  const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/farmers/register', {
        ...data,
        yield: parseFloat(data.yield),
        cultivatedArea: parseFloat(data.cultivatedArea)
      });

      if (response.data.success) {
        toast.success(t('farmer_registration.register_success'));
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', 'farmer');
        localStorage.setItem('userId', response.data.data.farmer.id);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.server_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('farmer_registration.title')}
            </h1>
            <p className="text-gray-600">
              {t('farmer_registration.login_prompt')} <Link to="/login" className="text-green-600 hover:text-green-700">{t('common.login')}</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('farmer_registration.personal_info')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('farmer_registration.name')} *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('farmer_registration.email')} *
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
                    {t('farmer_registration.phone')} *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Phone number must be 10 digits'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('farmer_registration.password')} *
                  </label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('farmer_registration.farm_details')}
              </h2>
              <div className="space-y-6">
                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.village')} *
                    </label>
                    <input
                      type="text"
                      {...register('location.village', { required: 'Village is required' })}
                      className="input-field"
                      placeholder="Enter village name"
                    />
                    {errors.location?.village && <p className="text-red-500 text-sm mt-1">{errors.location.village.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.district')} *
                    </label>
                    <input
                      type="text"
                      {...register('location.district', { required: 'District is required' })}
                      className="input-field"
                      placeholder="Enter district name"
                    />
                    {errors.location?.district && <p className="text-red-500 text-sm mt-1">{errors.location.district.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.state')} *
                    </label>
                    <select
                      {...register('location.state', { required: 'State is required' })}
                      className="input-field"
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.location?.state && <p className="text-red-500 text-sm mt-1">{errors.location.state.message}</p>}
                  </div>
                </div>

                {/* Crop Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.crop_type')} *
                    </label>
                    <select
                      {...register('cropType', { required: 'Crop type is required' })}
                      className="input-field"
                    >
                      <option value="">Select crop type</option>
                      {cropTypes.map(crop => (
                        <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                      ))}
                    </select>
                    {errors.cropType && <p className="text-red-500 text-sm mt-1">{errors.cropType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.yield')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('yield', { 
                        required: 'Yield is required',
                        min: {
                          value: 0.1,
                          message: 'Yield must be greater than 0'
                        }
                      })}
                      className="input-field"
                      placeholder="Enter yield in tons"
                    />
                    {errors.yield && <p className="text-red-500 text-sm mt-1">{errors.yield.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmer_registration.cultivated_area')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('cultivatedArea', { 
                        required: 'Cultivated area is required',
                        min: {
                          value: 0.1,
                          message: 'Area must be greater than 0'
                        }
                      })}
                      className="input-field"
                      placeholder="Enter area in acres"
                    />
                    {errors.cultivatedArea && <p className="text-red-500 text-sm mt-1">{errors.cultivatedArea.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to="/"
                className="btn-outline"
              >
                {t('common.cancel')}
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.loading') : t('common.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistration;
