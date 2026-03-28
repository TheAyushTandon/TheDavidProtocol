import smtplib
import random
import os
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from db.models import OTP
from sqlalchemy.orm import Session

def generate_otp_code() -> str:
    return str(random.randint(100000, 999999))

def send_otp_email(email: str, code: str):
    # Get config from env
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "Equis Architecture")

    # Clean up spaces from Google App Password if needed (Common user error)
    if MAIL_PASSWORD:
        MAIL_PASSWORD = MAIL_PASSWORD.replace(" ", "")

    html = f"""
    <html>
        <body style="background: black; color: white; padding: 40px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #00ff88; padding: 30px; border-radius: 20px; background-color: #0c0c0c;">
                <h1 style="color: #00ff88; text-transform: uppercase; letter-spacing: 2px;">Verification Code</h1>
                <p style="font-size: 18px; color: rgba(255,255,255,0.6);">Your Equis security code is below. It will expire in 10 minutes.</p>
                <div style="background: rgba(0,255,136,0.1); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 48px; font-weight: bold; color: #00ff88; letter-spacing: 10px;">{code}</span>
                </div>
                <p style="font-size: 14px; color: rgba(255,255,255,0.3);">If you did not request this code, please ignore this email.</p>
            </div>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = f"{MAIL_FROM_NAME} <{MAIL_FROM}>"
    msg['To'] = email
    msg['Subject'] = "Your Equis Verification Code"
    msg.attach(MIMEText(html, 'html'))

    try:
        print(f"📩 [MAIL] Attempting to connect to {MAIL_SERVER}:{MAIL_PORT}...")
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=15)
        
        print(f"📩 [MAIL] Starting TLS encryption...")
        server.starttls()
        
        print(f"📩 [MAIL] Authenticating as {MAIL_USERNAME}...")
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        
        print(f"📩 [MAIL] Sending message to {email}...")
        server.send_message(msg)
        
        server.quit()
        print(f"✅ OTP Email sent successfully to {email}")
    except Exception as e:
        print(f"❌ Failed to send email: {type(e).__name__}: {e}")

def create_otp(db: Session, email: str) -> str:
    # Delete old OTPs for this email
    db.query(OTP).filter(OTP.email == email).delete()
    
    code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    db_otp = OTP(email=email, code=code, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    return code

def verify_otp(db: Session, email: str, code: str) -> bool:
    db_otp = db.query(OTP).filter(
        OTP.email == email, 
        OTP.code == code,
        OTP.expires_at > datetime.utcnow()
    ).first()
    
    if db_otp:
        # One-time use: delete after verification
        db.delete(db_otp)
        db.commit()
        return True
    return False
