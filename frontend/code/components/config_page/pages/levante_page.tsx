import React from "react"
import { FiledListKeyValue } from "../key_value_list";
import { KeyValuePair, ContainerTypesLevante } from "@/data/types";

type LevantePageProps = {
    returnedValue: (return_value : any) => void
    tipoConteiner : string[],
    currentValues : ContainerTypesLevante
  };
export default function LevantePage({
    returnedValue,
    tipoConteiner,
    currentValues
} : LevantePageProps) {
    


    const keyValueListInput : KeyValuePair[] = tipoConteiner.map( conteiner => {return {
                key : conteiner,
                label : conteiner,
                value : currentValues[conteiner as keyof typeof currentValues] ? currentValues[conteiner as keyof typeof currentValues] : 0
            }
        }
    )
    
    function handleKeyValueListChange(return_value : any) {
        
        returnedValue(return_value)
    }


    return (
        <div className="font-inter p-4 items-center text-white">
            
            <h1 className="text-center font-semibold text-2xl">Levante</h1>
        
        
            <div className="mt-4 flex justify-between w-full p-4">
                
                
                <div className="w-full p-4 space-x-2">
                    <div className="mt-12 space-y-4">

                        <FiledListKeyValue input_key="levante" selectValue={handleKeyValueListChange} keyValueList={keyValueListInput}/>
                        
                    </div>        
                </div>
            </div>
        </div>
    );
}
