import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  SearchIcon,
  MapIcon,
  UserGroupIcon,
  TrendingUpIcon
} from '@heroicons/react/outline';

const Marketplace = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    cropType: '',
    location: '',
    minQuantity: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: listings, isLoading: listingsLoading } = useQuery(
    ['residue-listings', filters],
    async () => {
      const response = await axios.get('/api/marketplace/residue-listings', { params: filters });
      return response.data.data;
    }
  );

  const { data: priceTrends } = useQuery(
    'price-trends',
    async () => {
      const response = await axios.get('/api/marketplace/price-trends');
      return response.data.data;
    }
  );

  const { data: notifications } = useQuery(
    'notifications',
    async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];
      const response = await axios.get(`/api/marketplace/notifications/${userId}`);
      return response.data.data;
    }
  );

  const { data: priceAlerts } = useQuery(
    'price-alerts',
    async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];
      const response = await axios.get(`/api/marketplace/price-alerts/${userId}`);
      return response.data.data;
    }
  );

  const { data: buyerRecommendations } = useQuery(
    'buyer-recommendations',
    async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];
      const response = await axios.get(`/api/marketplace/buyer-recommendations/${userId}`);
      return response.data.data;
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = (listing) => {
    // Show listing details in a modal or navigate
    alert(`Listing Details:\n\nFarmer: ${listing.farmerName}\nCrop: ${listing.cropType}\nResidue: ${listing.residueDetails?.totalResidue || 0} tons\nLocation: ${listing.location?.district}, ${listing.location?.state}\nListed: ${new Date(listing.listedDate).toLocaleDateString()}`);
  };

  const handleContactBuyer = (listing) => {
    // Contact the farmer (note: this should be farmer, not buyer)
    alert(`Contact Farmer:\n\nName: ${listing.farmerName}\nLocation: ${listing.location?.district}, ${listing.location?.state}\n\nContact feature will be available soon!`);
  };

  const handlePostListing = () => {
    // Navigate to residue estimation to create a listing
    window.location.href = '/residue-estimation';
  };

  const handleViewBuyerRecommendations = () => {
    // Show buyer recommendations in a modal or navigate
    alert('Buyer recommendations feature coming soon!');
  };

  const handleCheckPriceAlerts = () => {
    // Show price alerts
    if (priceAlerts && priceAlerts.length > 0) {
      alert(`Price Alerts:\n${priceAlerts.map(alert => `${alert.cropType}: ₹${alert.currentPrice}/ton (${alert.trend})`).join('\n')}`);
    } else {
      alert('No price alerts available');
    }
  };

  const filteredListings = listings?.filter(listing => 
    listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.cropType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('marketplace.title')}
          </h1>
          <p className="text-gray-600">
            Connect with farmers and buyers for sustainable crop residue management
          </p>
        </div>

        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="mb-6">
            {notifications.map((notification, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                <p className="text-blue-800 font-medium">{notification.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by farmer name or crop type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filters.cropType}
                    onChange={(e) => handleFilterChange('cropType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Crops</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="sugarcane">Sugarcane</option>
                  </select>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Locations</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('marketplace.residue_listings')}
              </h2>
              
              {listingsLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">{t('common.loading')}</div>
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="space-y-4">
                  {filteredListings.map((listing, index) => (
                    <div key={index} className="card hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {listing.farmerName}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Crop Type</p>
                              <p className="font-medium text-gray-900 capitalize">
                                {listing.cropType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Residue</p>
                              <p className="font-medium text-gray-900">
                                {listing.residueDetails?.totalResidue || 0} tons
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapIcon className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">
                                  {listing.location?.district}, {listing.location?.state}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Listed Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(listing.listedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {listing.residueDetails?.residueTypes && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-500 mb-2">Residue Types</p>
                              <div className="flex flex-wrap gap-2">
                                {listing.residueDetails.residueTypes.map((residue, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                  >
                                    {residue.type}: {residue.quantity} tons
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button 
                          onClick={() => handleViewDetails(listing)}
                          className="btn-outline text-sm"
                        >
                          {t('marketplace.view_details')}
                        </button>
                        <button 
                          onClick={() => handleContactBuyer(listing)}
                          className="btn-primary text-sm"
                        >
                          {t('marketplace.contact_buyer')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No residue listings found</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Trends */}
            {priceTrends && priceTrends.length > 0 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUpIcon className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('marketplace.price_trends')}
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {priceTrends.slice(-5).reverse().map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{trend.date}</p>
                        <p className="font-medium text-gray-900">
                          ${trend.avgPrice}/ton
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {trend.transactionCount} transactions
                        </p>
                        <p className="text-sm text-gray-900">
                          {trend.totalQuantity} tons
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Stats */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Market Statistics
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-semibold text-gray-900">
                    {filteredListings.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Residue Available</span>
                  <span className="font-semibold text-gray-900">
                    {filteredListings.reduce((acc, listing) => 
                      acc + (listing.residueDetails?.totalResidue || 0), 0
                    ).toFixed(1)} tons
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Price</span>
                  <span className="font-semibold text-gray-900">
                    ${priceTrends?.[priceTrends.length - 1]?.avgPrice || 0}/ton
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={handlePostListing}
                  className="w-full btn-secondary text-sm"
                >
                  Post Residue Listing
                </button>
                <button 
                  onClick={handleViewBuyerRecommendations}
                  className="w-full btn-outline text-sm"
                >
                  View Buyer Recommendations
                </button>
                <button 
                  onClick={handleCheckPriceAlerts}
                  className="w-full btn-outline text-sm"
                >
                  Check Price Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
