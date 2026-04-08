from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

class ResidueEstimationModel:
    def __init__(self):
        self.model = None
        self.crop_encoder = LabelEncoder()
        self.load_or_train_model()
    
    def load_or_train_model(self):
        model_path = 'residue_model.pkl'
        encoder_path = 'crop_encoder.pkl'
        
        if os.path.exists(model_path) and os.path.exists(encoder_path):
            self.model = joblib.load(model_path)
            self.crop_encoder = joblib.load(encoder_path)
            print("Model loaded successfully")
        else:
            self.train_model()
    
    def train_model(self):
        training_data = {
            'crop_type': ['rice', 'rice', 'rice', 'wheat', 'wheat', 'wheat', 'maize', 'maize', 'sugarcane', 'sugarcane'],
            'yield': [5, 4.5, 6, 4, 3.5, 5, 6, 7, 8, 9],
            'area': [2, 1.8, 2.5, 1.5, 1.2, 2, 2.5, 3, 3, 3.5],
            'residue_quantity': [2.5, 2.25, 3.0, 1.6, 1.4, 2.0, 2.1, 2.8, 4.0, 4.5]
        }
        
        df = pd.DataFrame(training_data)
        
        X = df[['crop_type', 'yield', 'area']].copy()
        y = df['residue_quantity']
        
        X['crop_encoded'] = self.crop_encoder.fit_transform(X['crop_type'])
        X = X.drop('crop_type', axis=1)
        
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        joblib.dump(self.model, 'residue_model.pkl')
        joblib.dump(self.crop_encoder, 'crop_encoder.pkl')
        print("Model trained and saved successfully")
    
    def predict_residue(self, crop_type, yield_value, area):
        try:
            # Handle unknown crop types by using a default
            if crop_type not in self.crop_encoder.classes_:
                crop_type = 'rice'  # Default to rice for unknown types
            
            crop_encoded = self.crop_encoder.transform([crop_type])[0]
            features = np.array([[crop_encoded, float(yield_value), float(area)]])
            
            predicted_residue = self.model.predict(features)[0]
            
            # Ensure reasonable bounds
            predicted_residue = max(0.1, min(predicted_residue, float(yield_value) * 0.8))
            
            residue_types = self.get_residue_types(crop_type, predicted_residue)
            
            return {
                'total_residue': round(predicted_residue, 2),
                'residue_types': residue_types,
                'input_data': {
                    'crop_type': crop_type,
                    'yield': yield_value,
                    'area': area
                }
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback to simple calculation
            simple_residue = float(yield_value) * 0.5 * float(area)
            return {
                'total_residue': round(simple_residue, 2),
                'residue_types': self.get_residue_types(crop_type, simple_residue),
                'input_data': {
                    'crop_type': crop_type,
                    'yield': yield_value,
                    'area': area
                }
            }
    
    def get_residue_types(self, crop_type, total_residue):
        type_distributions = {
            'rice': {'straw': 0.6, 'husk': 0.25, 'stubble': 0.15},
            'wheat': {'straw': 0.7, 'chaff': 0.2, 'stubble': 0.1},
            'maize': {'stalk': 0.5, 'husk': 0.3, 'cob': 0.2},
            'sugarcane': {'trash': 0.4, 'leaves': 0.3, 'tops': 0.3}
        }
        
        distribution = type_distributions.get(crop_type, {'other': 1.0})
        
        return [
            {'type': residue_type, 'quantity': round(total_residue * percentage, 2)}
            for residue_type, percentage in distribution.items()
        ]

class UtilizationEngine:
    def __init__(self):
        self.utilization_methods = {
            'composting': {
                'min_quantity': 0.5,
                'max_quantity': 5,
                'cost_benefit': 'Low cost, high soil fertility',
                'environmental_impact': 'Reduces methane emissions, improves soil health'
            },
            'animal_fodder': {
                'min_quantity': 1,
                'max_quantity': 10,
                'cost_benefit': 'Medium cost, saves animal feed expenses',
                'environmental_impact': 'Reduces open burning, provides nutrition'
            },
            'biochar': {
                'min_quantity': 2,
                'max_quantity': 20,
                'cost_benefit': 'High initial cost, long-term soil benefits',
                'environmental_impact': 'Carbon sequestration, improves water retention'
            },
            'biogas': {
                'min_quantity': 3,
                'max_quantity': 50,
                'cost_benefit': 'High setup cost, energy generation',
                'environmental_impact': 'Renewable energy, reduces greenhouse gases'
            },
            'mulching': {
                'min_quantity': 0.3,
                'max_quantity': 8,
                'cost_benefit': 'Very low cost, moisture conservation',
                'environmental_impact': 'Soil erosion control, water conservation'
            }
        }
    
    def get_utilization_recommendation(self, residue_quantity, buyer_demand=None):
        if buyer_demand and residue_quantity >= buyer_demand:
            return {
                'recommendation': 'sell_to_buyers',
                'message': f'Your residue quantity ({residue_quantity} tons) meets buyer demand. Recommended to sell.',
                'alternative_options': []
            }
        
        suitable_methods = []
        for method, details in self.utilization_methods.items():
            if details['min_quantity'] <= residue_quantity <= details['max_quantity']:
                suitable_methods.append({
                    'method': method,
                    'description': details['cost_benefit'],
                    'environmental_impact': details['environmental_impact'],
                    'suitability_score': self.calculate_suitability_score(residue_quantity, method)
                })
        
        suitable_methods.sort(key=lambda x: x['suitability_score'], reverse=True)
        
        return {
            'recommendation': 'alternative_utilization',
            'message': f'Residue quantity ({residue_quantity} tons) is below minimum buyer demand. Consider alternative utilization methods.',
            'recommended_methods': suitable_methods[:3]
        }
    
    def calculate_suitability_score(self, quantity, method):
        base_scores = {
            'composting': 0.8,
            'animal_fodder': 0.7,
            'biochar': 0.6,
            'biogas': 0.5,
            'mulching': 0.9
        }
        
        method_details = self.utilization_methods[method]
        optimal_range = method_details['max_quantity'] - method_details['min_quantity']
        
        if optimal_range > 0:
            range_score = 1 - abs(quantity - (method_details['min_quantity'] + method_details['max_quantity']) / 2) / optimal_range
        else:
            range_score = 0.5
        
        return (base_scores[method] * 0.7 + range_score * 0.3)

class RecommendationEngine:
    def __init__(self):
        pass
    
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        from math import radians, sin, cos, sqrt, atan2
        
        R = 6371
        
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return R * c
    
    def rank_buyers(self, farmer_location, residue_quantity, residue_types, buyers):
        ranked_buyers = []
        
        for buyer in buyers:
            if not buyer.get('isActive', True):
                continue
            
            buyer_location = buyer.get('location', {})
            distance = self.calculate_distance(
                farmer_location.get('coordinates', {}).get('latitude', 0),
                farmer_location.get('coordinates', {}).get('longitude', 0),
                buyer_location.get('coordinates', {}).get('latitude', 0),
                buyer_location.get('coordinates', {}).get('longitude', 0)
            )
            
            price_score = buyer.get('pricePerUnit', 0) / 100
            demand_score = min(residue_quantity / buyer.get('minimumQuantity', 1), 1)
            distance_score = 1 / (1 + distance / 100)
            
            total_score = (price_score * 0.4) + (demand_score * 0.3) + (distance_score * 0.3)
            
            residue_match = any(
                residue_type in buyer.get('requiredResidueTypes', [])
                for residue_type in residue_types
            )
            
            if residue_match:
                ranked_buyers.append({
                    'buyer': buyer,
                    'score': round(total_score, 3),
                    'distance': round(distance, 2),
                    'estimated_profit': round(residue_quantity * buyer.get('pricePerUnit', 0), 2)
                })
        
        ranked_buyers.sort(key=lambda x: x['score'], reverse=True)
        
        return ranked_buyers

class EnvironmentalImpactCalculator:
    def __init__(self):
        self.emission_factors = {
            'rice': {'co2': 2.7, 'pm25': 0.8, 'ch4': 0.3, 'nox': 0.2},
            'wheat': {'co2': 1.6, 'pm25': 0.5, 'ch4': 0.2, 'nox': 0.15},
            'maize': {'co2': 1.8, 'pm25': 0.6, 'ch4': 0.25, 'nox': 0.18},
            'sugarcane': {'co2': 2.2, 'pm25': 0.7, 'ch4': 0.28, 'nox': 0.19}
        }
        
        self.tree_equivalent = 22  # kg CO2 absorbed per tree per year
    
    def calculate_impact(self, crop_type, residue_quantity, utilization_method='sold'):
        factors = self.emission_factors.get(crop_type, self.emission_factors['rice'])
        
        co2_reduction = residue_quantity * factors['co2']
        pm25_reduction = residue_quantity * factors['pm25']
        ch4_reduction = residue_quantity * factors['ch4']
        nox_reduction = residue_quantity * factors['nox']
        
        trees_saved = co2_reduction / self.tree_equivalent
        
        utilization_multiplier = {
            'sold': 1.0,
            'composting': 0.8,
            'animal_fodder': 0.9,
            'biochar': 1.2,
            'biogas': 1.1,
            'mulching': 0.7
        }
        
        multiplier = utilization_multiplier.get(utilization_method, 1.0)
        
        return {
            'co2_reduction': round(co2_reduction * multiplier, 2),
            'pm25_reduction': round(pm25_reduction * multiplier, 2),
            'ch4_reduction': round(ch4_reduction * multiplier, 2),
            'nox_reduction': round(nox_reduction * multiplier, 2),
            'trees_saved': round(trees_saved * multiplier, 1),
            'carbon_footprint_reduction': round(co2_reduction * multiplier / 1000, 2),  # in tons
            'air_quality_improvement': 'Significant' if pm25_reduction > 1 else 'Moderate'
        }

residue_model = ResidueEstimationModel()
utilization_engine = UtilizationEngine()
recommendation_engine = RecommendationEngine()
env_calculator = EnvironmentalImpactCalculator()

@app.route('/predict-residue', methods=['POST'])
def predict_residue():
    try:
        data = request.json
        crop_type = data.get('crop_type')
        yield_value = data.get('yield')
        area = data.get('area')
        
        print(f"Received prediction request: crop_type={crop_type}, yield={yield_value}, area={area}")
        
        if not all([crop_type, yield_value, area]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        prediction = residue_model.predict_residue(crop_type, yield_value, area)
        
        print(f"Prediction result: {prediction}")
        
        return jsonify({
            'success': True,
            'data': prediction
        })
    
    except Exception as e:
        print(f"Prediction endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/utilization-recommendation', methods=['POST'])
def get_utilization_recommendation():
    try:
        data = request.json
        residue_quantity = data.get('residue_quantity')
        buyer_demand = data.get('buyer_demand')
        
        if residue_quantity is None:
            return jsonify({'error': 'Residue quantity is required'}), 400
        
        recommendation = utilization_engine.get_utilization_recommendation(residue_quantity, buyer_demand)
        
        return jsonify({
            'success': True,
            'data': recommendation
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend-buyers', methods=['POST'])
def recommend_buyers():
    try:
        data = request.json
        farmer_location = data.get('farmer_location')
        residue_quantity = data.get('residue_quantity')
        residue_types = data.get('residue_types')
        buyers = data.get('buyers')
        
        if not all([farmer_location, residue_quantity, residue_types, buyers]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        ranked_buyers = recommendation_engine.rank_buyers(farmer_location, residue_quantity, residue_types, buyers)
        
        return jsonify({
            'success': True,
            'data': ranked_buyers
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/environmental-impact', methods=['POST'])
def calculate_environmental_impact():
    try:
        data = request.json
        crop_type = data.get('crop_type')
        residue_quantity = data.get('residue_quantity')
        utilization_method = data.get('utilization_method', 'sold')
        
        if not all([crop_type, residue_quantity]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        impact = env_calculator.calculate_impact(crop_type, residue_quantity, utilization_method)
        
        return jsonify({
            'success': True,
            'data': impact
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': residue_model.model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
