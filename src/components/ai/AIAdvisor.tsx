import React, { useState } from 'react'
import { Bot, Send, Lightbulb, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export const AIAdvisor: React.FC = () => {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI financial advisor. I can help you with budgeting, savings strategies, investment advice, and financial planning tailored for Kenya. What would you like to know?'
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { type: 'user', content: message }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    // Simulate AI response (in production, this would call GPT-4 API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      setChatHistory(prev => [...prev, { type: 'ai', content: aiResponse }])
      setLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('budget') || msg.includes('budgeting')) {
      return `Based on typical Kenyan living costs, here's my budgeting advice:

💰 **50/30/20 Rule (Kenya-adapted):**
- 50% for needs (rent, food, transport, utilities)
- 30% for wants (entertainment, dining out, shopping)
- 20% for savings and debt repayment

🏠 **Housing:** Keep rent below 30% of income (Ksh 15,000-25,000 for mid-income earners)
🚗 **Transport:** Budget Ksh 5,000-8,000 for matatu/bus fare monthly
🍽️ **Food:** Ksh 8,000-12,000 for groceries and occasional dining out

Would you like me to create a personalized budget based on your income?`
    }

    if (msg.includes('save') || msg.includes('saving')) {
      return `Smart savings strategies for Kenyan context:

🏦 **Emergency Fund:** Save 3-6 months of expenses (start with Ksh 50,000)
📈 **Investment Options:**
- Government bonds (12-15% returns)
- Equity Bank shares or KCB
- M-Shwari for short-term savings
- Unit Trust funds like CIC or Britam

💡 **Savings Tips:**
- Use M-Shwari lock savings to avoid temptation
- Set up automatic transfers after salary
- Save windfalls (bonuses, gifts) immediately
- Consider a Sacco for higher interest rates

Start with Ksh 2,000-5,000 monthly and increase gradually!`
    }

    if (msg.includes('invest') || msg.includes('investment')) {
      return `Investment opportunities in Kenya:

📊 **Low Risk (8-15% returns):**
- Government Treasury Bills/Bonds
- Fixed deposits
- Money market funds

📈 **Medium Risk (15-25% returns):**
- NSE stocks (Safaricom, Equity, KCB)
- Balanced unit trust funds
- Real estate investment trusts (REITs)

🚀 **Higher Risk (25%+ potential):**
- Individual stocks
- Cryptocurrency (small allocation)
- Starting a business

🎯 **My Recommendation:** Start with 60% bonds, 30% equity funds, 10% individual stocks. Always invest what you can afford to lose!`
    }

    if (msg.includes('mpesa') || msg.includes('m-pesa')) {
      return `M-Pesa financial management tips:

💳 **M-Shwari Benefits:**
- Lock savings account (6% interest)
- Micro-loans for emergencies
- No monthly fees

📱 **Smart M-Pesa Usage:**
- Track all transactions via statements
- Use M-Pesa for bill payments to avoid cash handling
- Set up automatic savings transfers
- Monitor spending via M-Pesa app

⚠️ **Avoid:**
- Taking M-Shwari loans frequently (affects credit score)
- Keeping large amounts in M-Pesa (use bank for safety)
- Using M-Pesa for non-essential purchases

Would you like help setting up an M-Pesa savings plan?`
    }

    return `I understand you're asking about "${userMessage}". Here's some general financial advice:

💡 **Key Principles:**
1. Track every expense (even small ones add up)
2. Automate your savings
3. Diversify your income sources
4. Plan for taxes and insurance
5. Review and adjust monthly

🇰🇪 **Kenya-specific tips:**
- Take advantage of tax reliefs (insurance, pension)
- Consider inflation in your planning (8-10% annually)
- Build relationships with your bank for better rates
- Keep some cash for emergencies (power outages, system failures)

What specific area would you like me to focus on? Budgeting, savings, investments, or debt management?`
  }

  const quickQuestions = [
    { icon: PiggyBank, text: "How much should I save monthly?", query: "How much should I save monthly with my income?" },
    { icon: TrendingUp, text: "Best investment options in Kenya?", query: "What are the best investment options in Kenya?" },
    { icon: AlertCircle, text: "Emergency fund advice", query: "How should I build an emergency fund?" },
    { icon: Lightbulb, text: "Budgeting tips for Kenya", query: "Give me budgeting tips for living in Kenya" }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-600 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Financial Advisor</h2>
        <p className="text-gray-600">Get personalized financial advice tailored for Kenya</p>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setMessage(question.query)}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <question.icon className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-gray-700">{question.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Chat History */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2" />
                    <span className="font-medium">AI Advisor</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  <span className="font-medium">AI Advisor</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Predictions</h3>
          <p className="text-gray-600">AI analyzes your spending patterns to predict future expenses and suggest budget adjustments.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Advice</h3>
          <p className="text-gray-600">Get tailored financial advice based on your income, expenses, and goals in the Kenyan context.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Support</h3>
          <p className="text-gray-600">Real-time budget adjustments and emergency expense handling with smart recommendations.</p>
        </div>
      </div>
    </div>
  )
}