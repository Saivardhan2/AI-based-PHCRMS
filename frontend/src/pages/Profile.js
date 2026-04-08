import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  UserIcon,
  LocationMarkerIcon,
  PhoneIcon,
  MailIcon
} from '@heroicons/react/outline';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const { data: profile, isLoading } = useQuery(
    ['profile', userRole, userId],
    async () => {
      const endpoint = userRole === 'farmer' 
        ? `/api/farmers/profile/${userId}`
        : `/api/buyers/profile/${userId}`;
      
      const response = await axios.get(endpoint);
      return response.data.data;
    },
    {
      enabled: !!userId && !!userRole
    }
  );

  const updateProfileMutation = useMutation(
    async (data) => {
      const endpoint = userRole === 'farmer' 
        ? `/api/farmers/profile/${userId}`
        : `/api/buyers/profile/${userId}`;
      
      const response = await axios.put(endpoint, data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        queryClient.invalidateQueries(['profile', userRole, userId]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error updating profile');
      }
    }
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    if (profile) {
      reset(profile);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600">
            Manage your personal and business information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-12 w-12 text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {userRole === 'farmer' ? profile?.name : profile?.businessName}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {userRole === 'farmer' ? 'Farmer' : 'Buyer'}
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MailIcon className="h-4 w-4" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{profile?.phone}</span>
                </div>
                {userRole === 'farmer' ? (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <LocationMarkerIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {profile?.location?.village}, {profile?.location?.district}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <LocationMarkerIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {profile?.location?.address}, {profile?.location?.district}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Member since {new Date(profile?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('profile.update_profile')}
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="btn-primary text-sm"
                  >
                    {t('common.edit')}
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {userRole === 'farmer' ? (
                    <>
                      {/* Farmer Fields */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.personal_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('farmer_registration.name')}
                            </label>
                            <input
                              type="text"
                              {...register('name', { required: 'Name is required' })}
                              className="input-field"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('farmer_registration.phone')}
                            </label>
                            <input
                              type="tel"
                              {...register('phone', { required: 'Phone is required' })}
                              className="input-field"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.farm_business_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('farmer_registration.crop_type')}
                            </label>
                            <select {...register('cropType')} className="input-field">
                              <option value="rice">Rice</option>
                              <option value="wheat">Wheat</option>
                              <option value="maize">Maize</option>
                              <option value="sugarcane">Sugarcane</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('farmer_registration.yield')}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register('yield')}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('farmer_registration.cultivated_area')}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register('cultivatedArea')}
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Buyer Fields */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.business_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('buyer_registration.business_name')}
                            </label>
                            <input
                              type="text"
                              {...register('businessName', { required: 'Business name is required' })}
                              className="input-field"
                            />
                            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('buyer_registration.phone')}
                            </label>
                            <input
                              type="tel"
                              {...register('phone', { required: 'Phone is required' })}
                              className="input-field"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Requirements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('buyer_registration.price_per_unit')}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register('pricePerUnit')}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('buyer_registration.minimum_quantity')}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register('minimumQuantity')}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('buyer_registration.maximum_quantity')}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register('maximumQuantity')}
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-outline"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {updateProfileMutation.isLoading ? t('common.loading') : t('common.save')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {userRole === 'farmer' ? (
                    <>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.personal_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500">{t('farmer_registration.name')}</p>
                            <p className="font-medium text-gray-900">{profile?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('farmer_registration.phone')}</p>
                            <p className="font-medium text-gray-900">{profile?.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.farm_business_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-gray-500">{t('farmer_registration.crop_type')}</p>
                            <p className="font-medium text-gray-900 capitalize">{profile?.cropType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('farmer_registration.yield')}</p>
                            <p className="font-medium text-gray-900">{profile?.yield} tons</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('farmer_registration.cultivated_area')}</p>
                            <p className="font-medium text-gray-900">{profile?.cultivatedArea} acres</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.business_details')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500">{t('buyer_registration.business_name')}</p>
                            <p className="font-medium text-gray-900">{profile?.businessName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('buyer_registration.phone')}</p>
                            <p className="font-medium text-gray-900">{profile?.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Requirements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-gray-500">{t('buyer_registration.price_per_unit')}</p>
                            <p className="font-medium text-gray-900">${profile?.pricePerUnit}/ton</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('buyer_registration.minimum_quantity')}</p>
                            <p className="font-medium text-gray-900">{profile?.minimumQuantity} tons</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('buyer_registration.maximum_quantity')}</p>
                            <p className="font-medium text-gray-900">
                              {profile?.maximumQuantity || 'No limit'} tons
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
