from utils.models import TiposMercadorias
from collections import Counter
import logging
from utils.logger import logRequest

# Calculo de armazenagem dentro do periodo
def calcular_periodo(valor_cif, quantidade_dias, recinto, periodo, minimo,conteineres):
    
    tarifa = recinto['tarifas']['armazem'][periodo] if not recinto["taxas_negociadas"]["tarifas"]['armazem'][periodo] else recinto["taxas_negociadas"]["tarifas"]['armazem'][periodo]
    valor_minimo =recinto['tarifas']['armazem'][minimo] if not recinto["taxas_negociadas"]["tarifas"]['armazem'][minimo] else recinto["taxas_negociadas"]["tarifas"]['armazem'][minimo]
    logRequest(levelName=logging.INFO, message=recinto["taxas_negociadas"]["tarifas"]['armazem'][minimo])
    # Calcula quanto que é o valor do cif, dividindo a quantidade de conteieneres, vezes a tarifa do periodo
    temp_armazenagem = valor_cif * tarifa / len(conteineres)
    armazenagem = 0
    # Se esse valor for menor que o valor minimo, o valor da armzenagem é a tarifa minima vezes qtd conteineres
    if(temp_armazenagem < valor_minimo):
        armazenagem = valor_minimo
    else:
        armazenagem = valor_cif * tarifa / len(conteineres)
    # Retorna o valor calculado, multiplicado pelos os dias no período
    return armazenagem * quantidade_dias

def calcularLevante(conteiner,recinto,tipo_mercadoria):
    levante = 0
    taxa = recinto["taxa_padrao"]["levante"][tipo_mercadoria] if not recinto["taxas_negociadas"][tipo_mercadoria]["levante"] else recinto["taxas_negociadas"][tipo_mercadoria]["levante"] 
    try:
        levante += recinto["levante"][conteiner['tipo']]
    except:
        raise ValueError("Tipo de conteiner encontrado inválido")

    try:
        levante += levante*taxa
    except:
        raise ValueError("Tipo de mercadoria não encontrada")


    logRequest(levelName=logging.INFO, message=f"Levange {levante}")
    return round(levante,2)



def calcularArmazenagem(tipo_mercadoria, entrada, saida, recinto, valor_cif,conteineres):
    armazenagem = 0
    # Verificar em qual período a diferença de dias se encaixa

    diferenca_dias = (saida-entrada).days + 1
    dias_faltantes = 0

    primeiro_periodo = recinto["periodos"]["armazem"]['primeiro_periodo_dia'] if not recinto["taxas_negociadas"]["periodos"]['armazem']["primeiro_periodo_dia"] else recinto["taxas_negociadas"]["periodos"]['armazem']["primeiro_periodo_dia"]
    segundo_periodo = recinto["periodos"]["armazem"]['segundo_periodo_dia'] if not recinto["taxas_negociadas"]["periodos"]['armazem']["segundo_periodo_dia"] else recinto["taxas_negociadas"]["periodos"]['armazem']["segundo_periodo_dia"]
    terceiro_periodo = recinto["periodos"]["armazem"]['terceiro_periodo_dia'] if not recinto["taxas_negociadas"]["periodos"]['armazem']["terceiro_periodo_dia"] else recinto["taxas_negociadas"]["periodos"]['armazem']["terceiro_periodo_dia"]
    quarto_periodo = recinto["periodos"]["armazem"]['terceiro_periodo_dia'] if not recinto["taxas_negociadas"]["periodos"]['armazem']["terceiro_periodo_dia"] else recinto["taxas_negociadas"]["periodos"]['armazem']["terceiro_periodo_dia"]
    
    
    # Calcular o primeiro periodo obrigatório
    
    dias_faltantes = diferenca_dias - primeiro_periodo

    
    logRequest(levelName=logging.INFO, message=f"Dias faltantes {dias_faltantes}")
    logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")

    armazenagem += calcular_periodo(
        valor_cif=valor_cif, 
        recinto=recinto, 
        quantidade_dias=1,
        periodo='primeiro_periodo',
        minimo='primeiro_periodo_minima',
        conteineres=conteineres
    )
        
    logRequest(levelName=logging.INFO, message=f"Dias faltantes {dias_faltantes}")
    logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")
    # Calcular segundo periodo se faltam dias
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do segundo periodo 
        dias_periodo = segundo_periodo - primeiro_periodo
        dias_calculo = dias_periodo if dias_faltantes >= dias_periodo else dias_faltantes
        dias_faltantes -= dias_calculo
        armazenagem += calcular_periodo(
            valor_cif=valor_cif, 
            recinto=recinto, 
            quantidade_dias=dias_calculo,
            periodo='segundo_periodo',
            minimo='segundo_periodo_minima',
        conteineres=conteineres
        )
        logRequest(levelName=logging.INFO, message=f"Dias faltantes {dias_faltantes}")
        logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do terceiro
        dias_periodo = terceiro_periodo - segundo_periodo
        dias_calculo = dias_periodo if dias_faltantes >= dias_periodo else dias_faltantes
        dias_faltantes -= dias_calculo
        armazenagem += calcular_periodo(
            valor_cif=valor_cif, 
            recinto=recinto, 
            quantidade_dias=dias_calculo,
            periodo='terceiro_periodo',
            minimo='terceiro_periodo_minima',
        conteineres=conteineres
        )
        logRequest(levelName=logging.INFO, message=f"Dias faltantes {dias_faltantes}")
        logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")
        
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do terceiro
        if(dias_faltantes > quarto_periodo):
            raise ValueError("A quantidade de de dias é maior que o permitido pelo Recinto")
        
        armazenagem += calcular_periodo(
            valor_cif=valor_cif, 
            recinto=recinto, 
            quantidade_dias=dias_faltantes,
            periodo='quarto_periodo',
            minimo='quarto_periodo_minima',
        conteineres=conteineres
        )
        logRequest(levelName=logging.INFO, message=f"Dias faltantes {dias_faltantes}")
        logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")
    
    armazenagem = armazenagem + (armazenagem * recinto["taxa_padrao"]["armazem"][tipo_mercadoria])

    logRequest(levelName=logging.INFO, message=f"Armazenagem {armazenagem}")

    return round(armazenagem,2)

def calcularServicosConteiner(servicos,recinto,tipo_mercadoria):
    
    valor_total_servicos = Counter()
    
    logRequest(levelName=logging.INFO, message=f"Servicos {valor_total_servicos}")
    servicos_recinto = recinto['custos_adicionais_conteiner']
    servicos_desconto_recinto = recinto['taxas_negociadas'][tipo_mercadoria]["custos_adicionais_conteiner"]
    
    taxa_multiplicador_padrao = recinto["taxa_padrao"]["custos_adicionais_conteiner"][tipo_mercadoria]


    for servico in servicos:
        servico_filtrado = None

        
        #Verifica se o servico iterado tem uma taxa de desconto
        taxa_negociada_filtrada = next(filter(lambda taxa_servico : taxa_servico['id'] == servico, servicos_desconto_recinto), None)
        taxa_multiplicador = taxa_negociada_filtrada["valor"] if taxa_negociada_filtrada else taxa_multiplicador_padrao  
        
        servico_filtrado = next(filter(lambda recinto_servico : recinto_servico['id'] == servico, servicos_recinto), None)
        
        if servico_filtrado:
            valor_servico = (servico_filtrado['valor'] + (servico_filtrado['valor'] * taxa_multiplicador))
            valor_total_servicos += Counter({servico_filtrado["nome"] : valor_servico})
        else:
            raise ValueError(f"Servico {servico} não encontrado no campo 'custos_adicionais_conteiner' do Recinto ")
        logRequest(levelName=logging.INFO, message=f"Servicos {valor_total_servicos}")

    return valor_total_servicos

def calcularEnergia(entrada,saida,recinto,tipo_mercadoria_input):
    valor_energia = 0
    
    # Verifica se o tipo de mercadoria calcula energia
    if(tipo_mercadoria_input != TiposMercadorias.Reefer.value):
        return valor_energia
    # Verificar em qual período a diferença de dias se encaixa
    
    logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")

    diferenca_dias = (saida-entrada).days + 1
    dias_faltantes = 0

    logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
    logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")

    dias_faltantes = diferenca_dias - recinto['periodos']["energia"]['primeiro_periodo_dia']
    # Calcular o primeiro periodo obrigatório
    if(dias_faltantes < 0):
        valor_energia += recinto['tarifas']["energia"]['primeiro_periodo'] * diferenca_dias
    else:
        valor_energia += recinto['tarifas']["energia"]['primeiro_periodo'] * recinto['periodos']["energia"]['primeiro_periodo_dia']
    
    logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
    logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")
    
    # Calcular segundo periodo se faltam dias
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do segundo periodo 
        dias_periodo = recinto['periodos']["energia"]['segundo_periodo_dia'] - recinto['periodos']["energia"]['primeiro_periodo_dia']
        dias_calculo = dias_periodo if dias_faltantes >= dias_periodo else dias_faltantes
        dias_faltantes -= dias_calculo
        valor_energia += recinto['tarifas']["energia"]['segundo_periodo'] * dias_calculo
        logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
        logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")
    
    
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do terceiro
        dias_periodo = recinto['periodos']["energia"]['terceiro_periodo_dia'] - recinto['periodos']["energia"]['segundo_periodo_dia']
        dias_calculo = dias_periodo if dias_faltantes >= dias_periodo else dias_faltantes
        dias_faltantes -= dias_calculo
        valor_energia += recinto['tarifas']["energia"]['terceiro_periodo'] * dias_calculo
        logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
        logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")
    
    if(dias_faltantes > 0):
        # Calcular a quantidade de dias do terceiro
        if(dias_faltantes > recinto['periodos']["energia"]['quarto_periodo_dia']):
            raise ValueError("A quantidade de de dias é maior que o permitido pelco Recinto")
        
        valor_energia += recinto['tarifas']["energia"]['quarto_periodo'] * dias_faltantes
        logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
        logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")

    logRequest(levelName=logging.INFO, message=f"Energia {valor_energia}")
    logRequest(levelName=logging.INFO, message=f"Dias Faltantes {dias_faltantes}")
                
    return round(valor_energia,2)