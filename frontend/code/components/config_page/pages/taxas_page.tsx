import React, { useEffect, useState } from "react"
import { MercadoriasTaxas, MercadoriasTaxasEstrutura } from "@/data/types";
import InputTaxa from "../taxa_input"

type TaxasPageProps = {
    returnedValue: (return_value : any) => void
    tipoMercadoria : string[],
    currentValues : MercadoriasTaxasEstrutura
  };
export default function TaxasPage({
    returnedValue,
    tipoMercadoria,
    currentValues
} : TaxasPageProps) {

    const [taxaEstrutura,setTaxaEstrutura] = useState<MercadoriasTaxasEstrutura>(currentValues)
    
    function handleKeyValueListChange(return_value : MercadoriasTaxas, key : string) {
        setTaxaEstrutura( (oldTaxas) => {
            const newTaxa = {...oldTaxas, [key] : return_value}
            return newTaxa
        })
    }

    useEffect( ()=> {
        returnedValue({taxa_padrao : taxaEstrutura})
    },[taxaEstrutura])


    return (
        <div className="font-inter flex justify-between p-4 items-center text-white">
            <div className="grid grid-rows-6 h-full gap-4 mt-2 w-32">
                <div />
                {tipoMercadoria.map((item) => 
                    <div key={item} className="relative h-12 ">
                        <h1 className="absolute bottom-0 text-nowrap font-inter w-min h-min font-semibold text-white text-lg">{item}</h1>
                    </div>)}
            </div>
            <InputTaxa key={"armazem"} input_taxa={taxaEstrutura.armazem} input_key={"armazem"} label="Armazenagem" selectValue={handleKeyValueListChange}></InputTaxa>                    
   
            <InputTaxa key={"levante"} input_taxa={taxaEstrutura.levante} input_key={"levante"} label="Levante" selectValue={handleKeyValueListChange}></InputTaxa>                    
   
            <InputTaxa key={"custos_adicionais_conteiner"} input_taxa={taxaEstrutura.custos_adicionais_conteiner} input_key={"custos_adicionais_conteiner"} label="Servicos" selectValue={handleKeyValueListChange}></InputTaxa>                    
   
        </div>
    );
}
