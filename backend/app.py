from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from the React frontend
CORS(app, origins=['http://localhost:5173'])

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/summary', methods=['POST'])
def generate_summary():
    try:
        # Get the text payload from the request
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text payload is required'}), 400
        
        text = data['text']
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Check if OpenAI API key is configured
        if not openai.api_key:
            return jsonify({'error': 'OpenAI API key not configured'}), 500
        
        # Create GPT-4 prompt for financial summary
        prompt = f"""
        You are a financial advisor AI assistant specialized in Kenyan personal finance. 
        Analyze the following financial data and provide a clear, actionable summary with insights and recommendations.
        
        Focus on:
        - Key spending patterns
        - Budget optimization suggestions
        - Savings opportunities
        - Investment recommendations suitable for Kenya
        - Emergency fund advice
        - M-Pesa and mobile money optimization
        
        Financial Data:
        {text}
        
        Provide a concise but comprehensive summary with specific, actionable advice tailored for Kenyan users.
        """
        
        # Call GPT-4 API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful financial advisor AI specialized in Kenyan personal finance. Provide clear, actionable advice in a friendly tone."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        summary = response.choices[0].message.content.strip()
        
        logger.info(f"Generated summary for text of length: {len(text)}")
        
        return jsonify({
            'summary': summary,
            'status': 'success'
        })
        
    except openai.error.AuthenticationError:
        logger.error("OpenAI authentication failed")
        return jsonify({'error': 'Invalid OpenAI API key'}), 401
        
    except openai.error.RateLimitError:
        logger.error("OpenAI rate limit exceeded")
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
        
    except openai.error.APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return jsonify({'error': 'OpenAI API error. Please try again.'}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Flask backend is running',
        'openai_configured': bool(openai.api_key)
    })

@app.route('/api/financial-advice', methods=['POST'])
def financial_advice():
    """Specialized endpoint for financial advice based on user context"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        # Extract user context
        income = data.get('income', 0)
        expenses = data.get('expenses', 0)
        goals = data.get('goals', [])
        question = data.get('question', '')
        
        # Create contextual prompt
        prompt = f"""
        You are a financial advisor AI for Kenyan users. Provide personalized advice based on this context:
        
        User Profile:
        - Monthly Income: Ksh {income:,}
        - Monthly Expenses: Ksh {expenses:,}
        - Net Income: Ksh {income - expenses:,}
        - Financial Goals: {', '.join(goals) if goals else 'None specified'}
        
        User Question: {question}
        
        Provide specific, actionable advice considering:
        - Kenyan cost of living
        - Local investment options (NSE, government bonds, SACCOs)
        - M-Pesa and mobile money strategies
        - Emergency fund recommendations
        - Tax implications in Kenya
        
        Keep the response concise but comprehensive.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a knowledgeable financial advisor specializing in Kenyan personal finance. Provide practical, culturally relevant advice."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        advice = response.choices[0].message.content.strip()
        
        return jsonify({
            'advice': advice,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error generating financial advice: {str(e)}")
        return jsonify({'error': 'Failed to generate advice'}), 500

if __name__ == '__main__':
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        logger.warning("OpenAI API key not found in environment variables")
    
    app.run(debug=True, host='0.0.0.0', port=5000)