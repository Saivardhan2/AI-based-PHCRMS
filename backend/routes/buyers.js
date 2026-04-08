const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Buyer = require('../models/Buyer');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id, type: 'buyer' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { 
      businessName, 
      location, 
      businessType, 
      requiredResidueTypes, 
      pricePerUnit, 
      minimumQuantity, 
      maximumQuantity,
      email, 
      phone, 
      password 
    } = req.body;

    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({
        success: false,
        message: 'Buyer with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const buyer = new Buyer({
      businessName,
      location,
      businessType,
      requiredResidueTypes,
      pricePerUnit,
      minimumQuantity,
      maximumQuantity,
      email,
      phone,
      password: hashedPassword
    });

    await buyer.save();

    const token = generateToken(buyer._id);

    res.status(201).json({
      success: true,
      message: 'Buyer registered successfully',
      data: {
        buyer: {
          id: buyer._id,
          businessName: buyer.businessName,
          email: buyer.email,
          location: buyer.location,
          businessType: buyer.businessType,
          requiredResidueTypes: buyer.requiredResidueTypes,
          pricePerUnit: buyer.pricePerUnit,
          minimumQuantity: buyer.minimumQuantity,
          maximumQuantity: buyer.maximumQuantity
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(buyer._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        buyer: {
          id: buyer._id,
          businessName: buyer.businessName,
          email: buyer.email,
          location: buyer.location,
          businessType: buyer.businessType,
          requiredResidueTypes: buyer.requiredResidueTypes,
          pricePerUnit: buyer.pricePerUnit,
          minimumQuantity: buyer.minimumQuantity,
          maximumQuantity: buyer.maximumQuantity,
          isActive: buyer.isActive
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id).select('-password');
    
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found'
      });
    }

    res.json({
      success: true,
      data: buyer
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const { 
      businessName, 
      location, 
      businessType, 
      requiredResidueTypes, 
      pricePerUnit, 
      minimumQuantity, 
      maximumQuantity,
      phone,
      isActive 
    } = req.body;
    
    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      { 
        businessName, 
        location, 
        businessType, 
        requiredResidueTypes, 
        pricePerUnit, 
        minimumQuantity, 
        maximumQuantity,
        phone,
        isActive 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: buyer
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { 
      residueType, 
      minQuantity, 
      maxQuantity, 
      location, 
      businessType 
    } = req.query;

    let query = { isActive: true };

    if (residueType) {
      query.requiredResidueTypes = { $in: [residueType] };
    }

    if (minQuantity) {
      query.minimumQuantity = { $lte: minQuantity };
    }

    if (maxQuantity) {
      query.$or = [
        { maximumQuantity: { $gte: maxQuantity } },
        { maximumQuantity: { $exists: false } }
      ];
    }

    if (businessType) {
      query.businessType = businessType;
    }

    const buyers = await Buyer.find(query).select('-password');

    res.json({
      success: true,
      data: buyers
    });
  } catch (error) {
    console.error('Buyers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching buyers'
    });
  }
});

module.exports = router;
