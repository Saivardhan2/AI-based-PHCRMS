# Crop Residue Management System - API Documentation

## Overview

This API provides endpoints for the AI-Powered Post-Harvest Crop Residue Management & Smart Marketplace system. It supports farmer and buyer registration, residue estimation, marketplace operations, and environmental impact tracking.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Farmers

#### Register Farmer
```
POST /api/farmers/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "location": {
    "village": "Sample Village",
    "district": "Sample District",
    "state": "Sample State"
  },
  "cropType": "rice",
  "yield": 5.5,
  "cultivatedArea": 2.5,
  "email": "farmer@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Farmer registered successfully",
  "data": {
    "farmer": {
      "id": "farmer_id",
      "name": "John Doe",
      "email": "farmer@example.com",
      "location": {...},
      "cropType": "rice",
      "yield": 5.5,
      "cultivatedArea": 2.5
    },
    "token": "jwt_token"
  }
}
```

#### Farmer Login
```
POST /api/farmers/login
```

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

#### Get Farmer Profile
```
GET /api/farmers/profile/:id
```

#### Update Farmer Profile
```
PUT /api/farmers/profile/:id
```

### Buyers

#### Register Buyer
```
POST /api/buyers/register
```

**Request Body:**
```json
{
  "businessName": "Sample Biomass Plant",
  "location": {
    "address": "123 Business St",
    "district": "Business District",
    "state": "Business State"
  },
  "businessType": "biomass_plant",
  "requiredResidueTypes": ["straw", "husk"],
  "pricePerUnit": 45.50,
  "minimumQuantity": 10,
  "maximumQuantity": 100,
  "email": "buyer@example.com",
  "phone": "0987654321",
  "password": "password123"
}
```

#### Buyer Login
```
POST /api/buyers/login
```

#### Get Buyer Profile
```
GET /api/buyers/profile/:id
```

#### Update Buyer Profile
```
PUT /api/buyers/profile/:id
```

#### Get All Buyers
```
GET /api/buyers
```

**Query Parameters:**
- `residueType`: Filter by required residue type
- `minQuantity`: Filter by minimum quantity
- `maxQuantity`: Filter by maximum quantity
- `location`: Filter by location
- `businessType`: Filter by business type

### Transactions

#### Create Transaction
```
POST /api/transactions
```

**Request Body:**
```json
{
  "farmerId": "farmer_id",
  "buyerId": "buyer_id",
  "residueDetails": {
    "cropType": "rice",
    "totalResidue": 7.5,
    "residueTypes": [
      {"type": "straw", "quantity": 4.5},
      {"type": "husk", "quantity": 3.0}
    ]
  },
  "quantity": 5.0,
  "pricePerUnit": 45.50,
  "totalPrice": 227.50,
  "environmentalImpact": {
    "co2Reduction": 20.25,
    "pm25Reduction": 4.0,
    "treesSaved": 0.92
  }
}
```

#### Get Farmer Transactions
```
GET /api/transactions/farmer/:farmerId
```

#### Get Buyer Transactions
```
GET /api/transactions/buyer/:buyerId
```

#### Update Transaction Status
```
PUT /api/transactions/:transactionId/status
```

**Request Body:**
```json
{
  "status": "completed"
}
```

#### Add Negotiation Message
```
POST /api/transactions/:transactionId/negotiation
```

**Request Body:**
```json
{
  "message": "Can we negotiate the price?",
  "sender": "farmer"
}
```

### AI Services

#### Predict Residue
```
POST /api/ai/predict-residue
```

**Request Body:**
```json
{
  "crop_type": "rice",
  "yield": 5.5,
  "area": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_residue": 8.25,
    "residue_types": [
      {"type": "straw", "quantity": 4.95},
      {"type": "husk", "quantity": 2.06},
      {"type": "stubble", "quantity": 1.24}
    ]
  }
}
```

#### Get Utilization Recommendation
```
POST /api/ai/utilization-recommendation
```

**Request Body:**
```json
{
  "residue_quantity": 8.25,
  "buyer_demand": 10
}
```

#### Recommend Buyers
```
POST /api/ai/recommend-buyers
```

**Request Body:**
```json
{
  "farmer_location": {
    "coordinates": {"latitude": 28.6139, "longitude": 77.2090}
  },
  "residue_quantity": 8.25,
  "residue_types": ["straw", "husk"],
  "buyers": [...]
}
```

#### Calculate Environmental Impact
```
POST /api/ai/environmental-impact
```

**Request Body:**
```json
{
  "crop_type": "rice",
  "residue_quantity": 8.25,
  "utilization_method": "sold"
}
```

### Marketplace

#### Get Dashboard Data
```
GET /api/marketplace/dashboard/:farmerId
```

#### Get Residue Listings
```
GET /api/marketplace/residue-listings
```

**Query Parameters:**
- `cropType`: Filter by crop type
- `location`: Filter by location
- `minQuantity`: Filter by minimum quantity

#### Find Matching Buyers
```
POST /api/marketplace/find-matching-buyers
```

#### Get Price Trends
```
GET /api/marketplace/price-trends
```

**Query Parameters:**
- `cropType`: Filter by crop type
- `residueType`: Filter by residue type
- `timeRange`: Time range in days (default: 30)

#### Get Environmental Statistics
```
GET /api/marketplace/environmental-stats
```

**Query Parameters:**
- `timeRange`: Time range in days (default: 30)
- `userId`: User ID for user-specific stats
- `userType`: User type ('farmer' or 'buyer')

#### Get Notifications
```
GET /api/marketplace/notifications/:userId
```

**Query Parameters:**
- `userType`: User type ('farmer' or 'buyer')

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development mode)"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Invalid or missing token
- `404`: Not Found - Resource not found
- `500`: Server Error - Internal server error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15-minute window per IP address.

## Data Models

### Farmer
```json
{
  "id": "string",
  "name": "string",
  "location": {
    "village": "string",
    "district": "string",
    "state": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    }
  },
  "cropType": "string",
  "yield": "number",
  "cultivatedArea": "number",
  "email": "string",
  "phone": "string",
  "residueEstimations": [...],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Buyer
```json
{
  "id": "string",
  "businessName": "string",
  "location": {
    "address": "string",
    "district": "string",
    "state": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    }
  },
  "businessType": "string",
  "requiredResidueTypes": ["string"],
  "pricePerUnit": "number",
  "minimumQuantity": "number",
  "maximumQuantity": "number",
  "email": "string",
  "phone": "string",
  "isActive": "boolean",
  "transactions": [...],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Transaction
```json
{
  "id": "string",
  "farmerId": "string",
  "buyerId": "string",
  "residueDetails": {
    "cropType": "string",
    "totalResidue": "number",
    "residueTypes": [...]
  },
  "quantity": "number",
  "pricePerUnit": "number",
  "totalPrice": "number",
  "status": "string",
  "environmentalImpact": {
    "co2Reduction": "number",
    "pm25Reduction": "number",
    "treesSaved": "number"
  },
  "negotiation": [...],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Testing

Use Postman or similar API testing tools to test the endpoints. The system includes sample data and the AI model can make predictions even without extensive training data.

## Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB with proper authentication
4. Set up proper CORS and security headers
5. Configure rate limiting appropriately
6. Set up monitoring and logging
