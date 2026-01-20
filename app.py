from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# Database Simulation
SCHOLARSHIPS = [
    { "id": "NSP-001", "name": "Post Matric Scholarship (Minorities)", "provider": "Min. Minority Affairs", "amount": "₹12,000/yr", "deadline": "2024-10-31", "desc": "Income < 2L", "tags": ["Minority"] },
    { "id": "NSP-002", "name": "Central Sector Scheme", "provider": "Dept. Higher Education", "amount": "₹20,000/yr", "deadline": "2024-11-15", "desc": "Merit Based", "tags": ["Merit"] }
]

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/verify-aadhaar', methods=['POST'])
def verify_aadhaar():
    data = request.json
    # Strict Privacy: In real implementation, this connects to UIDAI ASA
    # Here we perform a mock check
    otp = data.get('otp')
    if otp == "123456":
        return jsonify({
            "success": True, 
            "token": "UID_SECURE_TOKEN_99",
            "user": {"name": "Rahul Kumar", "state": "Delhi"}
        })
    return jsonify({"success": False, "message": "Invalid OTP"}), 400

@app.route('/api/scholarships', methods=['GET'])
def get_scholarships():
    # Rule engine logic would go here in Python
    return jsonify(SCHOLARSHIPS)

if __name__ == '__main__':
    app.run(debug=True, port=5000)