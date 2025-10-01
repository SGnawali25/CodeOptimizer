import google.generativeai as genai
import os
import inspect
from functions import brute_force_two_sum, optimized_two_sum, natural_sum, arr_sum
import json

# Get the source code of the function
source_code = inspect.getsource(brute_force_two_sum)
print("Function source code:\n", source_code)

# Get your API key from environment
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable.")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


prompt = f""" 
You are a Python code optimization assistant.

Analyze the following Python function and return a structured JSON-style array in this exact format:

[
  can_optimize, 
  optimized_function_code, 
  current_time_complexity, 
  optimized_time_complexity, 
  reason
]

Rules:

1. If the function **cannot be optimized**, set `can_optimize` to "No" and return **no other elements**.  
   Example: ["No"]

2. If the function **can be optimized**, set `can_optimize` to "Yes".  
   - `optimized_function_code` should contain the **full Python function code**.  
   - `current_time_complexity` should be a string describing the time complexity of the given function (e.g., "O(n^2)").  
   - `optimized_time_complexity` should be a string describing the time complexity of the optimized function (e.g., "O(n)").  
   - `reason` should briefly explain why the optimized version is faster.

Here is the function to analyze:

{source_code}

Respond **strictly in this array format** so it can be parsed programmatically.
"""

print("Sending prompt to Gemini...")
# Call Gemini
response = model.generate_content(prompt)
response_text = response.text.strip()

# Print Gemini's response
print("\nGemini response:\n")
print(response_text)


response_array = json.loads(response_text)
print("\nParsed response array:\n", response_array)

if response_array[0] == "Yes":
    optimized_code = response_array[1]
    print(f"\nOptimized Function Code:\n{optimized_code}")
    print("\nProvided Code Time Complexity:", response_array[2])
    print("\nOptimized Code Time Complexity:", response_array[3])
    print("\nReason for Improvement:", response_array[4])
else:
    print("The function cannot be optimized further.")

