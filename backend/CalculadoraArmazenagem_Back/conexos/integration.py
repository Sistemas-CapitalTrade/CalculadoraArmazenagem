import datetime
from dotenv import load_dotenv
import json 
import os
import oracledb
from utils.logger import logRequest, logInternal
import logging

load_dotenv(dotenv_path=".env")

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_SERVICE = os.getenv("DB_SERVICE")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")


class ConexosDatabaseIntegration:
    calc_query = '''
        SELECT * FROM V_ETL_CALCULO_ARMAZENAGEM 
        WHERE REF_EXT = '%INPUT_REF_EXT%' 
    '''
    def __init__(self):
        logInternal(levelName=logging.INFO, message="Creating pool")
        params = oracledb.PoolParams(host=DB_HOST, port=DB_PORT, service_name=DB_SERVICE, min=2, max=10, increment=2)
        self.pool = oracledb.create_pool(user=DB_USER, password=DB_PASS, params=params)
        logInternal(levelName=logging.INFO, message="Oracle pool created")
    
    def teste(self ):
        logRequest(levelName=logging.INFO, message=f"Aquiring pool connection")
        with self.pool.acquire() as connection:
            logRequest(levelName=logging.INFO, message=f"Creating cursor")
            with connection.cursor() as cursor:
                logRequest(levelName=logging.INFO, message=f"Executing query")
                calc_query_input = self.calc_query.replace("%INPUT_REF_EXT%","OCCT14150/23")
                result = cursor.execute(calc_query_input).fetchone()
                logRequest(levelName=logging.INFO, message=f"Query executed")
                
                column_name = [desc[0] for desc in cursor.description]
                DI_object = dict(zip(column_name,result))
                logRequest(levelName=logging.INFO, message="Query formatted")
                return DI_object

    def GetInfoDIConexos(self, input_ref_ext):
        logRequest(levelName=logging.INFO, message=f"Aquiring pool connection")
        with self.pool.acquire() as connection:
            logRequest(levelName=logging.INFO, message=f"Creating cursor")
            with connection.cursor() as cursor:
                logRequest(levelName=logging.INFO, message=f"Executing query")
                calc_query_input = self.calc_query.replace("%INPUT_REF_EXT%",input_ref_ext)
                result = cursor.execute(calc_query_input).fetchone()
                if(not result):
                    logRequest(levelName=logging.ERROR, message="Query de execução de REX_EXT falhou")
                    raise oracledb.DatabaseError("Query de execução de REX_EXT falhou") 

                logRequest(levelName=logging.INFO, message=f"Query executed")
                
                column_name = [desc[0] for desc in cursor.description]
                DI_object = dict(zip(column_name,result)) if result else {} 
                logRequest(levelName=logging.INFO, message="Query formatted")
                return DI_object
