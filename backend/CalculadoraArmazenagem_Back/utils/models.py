from enum import Enum
import json
import pandas as pd
from utils.logger import logInternal
import logging
def loadRecintos():
     logInternal(levelName=logging.INFO,message="Carregando informações de recinto")
     try:
          with open('data/recintos.json','r',encoding="utf-8") as file:
               data = json.load(file)
     except Exception as e:
          logInternal(logging.CRITICAL,"Arquivo de recintos.json não encontrado")
          raise EnvironmentError("Arquivo de recintos.json não encontrado")
     return data

def loadDicionarioConteiner():
     logInternal(levelName=logging.INFO,message="Carregando informações de Containeres")
     try:
          dicionario = pd.read_csv("data/Dicionario de conteiner.csv",delimiter=";")
     except Exception as e:
          logInternal(logging.CRITICAL,"Arquivo de dicionario de conteiner não encontrado")
          raise EnvironmentError("Arquivo de dicionario de conteiner não encontrado")
     return dicionario

def deleteRecintos(recinto_name):
     
     data = loadRecintos()
     
     del data[recinto_name]
     print(data,flush=True)

     with open('data/recintos.json','w',encoding="utf-8") as file:
          json.dump(data, file, 
                        indent=4,  
                        separators=(',',': '),
                        ensure_ascii=False)
     return data

def saveRecintos(newRecinto):
     data = loadRecintos()
     recinto_name = next(iter(newRecinto))
     data[recinto_name] = newRecinto[recinto_name]

     with open('data/recintos.json','w',encoding='utf-8') as file:
           json.dump(data, file, 
                        indent=4,  
                        separators=(',',': '),
                        ensure_ascii=False)

     return data

class TiposMercadorias(Enum):
    Normal = 'Normal'
    IMO = 'IMO'
    Oversize = 'Oversize'
    OversizeIMO = 'Oversize IMO'
    Reefer = 'Reefer'
    @classmethod
    def get_all_values(cls):
        return [tipo.value for tipo in cls]

class TiposConteiner(Enum):
        Normal = "Normal"
        OpenTop = "Open Top"
        CargaSolta = "Carga Solta"
        FlatRack = "Flat Rack"
        @classmethod
        def get_all_values(cls):
            return [tipo.value for tipo in cls]
