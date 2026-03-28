import os
import google.generativeai as genai
from typing import List, Dict, Any
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GEN_API_KEY = os.getenv("GEMINI_API_KEY")
if GEN_API_KEY:
    genai.configure(api_key=GEN_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Base Categorization Rules
CATEGORIES = {
    "INCOME": ["salary", "payroll", "deposit", "stripe", "transfer", "interest", "dividend", "executive", "bonus"],
    "RENT": ["rent", "landlord", "apartment", "mortgage", "housing", "noah", "equity residential"],
    "UTILITIES": ["electric", "water", "gas", "internet", "phone", "verizon", "att", "t-mobile", "coned", "pge", "comcast", "spectrum", "utility", "bill"],
    "FOOD": ["restaurant", "groceries", "starbucks", "mcdonalds", "uber eats", "doordash", "swiggy", "zomato", "whole foods"],
    "SUBSCRIPTION": ["netflix", "spotify", "apple", "amazon prime", "hulu", "disney", "youtube premium"],
    "SHOPPING": ["amazon", "walmart", "target", "nike", "clothing", "zara", "h&m"],
    "LUXURY": ["gucci", "prada", "louis vuitton", "rolex", "luxury", "jewelry", "resort", "spa", "first class", "michelin", "premium", "high-end", "dining"],
    "DEBT": ["loan", "credit card", "amex", "chase", "bank of america", "interest charge", "late fee"],
    "SAVINGS": ["investment", "fidelity", "vanguard", "schwab", "wealthfront", "robinhood", "coinbase"]
}

class NLPService:
    @staticmethod
    def categorize_transaction(transaction_name: str, amount: float = 0) -> str:
        name_lower = transaction_name.lower()
        for category, keywords in CATEGORIES.items():
            if any(kw in name_lower for kw in keywords):
                return category
        return "OTHER"

    @staticmethod
    async def categorize_with_gemini(transaction_name: str, amount: float) -> str:
        if not model:
            return "OTHER"
        
        prompt = f"""
        Categorize this bank transaction: '{transaction_name}' for an amount of ${amount}.
        Choose one of: INCOME, RENT, UTILITIES, FOOD, SUBSCRIPTION, SHOPPING, DEBT, SAVINGS, OTHER.
        Return ONLY the category name.
        """
        try:
            response = model.generate_content(prompt)
            return response.text.strip().upper()
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "OTHER"

    @staticmethod
    async def generate_financial_summary(transactions: List[Dict[str, Any]], score: int, burn_velocity: str) -> Dict[str, Any]:
        if not model:
            return {
                "stability_index": "N/A",
                "burn_velocity": burn_velocity,
                "account_status": "PENDING",
                "tips": ["Unable to reach AI for custom insights."]
            }
        
        # Prepare transaction summary for Gemini
        df = pd.DataFrame(transactions)
        top_categories = df.groupby('category')['amount'].sum().abs().sort_values(ascending=False).head(5).to_dict()
        category_str = ", ".join([f"{cat}: ${amt:,.2f}" for cat, amt in top_categories.items()])
        
        prompt = f"""
        Analyze these financial metrics for a user:
        - Resilience Score: {score}/1000
        - Burn Velocity: {burn_velocity} (Monthly Outflow / Monthly Inflow)
        - Top Spending Categories: {category_str}
        - Sample Transactions: {df['name'].head(10).tolist()}

        Task: 
        1. Determine a 'Stability Index' (A+ to F) based on their {burn_velocity}: 
           - A+ (Elite): if burn < 0.40
           - A (Stable): if burn < 0.60
           - B (Moderate): if burn < 0.80
           - C (High Burn): if burn < 1.0
           - F (Critical): if burn > 1.2
        2. Set 'account_status' to one of: ["OPTIMIZED", "HEALTHY", "WATCHLIST", "CRITICAL"].
        3. Provide 3 highly specific tips. One MUST mention their largest expense from: {category_str}.
        
        Return strictly a JSON object:
        {{
            "stability_index": "grade",
            "account_status": "status",
            "tips": ["tip1", "tip2", "tip3"]
        }}
        """
        try:
            response = model.generate_content(prompt)
            response_text = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(response_text)
        except Exception as e:
            print(f"Gemini Summary Error: {e}")
            return {
                "stability_index": "A+" if float(burn_velocity.replace('x','')) < 0.4 else "B",
                "account_status": "OPTIMIZED" if float(burn_velocity.replace('x','')) < 0.4 else "HEALTHY",
                "tips": [f"Your burn velocity of {burn_velocity} is exceptional. Maintain this buffer.", "Consider diversifying your liquid assets.", "Your category management is peak performance."]
            }

    @staticmethod
    async def process_transaction(transaction: Dict[str, Any]) -> str:
        name = transaction.get("name", "")
        amount = transaction.get("amount", 0)
        
        # 1. Rule-based
        category = NLPService.categorize_transaction(name, amount)
        
        # 2. Fallback to Gemini if "OTHER" and key exists
        if category == "OTHER" and model:
            category = await NLPService.categorize_with_gemini(name, amount)
            
        return category
