import React, { useEffect, useState } from "react"
import { KeyValuePair, Periodos } from "@/data/types";
import { FiledListKeyValue } from "../key_value_list";
import { PeriodoEstrutura } from "@/data/types";


type PeriodosPageProps = {
    returnedValue: (return_value : any) => void;
    currentValues : PeriodoEstrutura
  };

export default function PeriodosPage({
    returnedValue,
    currentValues
} : PeriodosPageProps) {

    const defaultPeriodos : Periodos = {
        primeiro_periodo_dia : 0,
        segundo_periodo_dia : 0,
        terceiro_periodo_dia : 0,
        quarto_periodo_dia : 0,
    }

    const [armazemObject, setArmazemObject] = useState<any>({armazem: currentValues.armazem ? currentValues.armazem : defaultPeriodos })
    const [energiaObject, setEnergiaObject] = useState<any>({energia : currentValues.energia ? currentValues.energia : defaultPeriodos})

    useEffect( () => {
        returnedValue( {
            periodos : {
                ...armazemObject,
                ...energiaObject
            }
        })
    },[armazemObject,energiaObject])

    const periodosListArmazem : KeyValuePair[] = [
        {
            key : "primeiro_periodo_dia",
            label : "Último dia do primeiro periodo",
            value : currentValues.armazem ? currentValues.armazem.primeiro_periodo_dia : 0 
        },
        {
            key : "segundo_periodo_dia",
            label : "Último dia do segundo periodo",
            value : currentValues.armazem ? currentValues.armazem.segundo_periodo_dia : 0 
        },
        {
            key : "terceiro_periodo_dia",
            label : "Último dia do terceiro periodo",
            value : currentValues.armazem ? currentValues.armazem.terceiro_periodo_dia : 0 
        },
        {
            key : "quarto_periodo_dia",
            label : "Último dia do quarto periodo",
            value : currentValues.armazem ? currentValues.armazem.quarto_periodo_dia : 0 
        },
    ]

    const periodosListEnergia : KeyValuePair[] = [
        {
            key : "primeiro_periodo_dia",
            label : "Último dia do primeiro periodo",
            value : currentValues.energia ? currentValues.energia.primeiro_periodo_dia : 0 
        },
        {
            key : "segundo_periodo_dia",
            label : "Último dia do segundo periodo",
            value : currentValues.energia ? currentValues.energia.segundo_periodo_dia : 0 
        },
        {
            key : "terceiro_periodo_dia",
            label : "Último dia do terceiro periodo",
            value : currentValues.energia ? currentValues.energia.terceiro_periodo_dia : 0 
        },
        {
            key : "quarto_periodo_dia",
            label : "Último dia do quarto periodo",
            value : currentValues.energia ? currentValues.energia.quarto_periodo_dia : 0 
        },
    ]

    function handleKeyValueListChangeArmazem(return_value : any) {
        setArmazemObject(return_value)
    }
    
    function handleKeyValueListChangeEnergia(return_value : any) {
        setEnergiaObject(return_value)
    }

    return (     
        <div className="font-inter p-4 items-center text-white">
            <h1 className="text-center font-semibold text-2xl">Períodos</h1>
        
        
            <div className="mt-4 flex justify-between w-full p-4">
                
                
                <div className="w-2/5 p-4 space-x-2">
                    <h1 className="text-center mt-4 font-semibold text-md">
                        Armazenagem
                    </h1>
                    <div className="mt-12 space-y-4">

                        <FiledListKeyValue input_key="armazem" selectValue={handleKeyValueListChangeArmazem} keyValueList={periodosListArmazem}/>
                        
                    </div>        
                </div>

                <div className="w-2/5 p-4 space-x-4">
                    <h1 className="text-center mt-4 font-semibold text-md">
                        Energia
                    </h1>
                    <div className="mt-12 space-y-4">
                        <FiledListKeyValue input_key="energia" selectValue={handleKeyValueListChangeEnergia} keyValueList={periodosListEnergia}/>
                    </div>        
                </div>
        </div>
    </div>   

    );
}
