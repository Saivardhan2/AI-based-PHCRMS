import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  BeakerIcon,
  CalculatorIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/outline';

const ResidueEstimation = () => {
  const { t } = useTranslation();
  const [estimation, setEstimation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const userId = localStorage.getItem('userId');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const cropTypes = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'pulses', 'others'];

  const { data: utilizationRecommendation } = useQuery(
    ['utilization-recommendation', estimation?.total_residue],
    async () => {
      if (!estimation?.total_residue) return null;
      
      const response = await axios.post('/api/ai/utilization-recommendation', {
        residue_quantity: estimation.total_residue
      });
      return response.data.data;
    },
    {
      enabled: !!estimation?.total_residue
    }
  );

  const { data: buyerRecommendations } = useQuery(
    ['buyer-recommendations', userId, estimation],
    async () => {
      if (!userId || !estimation?.total_residue) return null;
      
      const response = await axios.get(`/api/marketplace/buyer-recommendations/${userId}`);
      return response.data.data;
    },
    {
      enabled: !!userId && !!estimation?.total_residue
    }
  );

  const { data: environmentalImpact } = useQuery(
    ['environmental-impact', watch('cropType'), estimation?.total_residue],
    async () => {
      if (!watch('cropType') || !estimation?.total_residue) return null;
      
      const response = await axios.post('/api/ai/environmental-impact', {
        crop_type: watch('cropType'),
        residue_quantity: estimation.total_residue,
        utilization_method: utilizationRecommendation?.recommendation === 'sell_to_buyers' ? 'sold' : 'composting'
      });
      return response.data.data;
    },
    {
      enabled: !!watch('cropType') && !!estimation?.total_residue
    }
  );

  const onSubmit = async (data) => {
    setIsCalculating(true);
    try {
      const response = await axios.post('/api/ai/predict-residue', {
        crop_type: data.cropType,
        yield: parseFloat(data.yield),
        area: parseFloat(data.cultivatedArea)
      });

      if (response.data.success) {
        setEstimation(response.data.data);
        toast.success('Residue estimation completed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error estimating residue');
    } finally {
      setIsCalculating(false);
    }
  };

  const getUtilizationIcon = (method) => {
    const icons = {
      'composting': BeakerIcon,
      'animal_fodder': LightBulbIcon,
      'biochar': ChartBarIcon,
      'biogas': CalculatorIcon,
      'mulching': BeakerIcon
    };
    return icons[method] || LightBulbIcon;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('residue_estimation.title')}
          </h1>
          <p className="text-gray-600">
            Get AI-powered estimation of crop residue quantity and utilization recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('residue_estimation.crop_details')}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yield (tons) *
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
                    placeholder="Enter yield"
                  />
                  {errors.yield && <p className="text-red-500 text-sm mt-1">{errors.yield.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultivated Area (acres) *
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
                    placeholder="Enter area"
                  />
                  {errors.cultivatedArea && <p className="text-red-500 text-sm mt-1">{errors.cultivatedArea.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Calculating...' : 'Estimate Residue'}
              </button>
            </form>
          </div>

          {/* Results */}
          {estimation && (
            <div className="space-y-6">
              {/* Estimation Results */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('residue_estimation.estimation_results')}
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {estimation.total_residue} tons
                  </div>
                  <p className="text-gray-600">{t('residue_estimation.total_residue')}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t('residue_estimation.residue_breakdown')}
                  </h3>
                  <div className="space-y-3">
                    {estimation.residue_types.map((residue, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">
                          {residue.type.charAt(0).toUpperCase() + residue.type.slice(1)}
                        </span>
                        <span className="text-green-600 font-semibold">
                          {residue.quantity} tons
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Utilization Recommendations */}
              {utilizationRecommendation && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t('residue_estimation.utilization_recommendations')}
                  </h2>
                  
                  <div className={`p-4 rounded-lg mb-4 ${
                    utilizationRecommendation.recommendation === 'sell_to_buyers' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className="font-medium text-gray-900 mb-2">
                      {utilizationRecommendation.recommendation === 'sell_to_buyers' 
                        ? t('residue_estimation.sell_to_buyers')
                        : t('residue_estimation.alternative_uses')
                      }
                    </p>
                    <p className="text-gray-600 text-sm">
                      {utilizationRecommendation.message}
                    </p>
                  </div>

                  {utilizationRecommendation.recommended_methods && (
                    <div className="space-y-3">
                      {utilizationRecommendation.recommended_methods.map((method, index) => {
                        const Icon = getUtilizationIcon(method.method);
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {method.method.charAt(0).toUpperCase() + method.method.slice(1).replace('_', ' ')}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {method.description}
                                </p>
                                <p className="text-xs text-green-600">
                                  Environmental impact: {method.environmental_impact}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Environmental Impact */}
              {environmentalImpact && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Environmental Benefits
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {environmentalImpact.co2_reduction} kg
                      </div>
                      <p className="text-sm text-gray-600">CO₂ Reduction</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {environmentalImpact.trees_saved}
                      </div>
                      <p className="text-sm text-gray-600">Trees Saved</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buyer Recommendations */}
      {buyerRecommendations && buyerRecommendations.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recommended Buyers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerRecommendations.map((buyer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{buyer.businessName}</h3>
                    <p className="text-sm text-gray-500">{buyer.location.district}, {buyer.location.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">₹{buyer.pricePerUnit}/ton</p>
                    <p className="text-xs text-gray-500">Min: {buyer.minQuantity} tons</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-primary text-sm flex-1">
                    Contact
                  </button>
                  <button className="btn-outline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post to Marketplace Button */}
      {estimation && (
        <div className="card">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ready to Sell?
            </h3>
            <p className="text-gray-600 mb-6">
              Post your residue to the marketplace to connect with interested buyers
            </p>
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="btn-primary btn-lg"
            >
              Post to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidueEstimation;
