import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

def abrir_conexion():
    try:
        conexion = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        print("Conexion exitosa")
        return conexion

    except Exception as e:
        print(f"Error al abrir la conexion: {e}")
        return None

def realizar_consulta(conexion, query):
    try:    # Create a cursor to execute SQL queries
        cursor = conexion.cursor()
        
        # Example query
        cursor.execute("SELECT * FROM \"departamento\";")
        rows = cursor.fetchall()
        # Close the cursor and connection
        cursor.close()
        return rows
    
    except Exception as e:
        print("Error al realizar la consulta: {e}")
        return None


def cerrar_conexion(conexion):
    try:
         if conexion:
            conexion.close()
            print("conexion cerrada")

    except Exception as e:
        print(f"Error al cerrar la conexion: {e}")