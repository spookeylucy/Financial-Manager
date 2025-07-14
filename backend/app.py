from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import logging
from dotenv import load_dotenv
from supabase import create_client

# ✅ Load environment variables first!
load_dotenv()

# ✅ Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ Flask setup
app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])  # Update if needed

# ✅ OpenAI setup
openai.api_key = os.getenv("OPENAI_API_KEY")

# ✅ Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ✅ Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Flask backend is running',
        'openai_configured': bool(openai.api_key)
    })


# ✅ GPT Financial Summary
@app.route('/api/summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text payload is required'}), 400

        text = data['text']
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400

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

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor AI specialized in Kenyan personal finance."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )

        summary = response.choices[0].message.content.strip()
        logger.info(f"Generated summary for text of length: {len(text)}")

        return jsonify({'summary': summary, 'status': 'success'})

    except Exception as e:
        logger.error(f"Summary error: {str(e)}")
        return jsonify({'error': 'Failed to generate summary'}), 500


# ✅ GPT Personalized Financial Advice
@app.route('/api/financial-advice', methods=['POST'])
def financial_advice():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400

        income = data.get('income', 0)
        expenses = data.get('expenses', 0)
        goals = data.get('goals', [])
        question = data.get('question', '')

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
        """

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a knowledgeable financial advisor specializing in Kenyan personal finance."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )

        advice = response.choices[0].message.content.strip()
        return jsonify({'advice': advice, 'status': 'success'})

    except Exception as e:
        logger.error(f"Advice error: {str(e)}")
        return jsonify({'error': 'Failed to generate advice'}), 500


# ✅ Add Transaction
@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    try:
        data = request.get_json()

        required_fields = ['user_id', 'amount', 'category', 'description', 'type', 'date', 'source']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required transaction fields'}), 400

        result = supabase.table('transactions').insert(data).execute()

        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        logger.error(f"Add transaction error: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ✅ Get Transactions
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id query param is required'}), 400

        result = supabase.table('transactions') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('date', desc=True) \
            .execute()

        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        logger.error(f"Get transaction error: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ✅ Run App
if __name__ == '__main__':
    if not os.getenv('OPENAI_API_KEY'):
        logger.warning("OpenAI API key not found in environment variables")

    app.run(debug=True, host='0.0.0.0', port=5000)
