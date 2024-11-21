import { Button } from "@/components/ui/button";
import Servico_input from "../servico_input";
import { Servico } from "@/data/types";
import React, { useEffect, useState } from "react"

type ServicosPageProps = {
    returnedValue: (return_value : any) => void
    noNeedObrigatorio? : boolean
    currentValues : Servico[]
    tipo_mercadoria? : string
    input_key : string
  };
export default function ServicosPage({
    returnedValue,
    noNeedObrigatorio,
    currentValues,
    tipo_mercadoria,
    input_key
} : ServicosPageProps) {

    const [servicos,setServicos] = useState<Servico[]>(currentValues)


    function AddServico(){
        const newServico : Servico = {
            id : "",
            nome : "",
            valor : "",
            obrigatorio : false
        }
        if(noNeedObrigatorio){
            delete newServico.obrigatorio
        }

        setServicos( (prevList) => {
            return [...prevList,newServico]
        })

    }

    function refreshServicos(servico_input : Servico, index : number){
        setServicos( (oldServicos) => {
            const newServicos = [...oldServicos]

            newServicos[index] = servico_input
            
            return newServicos
        })

    }

    function removeServico(index : number){
        setServicos((oldServicos) => {
            // Filter out the service to be removed
            const newServicos = [...oldServicos].filter((_, i) => i !== index);
            
            return newServicos
        });
    }

    useEffect( () => {
        const newServicos : Servico[] = [...servicos]
        const returnValue = {
            [input_key] : newServicos.map(servico => {
                const valorNumber = Number(String(servico.valor).replace(",","."))

                return {...servico, valor : isNaN(valorNumber) ? servico.valor : valorNumber }
            })
        }
        returnedValue(tipo_mercadoria ?  {[tipo_mercadoria] : returnValue} : returnValue )
    },[servicos])
    return (    
        <div className="font-inter w-full p-10 overflow-scroll text-white">
            <div className="w-full flex items-center justify-between">
                <h1 className="font-semibold text-xl text-center h-min w-min">Serviços</h1>
                
                <Button
                    variant="default"
                    className="hover:bg-green-600 w-1/5 h-12 bg-green-400 items-center justify-center"
                    type="button"
                    onClick={() => {
                        AddServico()
                    }}
                >Adicionar Servico </Button>
            </div>
                
            <div className={`mt-12 grid ${noNeedObrigatorio ? "grid-cols-4" : "grid-cols-5"} gap-4 mx-auto`}>
                <h1 className="font-semibold text-center">ID</h1>
                <h1 className="font-semibold text-center">Nome</h1>
                <h1 className="font-semibold text-center">Valor</h1>
                {noNeedObrigatorio ? null : <h1 className="font-semibold text-center">Obrigatório</h1>}
                <h1 className="font-semibold text-center"></h1>
            </div>

            {servicos.map( (servico,index) => {
                return <Servico_input key={index} index = {index} input_servico={servico} selectValue={refreshServicos} removeServico={removeServico}/>
            })}
        </div>
    );
}
