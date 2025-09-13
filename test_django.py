#!/usr/bin/env python3

import requests
import json

# Test the Django API endpoint
url = 'http://127.0.0.1:8000/api/backtest/'

# Create a simple test strategy
strategy = {
    "id": "test-strategy-123",
    "name": "Test Strategy",
    "description": "Simple test strategy",
    "nodes": [
        {
            "id": "stock-1",
            "type": "stock",
            "data": {"symbol": "AAPL", "quantity": 100}
        },
        {
            "id": "rsi-1", 
            "type": "technicalIndicator",
            "data": {"blockType": "RSI", "period": 14}
        },
        {
            "id": "condition-1",
            "type": "priceCondition", 
            "data": {"blockType": "price_condition", "operator": "less_than", "value": 30}
        },
        {
            "id": "buy-1",
            "type": "orderType",
            "data": {"blockType": "BUY", "quantity": 100}
        }
    ],
    "edges": [
        {"source": "stock-1", "target": "rsi-1"},
        {"source": "rsi-1", "target": "condition-1"},
        {"source": "condition-1", "target": "buy-1"}
    ],
    "metadata": {
        "created": "2025-09-13T14:00:00Z",
        "lastModified": "2025-09-13T14:00:00Z", 
        "version": 1
    }
}

try:
    print("Testing Django API endpoint...")
    print("URL:", url)
    print("Strategy:", json.dumps(strategy, indent=2))
    
    response = requests.post(url, json=strategy, timeout=30)
    
    print("\nResponse Status:", response.status_code)
    print("Response Headers:", dict(response.headers))
    print("Response Text:", response.text)
    
    if response.status_code == 200:
        result = response.json()
        print("\nSuccess! Result keys:", list(result.keys()))
        if 'metrics' in result:
            print("Metrics:", result['metrics'])
    else:
        print("Error response")
        
except requests.exceptions.ConnectionError as e:
    print(f"Connection Error: {e}")
except requests.exceptions.Timeout as e:
    print(f"Timeout Error: {e}")
except Exception as e:
    print(f"Error: {e}")