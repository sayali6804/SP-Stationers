from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from recommender import HybridRecommender
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

recommender = HybridRecommender()

def get_product_details(product_ids):
    with open('data/products.json') as f:
        products = json.load(f)
    return [prod for prod in products if prod['_id']['$oid'] in product_ids]

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('userId')
    product_id = request.args.get('productId')

    # Get recommended product IDs (dummy output for now)
    recommendations = recommender.get_recommendations(user_id, product_id)
    
    # Fetch product details from the JSON data
    full_recommendations = get_product_details(recommendations)

    return jsonify(full_recommendations)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
