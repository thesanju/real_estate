import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.css';

const App = () => {
  const [inputFeatures, setInputFeatures] = useState({ size: '', bedrooms: '', location: '' });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [history, setHistory] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFeatures({ ...inputFeatures, [name]: value });
  };

  const predictPrice = () => {
    axios.post('http://localhost:5000/predict', inputFeatures)
      .then((response) => {
        setPredictedPrice(response.data.price);
        setHistory([...history, { ...inputFeatures, price: response.data.price }]);
      })
      .catch((error) => console.error('Prediction Error:', error));
  };

  return (
    <div className="app-container">
      <header>
        <h1>Real Estate Price Predictor</h1>
      </header>

      <div className="content">
        <div className="form-section">
          <h2>Input Features</h2>
          <label>
            Size (sqft):
            <input
              type="number"
              name="size"
              value={inputFeatures.size}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Bedrooms:
            <input
              type="number"
              name="bedrooms"
              value={inputFeatures.bedrooms}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={inputFeatures.location}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={predictPrice}>Predict Price</button>
        </div>

        <div className="prediction-section">
          <h2>Predicted Price</h2>
          {predictedPrice !== null ? (
            <p>The predicted price is: ${predictedPrice.toFixed(2)}</p>
          ) : (
            <p>Enter details to get a price prediction.</p>
          )}
        </div>

        <div className="history-section">
          <h2>Prediction History</h2>
          {history.length > 0 ? (
            <Line
              data={{
                labels: history.map((_, index) => `Prediction ${index + 1}`),
                datasets: [
                  {
                    label: 'Predicted Prices',
                    data: history.map((item) => item.price),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          ) : (
            <p>No predictions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
