# Flask Backend for AI-Powered Finance App

This Flask backend provides GPT-4 powered financial analysis and advice for the Kenyan personal finance application.

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   - Copy `.env` file and update with your OpenAI API key
   - Get your API key from: https://platform.openai.com/api-keys

3. **Run the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/summary
Generates GPT-4 powered financial summaries.

**Request:**
```json
{
  "text": "Your financial data or transaction history"
}
```

**Response:**
```json
{
  "summary": "AI-generated financial summary with insights",
  "status": "success"
}
```

### POST /api/financial-advice
Provides personalized financial advice based on user context.

**Request:**
```json
{
  "income": 50000,
  "expenses": 35000,
  "goals": ["Emergency fund", "House deposit"],
  "question": "How should I invest my savings?"
}
```

**Response:**
```json
{
  "advice": "Personalized financial advice",
  "status": "success"
}
```

### GET /api/health
Health check endpoint to verify server status.

## Features

- **CORS Support:** Configured for frontend running on localhost:5173
- **Error Handling:** Comprehensive error handling for API failures
- **Logging:** Request logging for debugging
- **Kenyan Context:** Financial advice tailored for Kenyan users
- **Security:** Environment variable configuration for API keys

## Deployment

For production deployment:

1. **Railway/Render:**
   - Set environment variables in platform dashboard
   - Deploy directly from repository

2. **Docker:**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["python", "app.py"]
   ```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable debug mode (True/False)
- `FRONTEND_URL`: Frontend URL for CORS configuration