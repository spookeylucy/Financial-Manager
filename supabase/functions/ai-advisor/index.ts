const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AIRequest {
  message: string;
  context?: {
    income?: number;
    expenses?: number;
    transactions?: any[];
    goals?: any[];
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, context }: AIRequest = await req.json();

    // In production, this would call OpenAI GPT-4 API
    const response = await generateAIResponse(message, context);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

async function generateAIResponse(message: string, context?: any): Promise<string> {
  // Simulated AI response based on context
  const msg = message.toLowerCase();
  
  if (msg.includes('budget') && context?.income) {
    return `Based on your monthly income of Ksh ${context.income.toLocaleString()}, I recommend:

📊 **Optimized Budget:**
- Housing: Ksh ${Math.round(context.income * 0.3).toLocaleString()} (30%)
- Food: Ksh ${Math.round(context.income * 0.15).toLocaleString()} (15%)
- Transport: Ksh ${Math.round(context.income * 0.12).toLocaleString()} (12%)
- Savings: Ksh ${Math.round(context.income * 0.20).toLocaleString()} (20%)
- Other: Ksh ${Math.round(context.income * 0.23).toLocaleString()} (23%)

🎯 **Key Recommendations:**
- Emergency fund: Build to Ksh ${Math.round(context.income * 3).toLocaleString()}
- Investment: Start with Ksh ${Math.round(context.income * 0.10).toLocaleString()} monthly
- Review and adjust quarterly`;
  }

  if (msg.includes('save') || msg.includes('saving')) {
    return `Smart savings strategies for your situation:

🏦 **Priority Order:**
1. Emergency Fund (3-6 months expenses)
2. High-interest debt payoff
3. Investment in government bonds
4. Equity investments (NSE stocks)

💡 **Automation Tips:**
- Set up automatic transfers on payday
- Use M-Shwari lock savings for discipline
- Consider a monthly Sacco contribution
- Save windfalls immediately

🎯 **Target:** Aim to save at least 20% of your income monthly.`;
  }

  return `I understand you're asking about "${message}". Let me help you with personalized advice:

Based on Kenyan financial best practices:
- Always maintain an emergency fund
- Diversify your investments
- Track every expense
- Plan for taxes and inflation
- Consider both short and long-term goals

What specific aspect would you like me to elaborate on?`;
}