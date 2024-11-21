from datetime import datetime
import json
from copy import deepcopy
from flask import Flask, jsonify, url_for, render_template, request, redirect, g
from flask_cors import CORS, cross_origin
from collections import Counter
from waitress import serve
from utils.models import TiposMercadorias, TiposConteiner, loadRecintos, saveRecintos, deleteRecintos, loadDicionarioConteiner
from conexos.integration import ConexosDatabaseIntegration
from utils.logger import logRequest
import utils.calculadora as calculadora
from oracledb import DatabaseError
import logging

# Instancia o APP no flask
app = Flask(__name__)


# Adiciona CORS 
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


recintos = {}
dicionario = loadDicionarioConteiner()
conexos = ConexosDatabaseIntegration()
max_retry = 5

# APIs para pegar informações dos recintos
# Nomes dos recintos

@app.before_request
def store_client_ip():
    # Store the client IP in g
    g.client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)


@app.route("/recintos/infos", methods=["GET"])
@cross_origin()
def infos():

    listNames = list(recintos.keys())
    
    result =[dict(zip(("id","nome"),(recintos[info]["id"],info))) for info in listNames]

    logRequest(levelName=logging.INFO, message="Retornando informacoes dos recintos")
    return jsonify(result)

# Custos obrigatorios de um recinto
@app.route("/recintos/<recinto>/custosObrigatorios", methods=["GET"])
def custosObrigatorios(recinto):
    servicos = deepcopy(recintos[recinto]['custos_adicionais_conteiner'])
    custos_obrigatorios = list(filter(lambda servico: servico['obrigatorio'],servicos))
    
    # Remove a tag valor do custos_obrigatorios por ser um 
    for item in custos_obrigatorios:
        item.pop('valor', None)  # Removes 'valor' if it exists, does nothing if it doesn't
        
    logRequest(levelName=logging.INFO, message=f"Retornando custo obrigatório do recinto {recinto}")
    return jsonify(custos_obrigatorios)

# Custos possiveis de um conteiner daquele recinto
@app.route("/recintos/<recinto>/custosConteiner", methods=["GET"])
def custosConteiner(recinto):
    servicos = deepcopy(recintos[recinto]["custos_adicionais_conteiner"])
    custos_conteiner = list(filter(lambda servico: not servico['obrigatorio'],servicos))
    
    # Remove a tag valor do custos_conteiner por ser um 
    for item in custos_conteiner:
        item.pop('valor', None)  # Removes 'valor' if it exists, does nothing if it doesn't

    logRequest(levelName=logging.INFO, message=f"Retornando custo de containeres do recinto {recinto}")
    return jsonify(custos_conteiner)

# Periodos
@app.route("/recintos/<recinto>/periodo", methods=["GET"])
def periodos(recinto):
    periodo = recintos[recinto]["periodos"]["armazem"]
    periodos_negociacao = recintos[recinto]["taxas_negociadas"]["periodos"]["armazem"].items()
    for tupla in periodos_negociacao:
        if(tupla[1]):
            periodo[tupla[0]] = tupla[1] 
        
    logRequest(levelName=logging.INFO, message=f"Retornando periodo do recinto {recinto}")
    return jsonify(periodo)


@app.route("/data/tipo/mercadoria", methods=["GET"])
def tipoMercadoria():
    logRequest(levelName=logging.INFO, message=f"Retornando tipos de mercadorias")
    return TiposMercadorias.get_all_values()

@app.route("/data/tipo/conteiner", methods=["GET"])
def tipoConteiner():
    logRequest(levelName=logging.INFO, message=f"Retornando tipos de container")
    return TiposConteiner.get_all_values()

@app.route("/recinto/<recinto>/info", methods=["GET"])
def get_all_info(recinto):
    #Pegar dados do request
    try:
        data = recintos[recinto]
        logRequest(levelName=logging.INFO, message=f"Retornando informação do recinto {recinto}")
        return jsonify(data)    
    except:
        logRequest(levelName=logging.ERROR, message=f"Retornando informação do recinto {recinto}")
        return jsonify({"ERROR": "Recinto invalido"},{"CODE_STATUS" : "INVALID_RECINCT"}), 400



@app.route("/recinto", methods=["POST"])
def update_recinct():
    global recintos
    #Pegar dados do request
    data = request.get_json()
    response = saveRecintos(data)
    recintos = response
    logRequest(levelName=logging.INFO, message=f"Recinto atualizado com sucesso")
    return response


@app.route("/recinto", methods=["DELETE"])
def delete_recinct():
    global recintos
    #Pegar dados do request
    data = request.args.to_dict()
    response = deleteRecintos(data.get("nome"))
    recintos = response
    logRequest(levelName=logging.INFO, message=f"Recinto deletado com sucesso")
    return response

@app.route("/refExt/<refExt>", methods=["GET"])
def getInfoFromRefExt(refExt):
    if(not refExt):
        logRequest(levelName=logging.ERROR, message=f"Referência externa não enviada")
        return jsonify({"ERROR": f"Referência externa não enviada."},{"CODE_STATUS" : "INVALID_REFEXT"}), 400
    
    DI = None
    refExt = str(refExt).replace("/","").replace("-","")
    refExtFormatted = refExt[:-2] + '/' + refExt[-2:] 
    
    logRequest(levelName=logging.INFO, message=f"Getting info about REF_EXT {refExtFormatted}")
    count = 0
    while(count < max_retry):
        try:
            DI = conexos.GetInfoDIConexos(refExtFormatted)
            break
        except DatabaseError as e:
            logRequest(levelName=logging.WARNING, message=f"Erro ao gerar query: {e}")
            count = count + 1

    if(count == max_retry):
        logRequest(levelName=logging.ERROR, message=f"Problema ao gerar a query no banco de dados")    
        return jsonify({"ERROR": f"Problema ao gerar a query no banco de dados."},{"CODE_STATUS" : "DATABASE_ERROR"}), 400


    try:
        containeres = json.loads(DI["CONTAINERES"])
    except:
        logRequest(levelName=logging.ERROR, message=f"Containeres da DI não estão em um formato JSON")    
        return jsonify({"ERROR": f"Containeres da DI não estão em um formato JSON."},{"CODE_STATUS" : "INVALID_FORMAT_DI"}), 400
    
    tipos_mercadorias = []

    for container in containeres:
        rows_searched = dicionario.loc[(dicionario['Descrição'] == container["tipo"])]
        if(len(rows_searched) <= 0):
            logRequest(levelName=logging.ERROR, message=f"Tipo de container: '{container["tipo"]}' não encontrado")
            return jsonify({"ERROR": f"Tipo de container: '{container["tipo"]}' não encontrado."},{"CODE_STATUS" : "CONTAINER_TYPE_NOT_FOUND"}), 400
        if(len(rows_searched) > 1):
            logRequest(levelName=logging.ERROR, message=f"Tipo de container: '{container["tipo"]}' encontrado em múltiplas instancias")
            return jsonify({"ERROR": f"Tipo de container: '{container["tipo"]}' encontrado em múltiplas instancias."},{"CODE_STATUS" : "MULTIPLE_CONTAINER_TYPE"}), 400
        container_found = rows_searched.iloc[0]
        
        tipos_mercadorias.append(container_found["Tipo_Mercadoria"])
        container["tipo_container"] = container_found["Tipo_Conteiner"]


    DI["CONTAINERES"] = json.dumps(containeres)

    unique_tipo_mercadoria = set(tipos_mercadorias)
    if(len(unique_tipo_mercadoria) > 1):
        logRequest(levelName=logging.ERROR, message=f"Foram encontradados os seguintes tipos de mercadoria: '{unique_tipo_mercadoria}' encontrado em múltiplas instancias")
        return jsonify({"ERROR": f"Foram encontradados os seguintes tipos de mercadoria: '{unique_tipo_mercadoria}' encontrado em múltiplas instancias."},{"CODE_STATUS" : "MULTIPLE_PRODUCT_TYPE"}), 400

    DI["TIPO_MERCADORIA"] = unique_tipo_mercadoria.pop()
    
    logRequest(levelName=logging.INFO, message=f"DI do processo {refExt} encontrada e estruturada com sucesso")
        
    return jsonify(DI)

@app.route('/calc', methods=['POST'])
def calc():
    logRequest(levelName=logging.INFO, message=f"Iniciando calculo")
    # Init vars
    cif = 0
    recintoNome = 0
    ref_ext = 0
    tipo_mercadoria_input = 0
    custo_obrigatorio = 0
    conteineres = 0
    valor_cif = 0
    recinto = 0
    valor_armazenagem = 0
    valor_levante = 0
    valor_servicos = Counter()
    valor_energia = 0

    #Pegar dados do request
    data = request.get_json()

    # Separar os dados nos campos de CIF, recinto, tipo_mercadoria e os conteineres
    
    try:
        cif = data['cif']
        recintoNome = data['recinto']
        ref_ext = data['ref_ext']
        tipo_mercadoria_input = data['tipo_mercadoria']
        custo_obrigatorio = data['custos_obrigatorios']
        conteineres = data['conteineres']
    except Exception as e:
        logRequest(levelName=logging.ERROR, message=f"Campo não encontrado: {e}")
        return jsonify({"ERROR": f"Campos obrigatórios não presentes. Erro: {str(e)}"},{"CODE_STATUS" : "REQUIRED_FIELDS_EMPTY"}), 400


    #Pega o recinto do modelo que foi passado
    recinto = recintos[recintoNome]
    
    
    #Tentar converter o CIF para float
    try:
        valor_cif = float(cif)
    except:
        logRequest(levelName=logging.ERROR, message=f"CIF inválido: {cif}")
        return jsonify({"ERROR": "CIF inválido"},{"CODE_STATUS" : "INVALID_CIF"}), 400
    
    logRequest(levelName=logging.INFO, message=f"Valor CIF {valor_cif}")

    for conteiner in conteineres:
        input_entrada = conteiner['entrada']
        input_saida = conteiner['saida']
        data_entrada = {}
        data_saida = {}
    
        
        # Converter datas para datetime, e verificar se são válidas
        try:
            data_entrada = datetime.strptime(input_entrada, '%d/%m/%Y')
        except:
            logRequest(levelName=logging.ERROR, message=f"Data de entrada inválida: {input_entrada}")
            return jsonify({"ERROR": "Data de entrada inválida"},{"CODE_STATUS" : "INVALID_ENTRY_DATE"}), 400
        
        try:
            data_saida = datetime.strptime(input_saida, '%d/%m/%Y')
        except:
            logRequest(levelName=logging.ERROR, message=f"Data de saida inválida: {input_saida}")
            return jsonify({"ERROR": "Data de saída inválida"},{"CODE_STATUS" : "INVALID_EXIT_DATE"}), 400

        logRequest(levelName=logging.INFO, message=f"Calculando armazenagem")
        try:
            # Calcular o valor de armazenagem do conteiner
            valor_armazenagem += calculadora.calcularArmazenagem(tipo_mercadoria=tipo_mercadoria_input,entrada=data_entrada,saida=data_saida,recinto=recinto,valor_cif=valor_cif,conteineres=conteineres)
        except Exception as e:
            logRequest(levelName=logging.ERROR, message=f"Erro ao calcular a armazenagem do conteiner {conteiner["sequence"]}. Error {e}")
            return jsonify({"ERROR": f"Erro ao calcular a armazenagem do conteiner {conteiner["sequence"]}. Error {e}"},{"CODE_STATUS" : "CALC_STORAGE_ERROR"}), 400


        logRequest(levelName=logging.INFO, message=f"Calculando levante")
        # Calcular o valor do levante do conteiner
        try:
            valor_levante += calculadora.calcularLevante(conteiner=conteiner,recinto=recinto,tipo_mercadoria=tipo_mercadoria_input)
        except Exception as e:
            logRequest(levelName=logging.ERROR, message=f"Erro ao calcular o levante do conteiner {conteiner["sequence"]}. Error {e}")
            return jsonify({"ERROR": f"Erro ao calcular o levante do conteiner {conteiner["sequence"]}. Error {e}"},{"CODE_STATUS" : "CALC_PULLING_ERROR"}), 400

        # Calcular o valor dos serviços do conteiner
        servicos = conteiner['servicos'] + custo_obrigatorio

        logRequest(levelName=logging.INFO, message=f"Calculando servicos")

        try:
            valor_servicos +=  calculadora.calcularServicosConteiner(servicos=servicos,recinto=recinto,tipo_mercadoria=tipo_mercadoria_input)
        except Exception as e:
            logRequest(levelName=logging.ERROR, message=f"Erro ao calcular os serviços do conteiner {conteiner["sequence"]}. Error {e}")
            return jsonify({"ERROR": f"Erro ao calcular os serviços do conteiner {conteiner["sequence"]}. Error {e}"},{"CODE_STATUS" : "CALC_SERVICES_ERROR"}), 400

        logRequest(levelName=logging.INFO, message=f"Calculando Energia")

        #Calcular energia caso seja reefer
        try:
            valor_energia += calculadora.calcularEnergia(entrada=data_entrada,saida=data_saida,recinto=recinto,tipo_mercadoria_input=tipo_mercadoria_input)
        except Exception as e:
            logRequest(levelName=logging.ERROR, message=f"Erro ao calcular energia do conteiner {conteiner["sequence"]}. Error {e}")
            return jsonify({"ERROR": f"Erro ao calcular energia do conteiner {conteiner["sequence"]}. Error {e}"},{"CODE_STATUS" : "CALC_ENERGY_ERROR"}), 400
    jsonValorTotal = { 
        "valorArmazenagem" : valor_armazenagem,
        "valorLevante" : valor_levante,
        "valorServicos" : valor_servicos,
        "valorEnergia" : valor_energia
                        
    }

    logRequest(levelName=logging.INFO, message=f"Calculagem finalizada. Valores: {jsonValorTotal}")

    return jsonValorTotal
    

if __name__ == '__main__':

    recintos = loadRecintos()

    app.debug = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    #app.run(host="0.0.0.0", port=3002, debug=True)
    serve(app, host='0.0.0.0', port=3002)
