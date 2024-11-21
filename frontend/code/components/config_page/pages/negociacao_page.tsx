import React, { useEffect, useState } from "react"
import { FiledListKeyValue } from "../key_value_list";
import { KeyValuePair, PeriodoEstrutura, Servico, TarifasEstrutura, TaxaNegociada, TaxasNegociadasEstrutura } from "@/data/types";
import Collapsible from "../collapsible";
import ServicosPage from "./servicos_page";
import TarifasPage from "./tarifas_page";
import PeriodosPage from "./periodos_page";

type NegociacaoPageProps = {
    returnedValue: (return_value : any) => void
    tipoMercadoria : string[]
    currentValues : TaxasNegociadasEstrutura
};

export default function NegociacaoPage({
    returnedValue,
    tipoMercadoria,
    currentValues
} : NegociacaoPageProps) {

    const [negociacao,setNegociacao] = useState<TaxasNegociadasEstrutura>(currentValues) 
    

    const camposNegociacao : KeyValuePair[] = 
    [
        {
            key : "levante",
            label : "Taxa Levante",
            value : 0
        },
        
        {
            key : "armazem",
            label : "Taxa Armazem",
            value : 0
        }
    ]
    
    // const keyValueListInput : KeyValuePair[] = tipoMercadoria.map( mercadoria => {return {
    //         key : mercadoria,
    //         label : mercadoria,
    //         value : ""
    //     }
    // })


    function isTaxaNegociada(value: TarifasEstrutura | TaxaNegociada | PeriodoEstrutura): value is TaxaNegociada {
        //Verificando se o valor passado é TaxaNegociada
        return (value as TaxaNegociada).custos_adicionais_conteiner !== undefined; 
    }

    function returnServicosFromTarifas( taxas_negociadas_values : TaxasNegociadasEstrutura, mercadoria : string) : Servico[]{
        
        const taxaNegociadaComposition = taxas_negociadas_values[mercadoria as keyof TaxasNegociadasEstrutura]

        if (isTaxaNegociada(taxaNegociadaComposition)) {
            // Tentando determinar se taxaNegociadaComposition é TaxaNegociada, para acessar custos_adicionais_conteiner
            return taxaNegociadaComposition.custos_adicionais_conteiner;
        } else {
            console.error("Value is not of type TaxaNegociada");
            return []
        }
    }

    function handleFieldChange(return_value : any) {
        setNegociacao((oldNegociacao) => {
        const newNegociacao = {...oldNegociacao}
        
        for (const tipoMercadoria in negociacao ){
            if(tipoMercadoria in return_value){
                newNegociacao[tipoMercadoria as keyof TaxasNegociadasEstrutura] = {...newNegociacao[tipoMercadoria as keyof TaxasNegociadasEstrutura],...return_value[tipoMercadoria]}
            }

        }
        
        return newNegociacao
        }   
    )
    }
    function handleNonFare(return_value : any) {
        setNegociacao((oldNegociacao) => {
            const newNegociacao = {...oldNegociacao, ...return_value}
            return newNegociacao
        }   
    )
    }

    

    useEffect( () => {
        const returnNegociacao = {taxas_negociadas : {...negociacao}}
        console.log(returnNegociacao)
        returnedValue(returnNegociacao)

    },[negociacao])
    

    function handleServiceAddChange(return_value : any) {
        const merged = currentValues;

        // Pega todas as chaves do objeto retornado
        const keys = new Set(Object.keys(return_value));
    
        // Itera sobre eles (é para ter apenas um)
        keys.forEach((key : string) => {
                
            // Caso os dois tenham a mesma chave, une os dois
            if (negociacao[key as keyof TaxasNegociadasEstrutura] && return_value[key]) {
                merged[key  as keyof TaxasNegociadasEstrutura] = { ...negociacao[key as keyof TaxasNegociadasEstrutura], ...return_value[key] };
            } 
        
        });
        
        //Retorna o objeto unido
        setNegociacao(() => {
            
            return merged
                
        })
    }

    return (
        <div className="font-inter p-4 items-center text-white">
            
            <h1 className="text-center font-semibold text-2xl">Taxas Negociadas</h1>
        
            <div className="mt-4 flex justify-between w-full p-4">
                
                <div className="w-full p-4 space-x-2">
                    <div className="mt-12 space-y-4">
                        <TarifasPage returnedValue={handleNonFare} currentValues={currentValues.tarifas} />
                        
                        <PeriodosPage returnedValue={handleNonFare} currentValues={currentValues.periodos}/>
                        
                        {
                            tipoMercadoria.map(
                                mercadoria => { return <Collapsible 
                                        key={mercadoria} 
                                        title={mercadoria} 
                                        open={false}>
                                            <>  
                                                <FiledListKeyValue 
                                                input_key={mercadoria} 
                                                keyValueList={camposNegociacao.map(key=> {
                                                    return {...key,value : currentValues[mercadoria as keyof TaxasNegociadasEstrutura][key.key as keyof (TaxaNegociada | TarifasEstrutura)]}
                                                })} 
                                                selectValue={handleFieldChange} 
                                                />
                                                <ServicosPage noNeedObrigatorio={true} currentValues={returnServicosFromTarifas(currentValues,mercadoria)} tipo_mercadoria={mercadoria} input_key="custos_adicionais_conteiner" returnedValue={handleServiceAddChange} />
                                                <div className="h-[40rem]"></div>
                                            </>
                                        </Collapsible>
                                }
                            )   
                        }
                    </div>        
                </div>
            </div>
        </div>
    );
}
