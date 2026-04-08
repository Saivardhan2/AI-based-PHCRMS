const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id, type: 'farmer' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, location, cropType, yield: cropYield, cultivatedArea, email, phone, password } = req.body;

    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const farmer = new Farmer({
      name,
      location,
      cropType,
      yield: cropYield,
      cultivatedArea,
      email,
      phone,
      password: hashedPassword
    });

    await farmer.save();

    const token = generateToken(farmer._id);

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: {
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          location: farmer.location,
          cropType: farmer.cropType,
          yield: farmer.yield,
          cultivatedArea: farmer.cultivatedArea
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

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(farmer._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          location: farmer.location,
          cropType: farmer.cropType,
          yield: farmer.yield,
          cultivatedArea: farmer.cultivatedArea
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
    const farmer = await Farmer.findById(req.params.id).select('-password');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: farmer
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
    const { name, location, cropType, yield: cropYield, cultivatedArea, phone } = req.body;
    
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { name, location, cropType, yield: cropYield, cultivatedArea, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: farmer
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

router.get('/residue-estimations/:farmerId', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.farmerId).select('residueEstimations');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: farmer.residueEstimations
    });
  } catch (error) {
    console.error('Residue estimations fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching residue estimations'
    });
  }
});

module.exports = router;
