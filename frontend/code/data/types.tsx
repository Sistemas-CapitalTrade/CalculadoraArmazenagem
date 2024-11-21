type PeriodoEstrutura = {
    armazem : Periodos,
    energia : Periodos
}

type Periodos = {
    primeiro_periodo_dia : number | null,
    segundo_periodo_dia : number | null, 
    terceiro_periodo_dia : number | null,
    quarto_periodo_dia : number | null
}

type Panel = {
    id : string
    label : string
}

type MercadoriasTaxasEstrutura = {
    levante : MercadoriasTaxas,
    armazem : MercadoriasTaxas,
    custos_adicionais_conteiner : MercadoriasTaxas

}
type MercadoriasTaxas = {
    Normal : number,
    IMO : number,
    Oversize : number,
    "Oversize IMO" : number,
    Reefer : number

}
type ContainerTypesLevante = {
    Normal : number,
    "Carga Solta" : number,
    "Flat Rack" : number,
    "Open Top" : number
}
type TarifasCompositionEnergia = {
    primeiro_periodo: number | null,
    segundo_periodo: number | null,
    terceiro_periodo: number | null,
    quarto_periodo: number | null
}
type TarifasCompositionArmazem = {
    primeiro_periodo_minima: number | null,
    primeiro_periodo: number | null,
    segundo_periodo_minima: number | null,
    segundo_periodo: number | null,
    terceiro_periodo_minima: number | null,
    terceiro_periodo: number | null,
    quarto_periodo_minima: number | null,
    quarto_periodo: number | null

}

type TarifasEstrutura = {
    armazem : TarifasCompositionArmazem,
    energia : TarifasCompositionEnergia
}

type TaxaNegociada = {
    levante : number | null
    armazem : number | null
    custos_adicionais_conteiner : Servico[]
}

type TaxasNegociadasEstrutura = {
    tarifas : TarifasEstrutura,
    periodos : PeriodoEstrutura,
    Normal : TaxaNegociada,
    IMO : TaxaNegociada,
    Oversize : TaxaNegociada,
    "Oversize IMO" : TaxaNegociada,
    Reefer : TaxaNegociada,
    
}

type RecintoInfoType = {
    taxa_padrao : MercadoriasTaxasEstrutura,
    taxas_negociadas : TaxasNegociadasEstrutura,
    periodos : PeriodoEstrutura,
    tarifas: TarifasEstrutura,
    custos_adicionais_conteiner : Servico[]
    levante : ContainerTypesLevante
}

type Servico = {
    id : string,
    nome : string,
    valor : string,
    obrigatorio? : boolean
}

type KeyValuePair = {
    key : string,
    label : string,
    value : any
    isPorcentage? : boolean
}


type Conteiner = {
  
    id : number,
    numero : string,
    sequence : number,
    tipo_conteiner : string,
    entrada : Date | null,
    saida : Date | null,
    periodo : string,
    servicos : string[],
    tipo_conteiner_error? : boolean,
    entrada_error? : boolean,
    saida_error? : boolean
  
  }
  
  type InputLabelForm = {
    
    label : string,
    id: string 
  }
  
export type{PeriodoEstrutura, Periodos, Panel, RecintoInfoType, Servico, KeyValuePair, Conteiner, InputLabelForm, MercadoriasTaxasEstrutura, MercadoriasTaxas, ContainerTypesLevante, TarifasCompositionArmazem, TarifasCompositionEnergia, TaxasNegociadasEstrutura, TaxaNegociada, TarifasEstrutura}