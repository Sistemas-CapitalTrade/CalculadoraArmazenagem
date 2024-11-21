'use client'

import React, { useLayoutEffect, useState } from "react"
import { DefaultGetFetch, fetchInputForm } from "../data/model_fetch";
import Combobox from "./form_field/combobox";
import { InputLabelForm,Panel,Periodos,RecintoInfoType, TarifasEstrutura, MercadoriasTaxas,MercadoriasTaxasEstrutura, ContainerTypesLevante, PeriodoEstrutura, TarifasCompositionArmazem, TarifasCompositionEnergia, TaxaNegociada, TaxasNegociadasEstrutura } from "@/data/types";
import { Button } from "./ui/button";
import InputForm from "./form_field/input_form";
import SidePanel from "./side_bar/side_panel";
import { ConfigRenderer } from "./config_page/config_page_renderer";

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_PORT = process.env.NEXT_PUBLIC_API_PORT


const defaultPeriodos : Periodos = {
    primeiro_periodo_dia : 0,
    segundo_periodo_dia : 0,
    terceiro_periodo_dia : 0,
    quarto_periodo_dia : 0,
}
const defaultPeriodosNegociacao : Periodos = {
    primeiro_periodo_dia : null,
    segundo_periodo_dia : null,
    terceiro_periodo_dia : null,
    quarto_periodo_dia : null,
}

const defaultPeriodosEstruturaNegociacao : PeriodoEstrutura = {
    energia : defaultPeriodosNegociacao,
    armazem : defaultPeriodosNegociacao    
}

const defaultPeriodoEstrutura : PeriodoEstrutura = {
    energia : defaultPeriodos,
    armazem : defaultPeriodos    
}

const defaultTarifasCompositionArmazem : TarifasCompositionArmazem = {

    primeiro_periodo_minima: 0,
    primeiro_periodo: 0,
    segundo_periodo_minima: 0,
    segundo_periodo: 0,
    terceiro_periodo_minima: 0,
    terceiro_periodo: 0,
    quarto_periodo_minima: 0,
    quarto_periodo: 0

}

const defaultTarifasCompositionEnergia : TarifasCompositionEnergia = {

    primeiro_periodo: 0,
    segundo_periodo: 0,
    terceiro_periodo: 0,
    quarto_periodo: 0

}
const defaultTarifasCompositionArmazemNegociacao : TarifasCompositionArmazem = {

    primeiro_periodo_minima: null,
    primeiro_periodo: null,
    segundo_periodo_minima: null,
    segundo_periodo: null,
    terceiro_periodo_minima: null,
    terceiro_periodo: null,
    quarto_periodo_minima: null,
    quarto_periodo: null

}

const defaultTarifasCompositionEnergiaNegociacao : TarifasCompositionEnergia = {

    primeiro_periodo: null,
    segundo_periodo: null,
    terceiro_periodo: null,
    quarto_periodo: null

}

const defaultTarifasEstrutura : TarifasEstrutura = {
    armazem : defaultTarifasCompositionArmazem,
    energia : defaultTarifasCompositionEnergia
}


const defaultTarifasEstruturaNegociacao : TarifasEstrutura = {
    armazem : defaultTarifasCompositionArmazemNegociacao,
    energia : defaultTarifasCompositionEnergiaNegociacao
}

const defaultTaxaNegociada : TaxaNegociada = {
    levante : null,
    armazem : null,
    custos_adicionais_conteiner : []
}

const defaultTaxaNegociadaEstrutura : TaxasNegociadasEstrutura = {
    tarifas : defaultTarifasEstruturaNegociacao,
    periodos : defaultPeriodosEstruturaNegociacao,
    Normal : defaultTaxaNegociada,
    IMO : defaultTaxaNegociada,
    Oversize : defaultTaxaNegociada,
    "Oversize IMO" : defaultTaxaNegociada,
    Reefer : defaultTaxaNegociada
}

const defaultMercadoriasTaxas : MercadoriasTaxas = {
    Normal : 0,
    IMO : 0,
    Oversize : 0,
    "Oversize IMO" : 0,
    Reefer : 0
}

const defaultMercadoriasTaxasEstrutura : MercadoriasTaxasEstrutura = {
    levante : defaultMercadoriasTaxas,
    armazem : defaultMercadoriasTaxas,
    custos_adicionais_conteiner : defaultMercadoriasTaxas
}

const defaultConteiners : ContainerTypesLevante = {
    Normal : 0,
    "Carga Solta" : 0,
    "Flat Rack" : 0,
    "Open Top" : 0
}

export default function Config() {
    const [recinto,setRecinto] = useState<string>("")
    const [recintoList,setRecintoList] = useState<InputLabelForm[]>([])
    const [tipoMercadoriaList,setTipoMercadoriaList] = useState<string[]>([])
    const [tipoConteinerList,setTipoConteinerList] = useState<string[]>([])
    const [insertMode,setInsertMode] = useState<boolean>(false)
    const [panel,setPanel] = useState<Panel | null>()
    const [recintoInfo,setRecintoInfo] = useState<RecintoInfoType>({
        taxa_padrao : defaultMercadoriasTaxasEstrutura,
        taxas_negociadas : defaultTaxaNegociadaEstrutura,
        periodos : defaultPeriodoEstrutura,
        tarifas : defaultTarifasEstrutura,
        custos_adicionais_conteiner : [], 
        levante : defaultConteiners
    })

    const[recintoError, setRecintoError] = useState<boolean>(false)

    const Panels : Panel[] = [
        {
            label : "Periodos",
            id : "periodos"
        },
        {
            label : "Taxa",
            id : "taxa"
        },
        {
            label : "Tarifas",
            id : "tarifas"
        },
        {
            label : "Servicos",
            id : "servicos"
        },
        {
            label : "Levante",
            id : "levante"
        },
        {
            label : "Negociação",
            id : "negociacao"
        }

    ]

    useLayoutEffect( () => {
        fetchInputForm(`${API_URL}:${API_PORT}/recintos/infos`)
        .then((list : any) => {
            setRecintoList(() => list)
            }
        ) 
        .catch(err => {
            console.error("Problem with fetch recinto list", err)
            }
        )
        
        DefaultGetFetch(`${API_URL}:${API_PORT}/data/tipo/conteiner`)
        .then((list : any) => {
            if(list)
                setTipoConteinerList(() => list)
            }
        ) 

        
        DefaultGetFetch(`${API_URL}:${API_PORT}/data/tipo/mercadoria`)
        .then((list : any) => {
            if(list)
                setTipoMercadoriaList(() => list)
            }
        ) 

    },[])

    function handleRecintoSelection(recinto_selected : string){
        setRecinto(recinto_selected)

        if(!insertMode)
            DefaultGetFetch(`${API_URL}:${API_PORT}/recinto/${recinto_selected}/info`)
            .then( (data : RecintoInfoType) => {
                setRecintoInfo(data)
                console.log(data)
            })
    }

    function handlePanelSelection(page : Panel | null) {
        setPanel(page)
    }

    function deleteRecinto(){
        if(recinto == ""){
            setRecintoError(true)
            return
        }
        setRecintoError(false)
        const confirmation = confirm("Você deseja excluir esse recinto?")
        if(confirmation){

            const queryParams = new URLSearchParams({nome : recinto})
            fetch(`${API_URL}:${API_PORT}/recinto?${queryParams}`,{
                method :"DELETE"
            })
            .then(response => {
                if (!response.ok) {
                  return response.json().then(errData => {
                    throw new Error(errData.error || 'Unknown error occurred');
                });
                }
                return response.json();
            })
            .then(()=>{
                setRecintoList((oldList) => {
                    const newlist = [...oldList].filter(item => item.id != recinto)
                    return newlist
                })
                alert("Deletado com sucesso")
                }
            )
            .catch( ()=> {
                alert("Erro ao deletar")
            })
            
        }
    }
    
    function handleReturnedValue (return_value : any){
        const newRecintoInfo = {...recintoInfo,...return_value}
        setRecintoInfo(newRecintoInfo)
        console.log(newRecintoInfo)
    }

    function submitRecinto() {
        if(!recinto){
            window.alert("Digite o nome do recinto")
            return
        }
        const dataToSend = {
            [recinto] : recintoInfo
        }

        fetch(`${API_URL}:${API_PORT}/recinto`,{
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
              return response.json().then(errData => {
                throw new Error(errData.error || 'Unknown error occurred');
            });
            }
            return response.json();
          })
          .then((data : RecintoInfoType) => {
              console.log('Success:', data);
              setRecintoList( (oldList) => {
                const newRecintoInputLabelForm : InputLabelForm = {
                    id : recinto,
                    label : recinto
                }
                return [...oldList,newRecintoInputLabelForm]
              })

              window.alert("Recinto adicionado com sucesso")
          })
          .catch(error => {
            console.error('Error:', error.message);
    
              // Handle error (e.g., show an error message)
          });
    }

    return (    
    <form className="mt-12" action="">
        <div className="flex justify-between">
            
            <div className="w-2/5 mt-2">
                {!insertMode ?  
                    <Combobox error={recintoError} selectValue={handleRecintoSelection} list={recintoList} emptyField="Nenhum recinto selecionado" placeholder="Selecione um recinto"></Combobox> 
                    :
                    <InputForm selectValue={handleRecintoSelection} field = "recinto" name = "Digite o nome do recinto"/>
                }
                    
            </div>
            
            {!insertMode ?
                <div className="flex w-2/5 justify-between">
                    <Button
                        variant="default"
                        className="hover:bg-green-600 w-2/5 h-12 mt-2 bg-green-400 items-center justify-center"
                        type="button"
                        onClick={() => {
                            setInsertMode(!insertMode)
                        }}
                    > {"Inserir um recinto"} </Button>
                    <Button
                        variant="destructive"
                        className="hover:bg-red-700 w-2/5 h-12 mt-2 bg-rose-600 items-center justify-center"
                        type="button"
                        onClick={() => {
                            deleteRecinto()
                        }}
                    > {"Remover recinto"} </Button>
                </div>
        
            :
            <Button
                variant="default"
                className="hover:bg-green-600 w-2/5 h-12 mt-2 bg-green-400 items-center justify-center"
                type="button"
                onClick={() => {
                    setInsertMode(!insertMode)
                }}
            > {"Alterar um recinto"} </Button>
            }
        
        </div>
            <div className="flex mt-24 justify-between">
                <SidePanel 
                    panels={Panels} 
                    selectedPanel={handlePanelSelection}>
                    
                </SidePanel>
                <div className="w-full">

                  <ConfigRenderer recintoInfo={recintoInfo} tipoConteiner={tipoConteinerList} tipoMercadoria={tipoMercadoriaList} selectValue={handleReturnedValue} selectedPanel={panel}/>

                </div>
            </div>
                <div className="mx-auto w-min">
                    <Button
                        variant="default"
                        className="hover:bg-green-600 font-inter font-semibold w-52 h-12 mx-auto mt-24 bg-green-400 items-center justify-center"
                        type="button"
                        onClick={() => {
                            submitRecinto()
                        }}
                    >{insertMode ? "Cadastrar Recinto" : "Atualizar Recinto"} </Button>
                </div>
    </form>
    );
}