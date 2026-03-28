import pandas as pd
import os

def prepare_samples():
    # Load Rich
    df_rich = pd.read_csv('train_with_kaggle_salaried_rich.csv')
    # Load Regular
    df_reg = pd.read_csv('train_with_kaggle_salaried.csv')
    
    # Ensure we get ALL credits (the salaries) and some debits
    rich_credits = df_rich[df_rich['TransactionType'] == 'Credit']
    rich_debits = df_rich[df_rich['TransactionType'] == 'Debit'].head(100)
    sample_rich = pd.concat([rich_credits, rich_debits])
    
    reg_credits = df_reg[df_reg['TransactionType'] == 'Credit']
    reg_debits = df_reg[df_reg['TransactionType'] == 'Debit'].head(100)
    sample_reg = pd.concat([reg_credits, reg_debits])
    
    os.makedirs('data', exist_ok=True)
    sample_rich[['Date', 'Description', 'Amount', 'Category', 'TransactionType']].to_csv('data/8439655313_transactions.csv', index=False)
    sample_reg[['Date', 'Description', 'Amount', 'Category', 'TransactionType']].to_csv('data/8178810191_transactions.csv', index=False)
    
    print("Samples prepared: 8439655313 (Rich) and 8178810191 (Regular)")

if __name__ == "__main__":
    prepare_samples()
