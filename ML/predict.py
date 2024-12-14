from flask import Flask, request, jsonify
import numpy as np
import pickle

model = pickle.load(open('real_estate_model.pkl', 'rb'))

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    size = float(data.get('size', 0))
    bedrooms = int(data.get('bedrooms', 0))
    location = data.get('location', 'unknown')

    location_mapping = {'urban': 1, 'suburban': 2, 'rural': 3}
    location_encoded = location_mapping.get(location.lower(), 0)

    features = np.array([[size, bedrooms, location_encoded]])
    prediction = model.predict(features)

    return jsonify({'price': float(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
