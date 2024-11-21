import React, { useEffect, useState } from "react"
import { FiledListKeyValue } from "../key_value_list";
import { KeyValuePair, TaxaNegociada, TaxasNegociadasEstrutura } from "@/data/types";
import Collapsible from "../collapsible";
import ServicosPage from "./servicos_page";

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

    

    useEffect( () => {
        const returnNegociacao = {taxas_negociadas : {...negociacao}}
        console.log(returnNegociacao)
        returnedValue(returnNegociacao)

    },[negociacao])
    

    function handleServiceAddChange(return_value : any) {
        const merged : TaxasNegociadasEstrutura = currentValues;

        // Get all keys from both objects
        const keys = new Set([...Object.keys(negociacao), ...Object.keys(return_value)]);
    
        // Iterate over each key
        keys.forEach((key : string) => {
            // If both objects have the same key and both values are objects, merge them
            if (negociacao[key as keyof TaxasNegociadasEstrutura] && return_value[key]) {
                merged[key  as keyof TaxasNegociadasEstrutura] = { ...negociacao[key as keyof TaxasNegociadasEstrutura], ...return_value[key] };
            } else {
                // Otherwise, take the value from negociacao or return_value
                merged[key  as keyof TaxasNegociadasEstrutura] = negociacao[key as keyof TaxasNegociadasEstrutura] || return_value[key];
            }
        });
        
        setNegociacao(() => {
            
            return merged
                
        })
    }

    return (
        <div className="font-inter p-4 items-center text-white">
            
            <h1 className="text-center font-semibold text-2xl">Taxas</h1>
        
            <div className="mt-4 flex justify-between w-full p-4">
                
                <div className="w-full p-4 space-x-2">
                    <div className="mt-12 space-y-4">
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
                                                    return {...key,value : currentValues[mercadoria as keyof TaxasNegociadasEstrutura][key.key as keyof TaxaNegociada]}
                                                })} 
                                                selectValue={handleFieldChange} 
                                                />
                                                <ServicosPage noNeedObrigatorio={true} currentValues={currentValues[mercadoria as keyof TaxasNegociadasEstrutura].custos_adicionais_conteiner} tipo_mercadoria={mercadoria} input_key="custos_adicionais_conteiner" returnedValue={handleServiceAddChange} />
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
