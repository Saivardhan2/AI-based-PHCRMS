const express = require('express');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Transaction = require('../models/Transaction');
const axios = require('axios');
const router = express.Router();

router.get('/dashboard/:farmerId', async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const transactions = await Transaction.find({ farmerId })
      .populate('buyerId', 'businessName location')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = await Transaction.aggregate([
      { $match: { farmerId: farmerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$residueDetails.quantity' }
        }
      }
    ]);

    const recentEstimations = farmer.residueEstimations || [];

    res.json({
      success: true,
      data: {
        farmer,
        transactions,
        stats,
        recentEstimations
      }
    });
  } catch (error) {
    console.error('Farmer dashboard error:', error);
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

router.get('/buyer-dashboard/:buyerId', async (req, res) => {
  try {
    const buyerId = req.params.buyerId;
    
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found'
      });
    }

    const transactions = await Transaction.find({ buyerId })
      .populate('farmerId', 'name location')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = await Transaction.aggregate([
      { $match: { buyerId: buyerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$residueDetails.quantity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        buyer,
        transactions,
        stats
      }
    });
  } catch (error) {
    console.error('Buyer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

router.get('/buyer-recommendations/:farmerId', async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const latestEstimation = farmer.residueEstimations[farmer.residueEstimations.length - 1];
    if (!latestEstimation) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Find buyers who need this crop type
    const buyers = await Buyer.find({
      'requiredResidueTypes.cropType': farmer.cropType,
      'location.state': farmer.location.state
    }).limit(5);

    const recommendations = buyers.map(buyer => ({
      buyerId: buyer._id,
      businessName: buyer.businessName,
      location: buyer.location,
      pricePerUnit: buyer.pricing.find(p => p.cropType === farmer.cropType)?.pricePerUnit || 0,
      minQuantity: buyer.pricing.find(p => p.cropType === farmer.cropType)?.minQuantity || 0,
      distance: 0 // Simplified - would calculate actual distance
    }));

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Buyer recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching buyer recommendations'
    });
  }
});

router.get('/price-alerts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Sample price alerts data
    const priceAlerts = [
      {
        cropType: 'rice',
        currentPrice: 2500,
        targetPrice: 2800,
        trend: 'increasing',
        timeLeft: '2 days'
      },
      {
        cropType: 'wheat',
        currentPrice: 2200,
        targetPrice: 2400,
        trend: 'stable',
        timeLeft: '5 days'
      }
    ];

    res.json({
      success: true,
      data: priceAlerts
    });
  } catch (error) {
    console.error('Price alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching price alerts'
    });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Sample notifications data
    const notifications = [
      {
        id: 1,
        message: 'New buyer interested in your rice residue listing',
        type: 'interest',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        message: 'Price of wheat residue increased by 10%',
        type: 'price_alert',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
});

router.get('/residue-listings', async (req, res) => {
  try {
    const { cropType, location, minQuantity } = req.query;
    
    let query = {};
    
    if (cropType) {
      query.cropType = cropType;
    }
    
    if (location) {
      query['location.state'] = location;
    }
    
    const farmers = await Farmer.find(query)
      .select('name location cropType yield cultivatedArea residueEstimations')
      .sort({ createdAt: -1 });
    
    // Add sample data if no real data exists
    const sampleListings = [
      {
        farmerId: 'sample1',
        farmerName: 'Ramesh Kumar',
        location: { district: 'Punjab', state: 'Punjab' },
        cropType: 'rice',
        residueDetails: { totalResidue: 2.5 },
        listedDate: new Date().toISOString()
      },
      {
        farmerId: 'sample2',
        farmerName: 'Sunita Patel',
        location: { district: 'Gujarat', state: 'Gujarat' },
        cropType: 'wheat',
        residueDetails: { totalResidue: 1.8 },
        listedDate: new Date().toISOString()
      },
      {
        farmerId: 'sample3',
        farmerName: 'Mohammad Ali',
        location: { district: 'Uttar Pradesh', state: 'Uttar Pradesh' },
        cropType: 'maize',
        residueDetails: { totalResidue: 2.2 },
        listedDate: new Date().toISOString()
      }
    ];
    
    const listings = farmers.map(farmer => {
      const latestEstimation = farmer.residueEstimations[farmer.residueEstimations.length - 1];
      
      if (latestEstimation && (!minQuantity || latestEstimation.totalResidue >= parseFloat(minQuantity))) {
        return {
          farmerId: farmer._id,
          farmerName: farmer.name,
          location: farmer.location,
          cropType: farmer.cropType,
          residueDetails: latestEstimation,
          listedDate: latestEstimation.date
        };
      }
      return null;
    }).filter(listing => listing !== null);

    // Combine real data with sample data
    const allListings = listings.length > 0 ? listings : sampleListings;

    res.json({
      success: true,
      data: allListings
    });
  } catch (error) {
    console.error('Residue listings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching residue listings'
    });
  }
});

router.post('/find-matching-buyers', async (req, res) => {
  try {
    const { farmerId, residueQuantity, residueTypes } = req.body;
    
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const buyers = await Buyer.find({ 
      isActive: true,
      requiredResidueTypes: { $in: residueTypes }
    });

    const aiRequest = {
      farmer_location: farmer.location,
      residue_quantity: residueQuantity,
      residue_types: residueTypes,
      buyers: buyers
    };

    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:5001'}/recommend-buyers`, aiRequest);
    
    res.json({
      success: true,
      data: aiResponse.data.data
    });
  } catch (error) {
    console.error('Buyer matching error:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding matching buyers'
    });
  }
});

router.get('/price-trends', async (req, res) => {
  try {
    const { cropType, residueType, timeRange = '30' } = req.query;
    
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const priceData = await Transaction.aggregate([
      {
        $match: {
          'residueDetails.cropType': cropType || { $exists: true },
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          avgPrice: { $avg: '$pricePerUnit' },
          totalQuantity: { $sum: '$quantity' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const formattedData = priceData.map(item => ({
      date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
      avgPrice: Math.round(item.avgPrice * 100) / 100,
      totalQuantity: item.totalQuantity,
      transactionCount: item.transactionCount
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Price trends fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching price trends'
    });
  }
});

router.get('/environmental-stats', async (req, res) => {
  try {
    const { timeRange = '30', userId, userType } = req.query;
    
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let matchCondition = {
      status: 'completed',
      createdAt: { $gte: startDate }
    };

    if (userId && userType) {
      if (userType === 'farmer') {
        matchCondition.farmerId = userId;
      } else if (userType === 'buyer') {
        matchCondition.buyerId = userId;
      }
    }

    const environmentalStats = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalCO2Reduction: { $sum: '$environmentalImpact.co2Reduction' },
          totalPM25Reduction: { $sum: '$environmentalImpact.pm25Reduction' },
          totalTreesSaved: { $sum: '$environmentalImpact.treesSaved' },
          totalResidueUtilized: { $sum: '$quantity' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    const cropBreakdown = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$residueDetails.cropType',
          totalResidue: { $sum: '$quantity' },
          totalCO2Reduction: { $sum: '$environmentalImpact.co2Reduction' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalResidue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overall: environmentalStats[0] || {
          totalCO2Reduction: 0,
          totalPM25Reduction: 0,
          totalTreesSaved: 0,
          totalResidueUtilized: 0,
          transactionCount: 0
        },
        cropBreakdown
      }
    });
  } catch (error) {
    console.error('Environmental stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching environmental statistics'
    });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType = 'farmer' } = req.query;
    
    const notifications = [];
    
    if (userType === 'farmer') {
      const farmer = await Farmer.findById(userId);
      if (farmer && farmer.residueEstimations.length > 0) {
        const latestEstimation = farmer.residueEstimations[farmer.residueEstimations.length - 1];
        
        const highPriceBuyers = await Buyer.find({
          isActive: true,
          pricePerUnit: { $gt: 50 },
          requiredResidueTypes: { $in: latestEstimation.residueTypes.map(r => r.type) }
        }).limit(5);

        if (highPriceBuyers.length > 0) {
          notifications.push({
            type: 'high_price_buyers',
            message: `${highPriceBuyers.length} buyers offering premium prices for your residue types`,
            data: highPriceBuyers,
            timestamp: new Date()
          });
        }
      }
    }

    const recentTransactions = await Transaction.find({
      [userType === 'farmer' ? 'farmerId' : 'buyerId']: userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentTransactions.length > 0) {
      notifications.push({
        type: 'recent_activity',
        message: `You have ${recentTransactions.length} new transaction activities`,
        data: recentTransactions,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
});

module.exports = router;
