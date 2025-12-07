import sqlite3
import os
from datetime import datetime, timedelta
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "agrocredit_v2.db")

class DatabaseManager:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            # Farmers Table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS farmers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL, -- Used as ID
                    full_name TEXT NOT NULL,
                    credit_score INTEGER DEFAULT 0
                )
            """)

            # Farms Table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS farms (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    farmer_id INTEGER NOT NULL,
                    name TEXT,
                    size_acres REAL,
                    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
                )
            """)

            # Loan Requests (Applications)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS loan_requests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    farm_id INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    term_months INTEGER NOT NULL,
                    purpose TEXT,
                    status TEXT DEFAULT 'pending', -- pending, approved, rejected, active, paid_off
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (farm_id) REFERENCES farms(id)
                )
            """)

            # Payments (NEW)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS payments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    loan_id INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (loan_id) REFERENCES loan_requests(id)
                )
            """)

            # Utility Readings (NEW)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS utility_readings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    farm_id INTEGER NOT NULL,
                    utility_type TEXT NOT NULL, -- electricity, water, gas
                    reading_value REAL NOT NULL,
                    unit TEXT NOT NULL,
                    reading_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (farm_id) REFERENCES farms(id)
                )
            """)

            # Recommendations (NEW)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS recommendations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    farm_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    message TEXT NOT NULL,
                    type TEXT, -- irrigation, pest, general
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (farm_id) REFERENCES farms(id)
                )
            """)
            
            # Check if we need to seed
            cursor = conn.execute("SELECT COUNT(*) as count FROM farmers")
            if cursor.fetchone()['count'] == 0:
                self.seed_data(conn)

    def seed_data(self, conn):
        print("Seeding database with initial data...")
        
        # Create Farmer
        cursor = conn.execute("INSERT INTO farmers (email, full_name, credit_score) VALUES (?, ?, ?)", 
                             ("demo@farmer.com", "Aziz Gofurov", 750))
        farmer_id = cursor.lastrowid
        
        # Create Farm
        cursor = conn.execute("INSERT INTO farms (farmer_id, name, size_acres) VALUES (?, ?, ?)",
                             (farmer_id, "Petrov Family Farm", 150.5))
        farm_id = cursor.lastrowid
        
        # Create Active Loan
        cursor = conn.execute("""
            INSERT INTO loan_requests (farm_id, amount, term_months, purpose, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (farm_id, 50000, 12, "Equipment Upgrade", "active", (datetime.now() - timedelta(days=90)).isoformat()))
        loan_id = cursor.lastrowid
        
        # Create Payments for Active Loan (3 months paid)
        payment_amount = 4200 # Approx
        for i in range(3):
            date = datetime.now() - timedelta(days=90 - (i * 30))
            conn.execute("INSERT INTO payments (loan_id, amount, payment_date) VALUES (?, ?, ?)",
                        (loan_id, payment_amount, date.isoformat()))

        # Create Utility Readings
        readings = [
            ("electricity", 12450, "kWh"),
            ("gas", 8230, "m3"),
            ("water", 3560, "m3")
        ]
        for type_, val, unit in readings:
            conn.execute("INSERT INTO utility_readings (farm_id, utility_type, reading_value, unit) VALUES (?, ?, ?, ?)",
                        (farm_id, type_, val, unit))
            
        # Create Recommendation
        conn.execute("""
            INSERT INTO recommendations (farm_id, title, message, type)
            VALUES (?, ?, ?, ?)
        """, (farm_id, "Irrigation Recommendation", "Based on the weather forecast, we recommend irrigation in 2 days. Dry weather is expected throughout the week.", "irrigation"))
        
        print("Seeding complete.")

db = DatabaseManager()
