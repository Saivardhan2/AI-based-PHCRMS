# AI-based Post-Harvest Crop Residue Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18.0+-green.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-yellow.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0+-green.svg)

An intelligent, full-stack web-based system for Post-Harvest Crop and Crop Residue Management that leverages Artificial Intelligence for residue estimation, utilization optimization, buyer recommendation, and environmental impact analysis.

## Features

### Farmer Registration Module
- Register with name, location, crop type, yield, and cultivated area
- AI-based residue estimation
- Smart utilization recommendations

### AI-Based Residue Estimation Model
- Machine Learning model for residue prediction
- Takes crop type, yield, and area as input
- Predicts total residue quantity and types

### Intelligent Residue Utilization Engine
- Dynamic suggestions based on quantity and type
- Alternative utilization methods for low quantities
- Cost-benefit analysis and sustainability impact

### Buyer Registration Module
- Industries, biomass plants, fodder suppliers
- Business details and requirements
- Price and demand specifications

### Smart Recommendation Engine
- Ranking-based buyer matching
- Distance, price, and demand optimization
- Maximum profit estimation

### Environmental Impact Calculator
- CO2 reduction metrics
- Air quality improvement tracking
- Trees saved equivalent calculation
- Sustainability score generation

### Digital Marketplace
- Real-time residue listings
- Price trends and analytics
- Direct farmer-buyer communication
- Transaction management

## Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Router** - Navigation
- **React Hook Form** - Form management
- **i18next** - Internationalization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Axios** - HTTP client

### AI/ML Services
- **Python** - AI service language
- **Flask** - Web framework
- **scikit-learn** - Machine learning library
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing

## Project Structure

```
crop-residue-management/
|
|-- frontend/                 # React.js frontend application
|   |-- src/
|   |   |-- components/       # Reusable UI components
|   |   |-- pages/           # Page components
|   |   |-- i18n/            # Internationalization
|   |   |-- App.js           # Main application component
|   |   |-- index.js         # Application entry point
|   |-- public/              # Static assets
|   |-- package.json         # Frontend dependencies
|
|-- backend/                  # Node.js backend API
|   |-- models/              # Database models
|   |-- routes/              # API routes
|   |-- middleware/          # Custom middleware
|   |-- config/              # Configuration files
|   |-- server.js            # Main server file
|   |-- package.json         # Backend dependencies
|
|-- ai-model/                 # Python AI services
|   |-- app.py               # Flask application
|   |-- requirements.txt     # Python dependencies
|
|-- docs/                     # Documentation
|   |-- API-Documentation.md
|   |-- Setup-Instructions.md
|
|-- README.md                 # Project documentation
```

## Installation and Setup

### Prerequisites
- Node.js 18.0 or higher
- Python 3.8 or higher
- MongoDB 6.0 or higher
- Git
- Code editor (VS Code recommended)

### Quick Start Guide (5 Minutes)

**Step 1: Clone the Repository**
```bash
git clone https://github.com/Saivardhan2/AI-based-PHCRMS.git
cd AI-based-PHCRMS
```

**Step 2: Setup Backend**
```bash
cd backend
npm install
# Create .env file with MongoDB connection
echo "MONGODB_URI=mongodb://localhost:27017/crop-residue-management" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env
npm run dev
```

**Step 3: Setup Frontend**
```bash
# Open new terminal
cd frontend
npm install
npm start
```

**Step 4: Setup AI Model**
```bash
# Open third terminal
cd ai-model
pip install -r requirements.txt
python app.py
```

**Step 5: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

### Detailed Setup Instructions

#### 1. System Requirements Check
```bash
# Check Node.js version
node --version  # Should be 18.0 or higher

# Check Python version
python --version  # Should be 3.8 or higher

# Check MongoDB
mongod --version  # Should be 6.0 or higher
```

#### 2. MongoDB Setup
**Windows:**
```bash
# Install MongoDB Community Server
# Download from: https://www.mongodb.com/try/download/community
# Start MongoDB service
net start MongoDB
```

**macOS:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Backend Configuration
```bash
cd backend
npm install

# Create environment file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/crop-residue-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
EOF

# Start backend server
npm run dev
```

#### 4. Frontend Configuration
```bash
cd frontend
npm install

# Create environment file (optional)
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:5001
EOF

# Start frontend
npm start
```

#### 5. AI Model Setup
```bash
cd ai-model

# Install Python dependencies
pip install -r requirements.txt

# Start AI service
python app.py
```

### Verification Steps

**1. Check Backend Health**
```bash
curl http://localhost:5000/api/health
# Expected: {"status": "ok", "message": "Server is running"}
```

**2. Check AI Service Health**
```bash
curl http://localhost:5001/
# Expected: Flask server response
```

**3. Check Frontend**
- Open browser and navigate to http://localhost:3000
- Should see the application homepage

### Troubleshooting

#### Common Issues and Solutions

**Issue: MongoDB Connection Failed**
```bash
# Solution: Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS
net start MongoDB  # Windows

# Start MongoDB if not running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Issue: Port Already in Use**
```bash
# Find process using port
netstat -tulpn | grep :5000  # Linux
netstat -ano | findstr :5000  # Windows

# Kill process
sudo kill -9 <PID>  # Linux
taskkill /PID <PID> /F  # Windows

# Alternative: Use different port
PORT=5001 npm run dev
```

**Issue: Python Dependencies Not Found**
```bash
# Solution: Use virtual environment
python -m venv ai-env
source ai-env/bin/activate  # Linux/macOS
ai-env\Scripts\activate  # Windows
pip install -r requirements.txt
```

**Issue: Node.js Version Incompatible**
```bash
# Solution: Use nvm to manage Node versions
nvm install 18
nvm use 18
nvm alias default 18
```

#### Development Tips

**1. Running All Services Simultaneously**
```bash
# Use terminal multiplexer (tmux or screen)
# Or use IDE with multiple terminals
# Or use process managers like PM2
```

**2. Environment Variables**
```bash
# Always use .env files for sensitive data
# Never commit .env files to Git
# Use different configs for development/production
```

**3. Database Initialization**
```bash
# MongoDB will create database automatically
# No manual setup required for basic usage
# Data persists across restarts
```

### Production Deployment

For production deployment, refer to [Deployment Guide](docs/Deployment-Guide.md) (coming soon).

### Docker Setup (Advanced)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

For detailed setup instructions, refer to [Setup Guide](docs/Setup-Instructions.md).

## API Documentation

The API documentation is available at [API Documentation](docs/API-Documentation.md).

### Key Endpoints

- `POST /api/farmers/register` - Register new farmer
- `POST /api/buyers/register` - Register new buyer
- `POST /api/ai/predict-residue` - AI residue estimation
- `GET /api/marketplace/residue-listings` - Get marketplace listings
- `GET /api/marketplace/buyer-recommendations/:farmerId` - Get buyer recommendations

## Usage

### For Farmers
1. Register as a farmer with your details
2. Estimate crop residue using AI model
3. Get utilization recommendations
4. Post residue to marketplace
5. Connect with interested buyers
6. Track environmental impact

### For Buyers
1. Register as a buyer with business details
2. Browse available residue listings
3. Contact farmers for purchases
4. Manage transactions
5. View market trends and analytics

## Features in Action

### AI Residue Estimation
- Input crop type, yield, and cultivated area
- Get accurate residue quantity predictions
- Receive residue type breakdown
- View environmental impact metrics

### Smart Marketplace
- Real-time residue listings
- Advanced filtering and search
- Price trend analysis
- Direct communication channels

### Environmental Tracking
- CO2 reduction calculations
- Air quality improvement metrics
- Trees saved equivalent
- Sustainability scoring

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Farmers and agricultural experts for domain knowledge
- AI/ML community for algorithms and techniques
- Open source community for tools and libraries

## Contact

For any queries or support, please reach out to:
- GitHub: [@Saivardhan2](https://github.com/Saivardhan2)
- Email: [your-email@example.com]

## Live Demo

The application is deployed and available at: [Live Demo URL](https://your-demo-url.com)

---

**Note**: This project is part of sustainable agriculture initiatives aimed at reducing crop residue burning and promoting eco-friendly waste management practices.
