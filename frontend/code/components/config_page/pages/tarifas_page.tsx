import React, { useEffect, useState } from "react"
import { KeyValuePair } from "@/data/types";
import { FiledListKeyValue } from "../key_value_list";
import { TarifasEstrutura } from "@/data/types";


type TarifasPageProps = {
    returnedValue: (return_value : any) => void;
    currentValues : TarifasEstrutura,
    tipo_mercadoria? : string
  };

export default function TarifasPage({
    returnedValue,
    currentValues,
    tipo_mercadoria
} : TarifasPageProps) {

    const [tarifas,setTarifas] = useState<TarifasEstrutura>(currentValues)
    useEffect( () => {
        console.log(tarifas)
        if(tipo_mercadoria){
            returnedValue( {
                [tipo_mercadoria] : {
                    tarifas : tarifas
                }
            })
        }else {
            
            returnedValue( {
                tarifas : tarifas
            })
        }
    },[tarifas])

    const tarifasListArmazem : KeyValuePair[] = [
        {
          key : "primeiro_periodo",
          label : "Tarifa primeiro periodo",
          value : tarifas.armazem.primeiro_periodo,
          isPorcentage : true  
        },
        {
            key : "primeiro_periodo_minima",
            label : "Mínima primeiro periodo",
            value : tarifas.armazem.primeiro_periodo_minima  
        },
        {
            key : "segundo_periodo",
            label : "Tarifa segundo periodo",
            value : tarifas.armazem.segundo_periodo  ,
            isPorcentage : true
        },
        {
            key : "segundo_periodo_minima",
            label : "Mínima segundo periodo",
            value : tarifas.armazem.segundo_periodo_minima  
        },
        {
            key : "terceiro_periodo",
            label : "Tarifa terceiro periodo",
            value : tarifas.armazem.terceiro_periodo,
            isPorcentage : true 
        },
        {
            key : "terceiro_periodo_minima",
            label : "Mínima terceiro periodo",
            value : tarifas.armazem.terceiro_periodo_minima  
        },
        {
            key : "quarto_periodo",
            label : "Tarifa quarto periodo",
            value : tarifas.armazem.quarto_periodo,
            isPorcentage : true
        },
        {
            key : "quarto_periodo_minima",
            label : "Mínima quarto periodo",
            value : tarifas.armazem.quarto_periodo_minima  
        }
    ]

    const tarifasListEnergia : KeyValuePair[] = [
        {
            key : "primeiro_periodo",
            label : "Valor primeiro periodo",
            value : tarifas.energia.primeiro_periodo  
        },
        {
            key : "segundo_periodo",
            label : "Valor Segundo periodo",
            value : tarifas.energia.segundo_periodo  
        },
        {
            key : "terceiro_periodo",
            label : "Valor Terceiro periodo",
            value : tarifas.energia.terceiro_periodo  
        },
        {
            key : "quarto_periodo",
            label : "Valor Quarto periodo",
            value : tarifas.energia.quarto_periodo  
        }
    ]

    function handleKeyValueListChange(return_value : any) {
        setTarifas((oldTarifas) => {
            return {...oldTarifas, ...return_value}
        })
    }
    

    return (     
        <div className="font-inter p-4 items-center text-white">
            <h1 className="text-center font-semibold text-2xl">Tarifas</h1>
        
        
            <div className="mt-4 flex justify-between w-full p-4">
                
                
                <div className="w-2/5 p-4 space-x-2">
                    <h1 className="text-center mt-4 font-semibold text-md">
                        Armazenagem
                    </h1>
                    <div className="mt-12 space-y-4">

                        <FiledListKeyValue input_key="armazem" selectValue={handleKeyValueListChange} keyValueList={tarifasListArmazem}/>
                        
                    </div>        
                </div>

                <div className="w-2/5 p-4 space-x-4">
                    <h1 className="text-center mt-4 font-semibold text-md">
                        Energia
                    </h1>
                    <div className="mt-12 space-y-4">
                        <FiledListKeyValue input_key="energia" selectValue={handleKeyValueListChange} keyValueList={tarifasListEnergia}/>
                    </div>        
                </div>
        </div>
    </div>   

    );
}
