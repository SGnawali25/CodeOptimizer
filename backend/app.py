from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get your API key from environment
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable.")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

def optimize_code_with_gemini(source_code):
    """
    Optimize code using Gemini AI and return structured response
    """
    prompt = f"""
You are an advanced code optimization assistant that supports multiple programming languages (Python, Java, C++, JavaScript, etc.).

Analyze the following provided function and return a structured JSON-style array in this exact format:

[
  can_optimize, 
  optimized_function_code, 
  current_time_complexity, 
  optimized_time_complexity, 
  reason
]

Rules:

1. **Detect the programming language automatically from the provided function.**  
2. If the function **cannot be optimized**, set `can_optimize` to "No" and return **no other elements**.  
   Example: ["No"]

3. If the function **can be optimized**, set `can_optimize` to "Yes".  
   - `optimized_function_code` must be written in the **same programming language** as the input function.  
   - `current_time_complexity` should be a string describing the time complexity of the original function (e.g., "O(n^2)").  
   - `optimized_time_complexity` should be a string describing the time complexity of the optimized function (e.g., "O(n)").  
   - `reason` should briefly explain why the optimized version is faster.

4. Ensure the output is **strictly a JSON-style array** that can be parsed programmatically.  
5. Do not convert the function to another language. Always preserve the input language.

Here is the function to analyze:

{source_code}
"""


    try:
        logger.info("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        logger.info(f"Gemini response: {response_text}")
        
        # Clean the response text - remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]  # Remove ```json
        if response_text.startswith('```'):
            response_text = response_text[3:]   # Remove ```
        if response_text.endswith('```'):
            response_text = response_text[:-3]  # Remove trailing ```
        
        response_text = response_text.strip()
        logger.info(f"Cleaned response: {response_text}")
        
        # Parse the response as JSON array
        response_array = json.loads(response_text)
        
        return response_array, None
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        logger.error(f"Response text: {response_text}")
        return None, f"Failed to parse AI response: {str(e)}"
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None, f"Error processing request: {str(e)}"

@app.route('/api/optimize-code', methods=['POST'])
def optimize_code():
    """
    API endpoint to optimize code
    Expected request: {"code": "python_code_here"}
    Returns: 
    - Success: {"status": true, "optimizedCode": "...", "oldTimeComplexity": "...", "newTimeComplexity": "...", "reason": "..."}
    - Failure: {"status": "fail"}
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data or 'code' not in data:
            logger.warning("Invalid request: missing 'code' field")
            return jsonify({"error": "Missing 'code' field in request"}), 400
        
        source_code = data['code'].strip()
        
        if not source_code:
            logger.warning("Empty code provided")
            return jsonify({"error": "Code cannot be empty"}), 400
        
        logger.info(f"Processing code optimization request...")
        
        # Call Gemini to optimize the code
        response_array, error = optimize_code_with_gemini(source_code)
        
        if error:
            logger.error(f"Optimization failed: {error}")
            return jsonify({"status": "fail"}), 500
        
        if not response_array or len(response_array) == 0:
            logger.error("Empty response from Gemini")
            return jsonify({"status": "fail"}), 500
        
        # Check if optimization is possible
        if response_array[0] == "No":
            logger.info("Code cannot be optimized further")
            return jsonify({"status": "fail"})
        
        # Extract optimization results
        if response_array[0] == "Yes" and len(response_array) >= 5:
            optimized_code = response_array[1]
            current_complexity = response_array[2]
            optimized_complexity = response_array[3]
            reason = response_array[4]
            
            logger.info("Code optimization successful")
            return jsonify({
                "status": True,
                "optimizedCode": optimized_code,
                "oldTimeComplexity": current_complexity,
                "newTimeComplexity": optimized_complexity,
                "reason": reason
            })
        else:
            logger.error("Invalid response format from Gemini")
            return jsonify({"status": "fail"}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"status": "fail"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Code optimizer API is running"})

@app.route('/', methods=['GET'])
def home():
    """Basic home endpoint"""
    return jsonify({
        "message": "Code Optimizer API",
        "endpoints": {
            "/api/optimize-code": "POST - Optimize code",
            "/health": "GET - Health check"
        }
    })

if __name__ == '__main__':
    # Ensure API key is set
    if not API_KEY:
        print("Error: GEMINI_API_KEY environment variable not set!")
        exit(1)
    
    print("Starting Code Optimizer Flask API...")
    print(f"Gemini API configured: {'✓' if API_KEY else '✗'}")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=4000,
        debug=True  # Set to False in production
    )