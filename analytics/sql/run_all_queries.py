import os
import sys
import glob
import sqlite3
import pandas as pd

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_all_sql_queries():
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'db.sqlite3')
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    sql_dir = os.path.dirname(__file__)
    sql_files = sorted(glob.glob(os.path.join(sql_dir, '*.sql')))

    print("==============================================================================")
    print(f"  EXECUTING {len(sql_files)} PRODUCT MANAGEMENT SQL QUERIES")
    print("==============================================================================")

    for fpath in sql_files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            query = f.read()

        print(f"\n>>> Running: {fname}")
        try:
            df = pd.read_sql_query(query, conn)
            print(df.to_string(index=False))
            print("-" * 80)
        except Exception as e:
            print(f"Error executing {fname}: {e}")

    conn.close()
    print("\n[DONE] All SQL analytical queries executed successfully.")

if __name__ == '__main__':
    run_all_sql_queries()
