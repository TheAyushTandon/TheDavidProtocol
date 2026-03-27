import os
import google.generativeai as genai
from typing import List, Dict, Any
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
    "INCOME": ["salary", "payroll", "deposit", "stripe", "transfer"],
    "RENT": ["rent", "landlord", "apartment", "mortgage"],
    "UTILITIES": ["electric", "water", "gas", "internet", "phone", "verizon", "att"],
    "FOOD": ["restaurant", "groceries", "starbucks", "mcdonalds", "uber eats", "doordash"],
    "SUBSCRIPTION": ["netflix", "spotify", "apple", "amazon prime", "hulu"],
    "SHOPPING": ["amazon", "walmart", "target", "nike", "clothing"],
    "DEBT": ["loan", "credit card", "amex", "chase", "bank of america"],
    "SAVINGS": ["investment", "fidelity", "vanguard", "schwab", "wealthfront"]
}

class NLPService:
    @staticmethod
    def categorize_transaction_rule_based(transaction_name: str) -> str:
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
    async def process_transaction(transaction: Dict[str, Any]) -> str:
        name = transaction.get("name", "")
        amount = transaction.get("amount", 0)
        
        # 1. Rule-based
        category = NLPService.categorize_transaction_rule_based(name)
        
        # 2. Fallback to Gemini if "OTHER" and key exists
        if category == "OTHER" and model:
            category = await NLPService.categorize_with_gemini(name, amount)
            
        return category
