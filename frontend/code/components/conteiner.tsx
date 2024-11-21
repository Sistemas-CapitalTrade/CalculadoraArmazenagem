
import { Fragment, useEffect, useState } from "react";
import Combobox  from "./form_field/combobox";
import { DatePicker } from "./form_field/datepicker";
import {  differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button"
import { MultipleSelector } from "./form_field/multiselect";
import { Conteiner, InputLabelForm }  from "@/data/types";

type props = {
    conteiner_input : Conteiner,
    conteiner_type : InputLabelForm[],
    servicosList : InputLabelForm[],
    periodos : any,
    copyConteiner : (conteiner : Conteiner) => void,
    refreshConteiners : (conteiner : Conteiner) => void,
    removeConteiner : (conteiner : Conteiner) => void
}
export default function ConteinerTAG({
    conteiner_input,
    conteiner_type,
    servicosList,
    periodos,
    copyConteiner,
    refreshConteiners,
    removeConteiner
} : props){



    const [conteiner,setConteiner] = useState<Conteiner>(conteiner_input)

    useEffect(() => {
        refreshConteiners(conteiner); // This will be executed when the state changes
    }, [conteiner]);
    

    function handleTipoConteiner (tipo_conteiner : any){
        
        setConteiner((prevConteiner) => {
            const updatedConteiner = { ...prevConteiner, tipo_conteiner };
            return updatedConteiner
            }
        )
    }

    function handleDataEntrada (entrada : Date){
        
        setConteiner((prevConteiner) => {
            const updatedConteiner = { ...prevConteiner, entrada, periodo : calcularPeriodo(entrada,prevConteiner.saida) };
            return updatedConteiner
            }
        )

    }
    
    function handleDataSaida (saida : Date){
        
        setConteiner((prevConteiner) => {
            const updatedConteiner = { ...prevConteiner, saida, periodo : calcularPeriodo(prevConteiner.entrada, saida) };
            return updatedConteiner
            }
        )

    }

    
    function updateServicos(servicos_conteiner : string[]){
        setConteiner((prevConteiner) => {
            const updatedConteiner = {...prevConteiner, servicos : servicos_conteiner}
            
            return updatedConteiner
            },
        )
        
    }
    
    function calcularPeriodo (entrada : Date | null, saida : Date | null){
        if(!(entrada && saida))
            return "Digite as datas"
        const dateDiff = differenceInDays(saida,entrada) + 1
        let periodo = ""
        if(dateDiff <= periodos.primeiro_periodo_dia && dateDiff > 0)
            periodo = "Primeiro Periodo"
        else if(dateDiff > periodos.primeiro_periodo_dia && dateDiff <= periodos.segundo_periodo_dia )
            periodo = "Segundo Periodo"
        else if(dateDiff > periodos.segundo_periodo_dia && dateDiff <= periodos.terceiro_periodo_dia)
            periodo = "Terceiro Periodo"
        else if(dateDiff > periodos.terceiro_periodo_dia && dateDiff <= periodos.quarto_periodo_dia)
            periodo = "Quarto Periodo"
        else 
            periodo = "Periodo inválido. Verificar datas"
        return periodo
    }


    return (
        <Fragment>
            <h1 className="font-inter my-auto font-semibold text-lg">{conteiner.sequence}</h1>  
            <div className="col-span-3 mt-2 font-inter font-light">
                <Combobox 
                initialValue={conteiner.tipo_conteiner} 
                selectValue={handleTipoConteiner} 
                error = {conteiner.tipo_conteiner_error}
                list={conteiner_type} 
                emptyField="Tipo de conteiner não selecionado" 
                placeholder=" " />
            </div>
            <div className="col-span-3 mt-2 font-inter font-light">
                <DatePicker 
                initialValue={conteiner.entrada}
                error={conteiner.entrada_error}
                selectValue={(valor) => {
                    handleDataEntrada(valor)
                }}/>
            </div>
            <div className="col-span-3 mt-2 font-inter font-light">
                <DatePicker 
                initialValue={conteiner.saida}
                error={conteiner.saida_error}
                selectValue={(valor) => {
                    handleDataSaida(valor)
                }}/>
            </div>
            <h1 className="flex text-sm rounded-md bg-white h-12 mt-2 w-full font-inter col-span-3 items-center font-light p-4 text-gray-400 justify-start">
               {conteiner.periodo}
            </h1>

            <Button
                variant="destructive"
                className="w-full h-12 mt-2 items-center justify-center"
                type="button"
                onClick={() => {
                    removeConteiner(conteiner)
                }}
            > X </Button>

            <h1 className="font-inter my-auto font-semibold text-lg">Serviços: </h1>

            <div className="p-0 col-span-12 h-24 bg-white mt-2 text-black w-full font-inter font-light rounded-md">
                
                <MultipleSelector inputList={conteiner.servicos} returnList={updateServicos} servicosList={servicosList}/>

            </div>

            
            <Button
                variant="default"
                className="hover:bg-green-600 w-full h-12 mt-2 bg-green-400 items-center justify-center"
                type="button"
                onClick={() => {
                    copyConteiner({...conteiner})
                }}
            > Copiar </Button>

        </Fragment>
    )
}