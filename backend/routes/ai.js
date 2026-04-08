const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

router.post('/predict-residue', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-residue`, req.body);
    
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to AI service',
      error: error.response?.data?.error || error.message
    });
  }
});

router.post('/utilization-recommendation', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/utilization-recommendation`, req.body);
    
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Utilization recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to AI service',
      error: error.response?.data?.error || error.message
    });
  }
});

router.post('/recommend-buyers', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/recommend-buyers`, req.body);
    
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Buyer recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to AI service',
      error: error.response?.data?.error || error.message
    });
  }
});

router.post('/environmental-impact', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/environmental-impact`, req.body);
    
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Environmental impact calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to AI service',
      error: error.response?.data?.error || error.message
    });
  }
});

router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('AI service health check error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service is not available'
    });
  }
});

module.exports = router;
