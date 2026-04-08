import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const BuyerRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const businessTypes = ['biomass_plant', 'fodder_supplier', 'biochar_producer', 'biogas_plant', 'composting_facility', 'others'];
  const residueTypes = ['straw', 'husk', 'stubble', 'stalk', 'cob', 'trash', 'leaves', 'tops', 'chaff'];
  const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/buyers/register', {
        ...data,
        pricePerUnit: parseFloat(data.pricePerUnit),
        minimumQuantity: parseFloat(data.minimumQuantity),
        maximumQuantity: data.maximumQuantity ? parseFloat(data.maximumQuantity) : undefined
      });

      if (response.data.success) {
        toast.success(t('buyer_registration.register_success'));
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', 'buyer');
        localStorage.setItem('userId', response.data.data.buyer.id);
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
              {t('buyer_registration.title')}
            </h1>
            <p className="text-gray-600">
              {t('farmer_registration.login_prompt')} <Link to="/login" className="text-green-600 hover:text-green-700">{t('common.login')}</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('buyer_registration.business_info')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('buyer_registration.business_name')} *
                  </label>
                  <input
                    type="text"
                    {...register('businessName', { required: 'Business name is required' })}
                    className="input-field"
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('buyer_registration.business_type')} *
                  </label>
                  <select
                    {...register('businessType', { required: 'Business type is required' })}
                    className="input-field"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('buyer_registration.email')} *
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
                    {t('buyer_registration.phone')} *
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
                    {t('buyer_registration.password')} *
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

            {/* Business Address */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('buyer_registration.address')}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    {...register('location.address', { required: 'Address is required' })}
                    className="input-field"
                    placeholder="Enter complete business address"
                  />
                  {errors.location?.address && <p className="text-red-500 text-sm mt-1">{errors.location.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
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
                      State *
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
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements & Pricing
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('buyer_registration.required_residues')} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {residueTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={type}
                          {...register('requiredResidueTypes', { 
                            required: 'Select at least one residue type',
                            validate: value => value.length > 0 || 'Select at least one residue type'
                          })}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.requiredResidueTypes && <p className="text-red-500 text-sm mt-1">{errors.requiredResidueTypes.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('buyer_registration.price_per_unit')} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('pricePerUnit', { 
                        required: 'Price per unit is required',
                        min: {
                          value: 0.01,
                          message: 'Price must be greater than 0'
                        }
                      })}
                      className="input-field"
                      placeholder="Price per ton"
                    />
                    {errors.pricePerUnit && <p className="text-red-500 text-sm mt-1">{errors.pricePerUnit.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('buyer_registration.minimum_quantity')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('minimumQuantity', { 
                        required: 'Minimum quantity is required',
                        min: {
                          value: 0.1,
                          message: 'Quantity must be greater than 0'
                        }
                      })}
                      className="input-field"
                      placeholder="Minimum tons"
                    />
                    {errors.minimumQuantity && <p className="text-red-500 text-sm mt-1">{errors.minimumQuantity.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('buyer_registration.maximum_quantity')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('maximumQuantity', {
                        validate: value => {
                          const minQty = watch('minimumQuantity');
                          if (!value) return true;
                          return parseFloat(value) > parseFloat(minQty) || 'Maximum must be greater than minimum';
                        }
                      })}
                      className="input-field"
                      placeholder="Maximum tons (optional)"
                    />
                    {errors.maximumQuantity && <p className="text-red-500 text-sm mt-1">{errors.maximumQuantity.message}</p>}
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

export default BuyerRegistration;
