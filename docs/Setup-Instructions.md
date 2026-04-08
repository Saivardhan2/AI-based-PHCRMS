# Crop Residue Management System - Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (v4.4 or higher)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crop-residue-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crop-residue-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
WEATHER_API_KEY=your-weather-api-key
NODE_ENV=development
AI_SERVICE_URL=http://localhost:5001
```

#### Start MongoDB
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Tailwind CSS Configuration
The frontend uses Tailwind CSS for styling. The configuration is already set up in `tailwind.config.js`.

### 4. AI Model Setup

```bash
cd ../ai-model
pip install -r requirements.txt
```

### 5. Start the Application

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```

#### Terminal 2: AI Model Server
```bash
cd ai-model
python app.py
```

#### Terminal 3: Frontend Development Server
```bash
cd frontend
npm start
```

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

## Default Credentials

For testing purposes, you can register new accounts or use the following test credentials:

### Test Farmer
- Email: farmer@test.com
- Password: test123

### Test Buyer
- Email: buyer@test.com
- Password: test123

## Database Schema

The system uses MongoDB with the following collections:

- `farmers`: Farmer registration and profile data
- `buyers`: Buyer registration and business data
- `transactions`: Transaction records and negotiation history

## AI Model Information

The AI model includes:
- **Residue Estimation**: Random Forest model for predicting crop residue quantity
- **Utilization Engine**: Rule-based system for recommending residue usage
- **Recommendation Engine**: Distance and price-based buyer matching
- **Environmental Impact Calculator**: Emission factor-based impact calculation

## API Documentation

See `docs/API-Documentation.md` for detailed API endpoints and usage.

## Development Guidelines

### Code Structure
```
crop-residue-management/
├── backend/          # Node.js Express API
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   └── config/       # Configuration files
├── frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── i18n/        # Internationalization
│   │   └── utils/       # Utility functions
├── ai-model/         # Python Flask AI service
└── docs/            # Documentation
```

### Frontend Features
- Responsive design with Tailwind CSS
- Multilingual support (English, Hindi, Bengali, Telugu, Marathi)
- React Router for navigation
- React Query for API state management
- React Hook Form for form handling
- React Hot Toast for notifications

### Backend Features
- Express.js REST API
- JWT authentication
- MongoDB with Mongoose ODM
- Rate limiting and security headers
- Input validation with Joi
- CORS enabled for frontend

### AI Model Features
- Flask REST API
- Scikit-learn for ML models
- Pandas for data processing
- Random Forest for residue prediction
- Haversine formula for distance calculation

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use Postman or similar tool with the provided API documentation.

## Production Deployment

### Environment Variables
Set the following environment variables for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-secure-jwt-secret
GOOGLE_MAPS_API_KEY=your-production-maps-key
WEATHER_API_KEY=your-production-weather-key
```

### Security Considerations
1. Use HTTPS in production
2. Set strong JWT secrets
3. Enable MongoDB authentication
4. Configure proper CORS origins
5. Set up monitoring and logging
6. Use environment variables for sensitive data

### Docker Deployment
Create a `docker-compose.yml` file for containerized deployment:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/crop-residue-management

  ai-model:
    build: ./ai-model
    ports:
      - "5001:5001"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **Port Conflicts**
   - Change ports in `.env` files if default ports are in use

3. **CORS Issues**
   - Verify frontend URL is in CORS whitelist
   - Check API proxy configuration in frontend

4. **AI Model Not Responding**
   - Ensure Python dependencies are installed
   - Check if AI service is running on port 5001

5. **Authentication Errors**
   - Verify JWT secret is consistent
   - Check token expiration

### Logging

- Backend logs: Console output (use Winston for production logging)
- Frontend logs: Browser console
- AI Model logs: Flask console output

## Support

For issues and questions:
1. Check the API documentation
2. Review the troubleshooting section
3. Check GitHub issues (if applicable)
4. Contact the development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
