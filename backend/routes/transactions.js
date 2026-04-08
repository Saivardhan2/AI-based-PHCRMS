const express = require('express');
const Transaction = require('../models/Transaction');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { 
      farmerId, 
      buyerId, 
      residueDetails, 
      quantity, 
      pricePerUnit, 
      totalPrice,
      environmentalImpact 
    } = req.body;

    const transaction = new Transaction({
      farmerId,
      buyerId,
      residueDetails,
      quantity,
      pricePerUnit,
      totalPrice,
      environmentalImpact
    });

    await transaction.save();

    await Farmer.findByIdAndUpdate(farmerId, {
      $push: { transactions: transaction._id }
    });

    await Buyer.findByIdAndUpdate(buyerId, {
      $push: { transactions: transaction._id }
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('farmerId', 'name email location')
      .populate('buyerId', 'businessName email location');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: populatedTransaction
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating transaction'
    });
  }
});

router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ farmerId: req.params.farmerId })
      .populate('buyerId', 'businessName location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Farmer transactions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
});

router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyerId: req.params.buyerId })
      .populate('farmerId', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Buyer transactions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
});

router.put('/:transactionId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { status },
      { new: true, runValidators: true }
    ).populate('farmerId buyerId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Transaction status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating transaction status'
    });
  }
});

router.post('/:transactionId/negotiation', async (req, res) => {
  try {
    const { message, sender } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      {
        $push: {
          negotiation: {
            message,
            sender,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('farmerId buyerId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Negotiation message added successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Negotiation message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding negotiation message'
    });
  }
});

router.get('/stats/dashboard', async (req, res) => {
  try {
    const { userId, userType } = req.query;

    let matchCondition = {};
    if (userType === 'farmer') {
      matchCondition.farmerId = userId;
    } else if (userType === 'buyer') {
      matchCondition.buyerId = userId;
    }

    const stats = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const environmentalStats = await Transaction.aggregate([
      { $match: { ...matchCondition, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCO2Reduction: { $sum: '$environmentalImpact.co2Reduction' },
          totalPM25Reduction: { $sum: '$environmentalImpact.pm25Reduction' },
          totalTreesSaved: { $sum: '$environmentalImpact.treesSaved' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        transactionStats: stats,
        environmentalImpact: environmentalStats[0] || {
          totalCO2Reduction: 0,
          totalPM25Reduction: 0,
          totalTreesSaved: 0
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
});

module.exports = router;
