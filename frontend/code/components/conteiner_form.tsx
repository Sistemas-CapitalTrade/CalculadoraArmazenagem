"use client";
import React, { useLayoutEffect, useRef, useState } from "react"
import InputForm from "./form_field/input_form";
import Combobox from "./form_field/combobox";
import CurrencyInput from "./form_field/currency_input";
import ConteinerTAG from "./conteiner";
import Checkbox from "./form_field/checkbox";
import { DefaultGetFetch, fetchInputForm } from "../data/model_fetch";
import { format } from "date-fns";
import { Conteiner,InputLabelForm } from "@/data/types";

  

export default function Form() {

  const [conteinerId, setConteinerId] = useState(0)
  const [sequence, setSequence] = useState(0)
  const [recinto, setRecinto] = useState<any>()
  const [tipo_mercadoria,setTipoMercadoria] = useState<string>  ()
  const [cod_ext,setCodExt] = useState<string>  ()
  const [CIF, setCIF] = useState()
  const [conteinerList,setConteinerList] = useState<Conteiner[]>([])
  const [custoObrigatorio, setCustoObrigatorio] = useState<InputLabelForm[]>([])
  const [custoObrigatorioMarcado, setCustoObrigatorioMarcado] = useState<InputLabelForm[]>([])
  const [custoConteiner, setCustoConteiner] = useState<InputLabelForm[]>([])
  const [recintoList,setRecintoList] = useState<InputLabelForm[]>([])
  const [tipoMercadoriaList, setTipoMercadoriaList] = useState<InputLabelForm[]>([])
  const [tipoConteinerList, setTipoConteinerList] = useState<InputLabelForm[]>([])
  const [periodosRecinto, setPeriodosRecinto] = useState<any>()
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const recintoRef = useRef<HTMLButtonElement>(null);
  const tipoMercadoriaRef = useRef<HTMLButtonElement>(null);
  const cifRef = useRef<HTMLInputElement>(null);
  const codExtRef = useRef<HTMLInputElement>(null);
  const [valorArmazenagem,setValorArmazenagem] = useState<number>(0)
  const [valorLevante,setValorLevante] = useState<number>(0)
  const [valorServicos,setValorServicos] = useState<number>(0)
  const [servicosCalculados,setServicosCalculados] = useState<{[key : string] : number}>({})
  const [valorEnergia,setValorEnergia] = useState<number>(0)
  const [valorTotal,setValorTotal] = useState<number>(0)

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const API_PORT = process.env.NEXT_PUBLIC_API_PORT

  const realFormatter = new Intl.NumberFormat("pt-BR", {
    style : "currency",
    currency : "BRL",
    maximumFractionDigits : 2,
    minimumFractionDigits : 2

  })

  useLayoutEffect( ()=> {
    fetchInputForm(`${API_URL}:${API_PORT}/recintos/name`)
    .then(list => {
      setRecintoList(() => list)
      }
    ) 
    .catch(err => {
      console.error("Problem with fetch recinto list", err)
      }
    )

    fetchInputForm(`${API_URL}:${API_PORT}/data/tipo/mercadoria`)
    .then(list => {
      setTipoMercadoriaList(() => list)
      }
    ) 
    .catch(err => {
      console.error("Problem with fetch merch type", err)
      }
    )

    
    fetchInputForm(`${API_URL}:${API_PORT}/data/tipo/conteiner`)
    .then(list => {
      setTipoConteinerList(() => list)
      }
    ) 
    .catch(err => {
      console.error("Problem with fetch conteiner type", err)
      }
    )

  },[])

  function addConteiner() {

    let newFormErrors: {[key: string]: boolean} = {};

    if(!recinto){
      newFormErrors = {...formErrors}
      newFormErrors.recinto = true
      setFormErrors(newFormErrors)
      return      
    } else {  
      setFormErrors(newFormErrors)
    }

    
    let currentId = conteinerId
    currentId++
    setConteinerId(currentId)
    let currentSequence = sequence
    currentSequence++
    setSequence(currentSequence)
    

    const conteiner : Conteiner = {
      id : currentId,
      sequence : currentSequence,
      tipo_conteiner : "",
      entrada : null,
      saida : null,
      periodo : "Digite as datas",
      servicos : []

    }
    setConteinerList((valor) => [...valor, conteiner])
  }

  
  function copyConteiner(copy_conteiner : Conteiner) {
    
    let currentId = conteinerId
    currentId++
    setConteinerId(currentId)
    let currentSequence = sequence
    currentSequence++
    setSequence(currentSequence)
    

    const conteiner : Conteiner = {
      id : currentId,
      sequence : currentSequence,
      tipo_conteiner : copy_conteiner.tipo_conteiner,
      entrada : copy_conteiner.entrada,
      saida : copy_conteiner.saida,
      periodo : copy_conteiner.periodo,
      servicos : copy_conteiner.servicos

    }

    setConteinerList(prevConteinerList => [...prevConteinerList, conteiner]); // Use functional form of setState
  }


  function refreshConteiners(refresh_conteiner : Conteiner) {
    setConteinerList(prevConteinerList => {
      const conteinerListCopy = [...prevConteinerList];
      const conteinerIndex = conteinerListCopy.findIndex(conteiner => conteiner.id === refresh_conteiner.id);
      
      if (conteinerIndex !== -1) {
        conteinerListCopy[conteinerIndex] = refresh_conteiner;
      }
  
      return conteinerListCopy;
    });
  }

  function removeConteiner(remove_conteiner : Conteiner) {
    setConteinerList((prevList) => {
      // Filter out the container to remove from the list
      const filteredList = prevList.filter(conteiner => conteiner.id !== remove_conteiner.id);
      
      // Update the sequence numbers for remaining containers
      const updatedList = filteredList.map((conteiner) => ({
        ...conteiner,
        sequence: conteiner.sequence > remove_conteiner.sequence ? conteiner.sequence - 1 : conteiner.sequence // Update sequence based on the new index
      }));

      const newSequence = sequence - 1

      setSequence(newSequence)

      return updatedList
    })
  }

  function updateCustosObrigatorios(input : InputLabelForm, check : boolean){


    if (check) {
        
      setCustoObrigatorioMarcado((prevValue) => {
        prevValue.splice(prevValue.indexOf(input), 1);
        const newValue = prevValue.filter((item) => item !== input)
        return newValue
        }
      );
    } else {
         
      setCustoObrigatorioMarcado(prevValue =>{
          const newValue = [...prevValue, input]
          return newValue
          
        } );
    }
    
  }

  function handleRecintoSelection(valor:any) {
    setRecinto(() => valor)

    if(valor == ''){
      setConteinerList([])
      setPeriodosRecinto({})
      setCustoConteiner([])
      setCustoObrigatorio(() => [])
      setCustoObrigatorioMarcado(() => [])
      return 
    }

    setConteinerList([])
    DefaultGetFetch(`${API_URL}:${API_PORT}/recintos/${valor}/periodo`)
    .then(object => {
      setPeriodosRecinto(() => object.armazem)
      }
    )  
    .catch(err => {
      console.error("Problem with fetch recinto periodo", err)
      }
    )
    
    fetchInputForm(`${API_URL}:${API_PORT}/recintos/${valor}/custosConteiner`)
      .then(list => {
        setCustoConteiner(() => list)
      }
    )  
    .catch(err => {
      console.error("Problem with fetch recinto custo conteiner", err)
      }
    )
    
    fetchInputForm(`${API_URL}:${API_PORT}/recintos/${valor}/custosObrigatorios`)
      .then(list => {
        setCustoObrigatorio(() => [...list])
        setCustoObrigatorioMarcado(() => [...list])
      }
    )  
    .catch(err => {
      console.error("Problem with fetch recinto custo obrigatorio", err)
      }
    )
    
  }

  const getCIF = (cif : any) => {
    setCIF(cif)
  }
  
  function handleSubmit () {
    const newFormErrors: {[key: string]: boolean} = {};

    // Check required fields
    if (!recinto) newFormErrors.recinto = true;
    if (!cod_ext) newFormErrors.cod_ext = true;
    if (!tipo_mercadoria) newFormErrors.tipo_mercadoria = true;
    if (!CIF) newFormErrors.CIF = true;

    const conteinerListCopy = [...conteinerList]

    if(conteinerListCopy.length == 0){
      newFormErrors.conteinerList = true;
    } else{
      conteinerListCopy.forEach( conteiner => {
        conteiner.entrada_error = !conteiner.entrada 
        conteiner.saida_error = !conteiner.saida
        conteiner.tipo_conteiner_error = !conteiner.tipo_conteiner
      })
    }


    setFormErrors(newFormErrors);
    setConteinerList(conteinerListCopy)
    console.log(newFormErrors)
    if (Object.keys(newFormErrors).length !== 0 || conteinerListCopy.length == 0 || conteinerListCopy.filter(conteiner => conteiner.entrada_error || conteiner.saida_error || conteiner.tipo_conteiner_error).length != 0) {

      return
    }
      
    const conteinerSendData = conteinerListCopy.map(conteiner => (
      {
        id : conteiner.id,
        sequence : conteiner.sequence,
        tipo : conteiner.tipo_conteiner,
        saida : format((conteiner as any).saida, 'dd/MM/yyyy'),
        entrada : format((conteiner as any).entrada, 'dd/MM/yyyy'),
        servicos : conteiner.servicos
      }
    )
    )


      // Prepare the data to be sent
      const dataToSend = {
        recinto : recinto,
        ref_ext : cod_ext,
        tipo_mercadoria : tipo_mercadoria,
        cif : CIF,
        custos_obrigatorios : custoObrigatorioMarcado.map(value => value.id),
        conteineres : conteinerSendData
    };


    // Send the data to the backend
    fetch(`${API_URL}:${API_PORT}/calc`, {
        method: 'POST',
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
    .then(data => {
        console.log('Success:', data);

        const calcServicos = data.valorServicos

        const valorServicosTotal : number = Number(Object.values(calcServicos).reduce((current, sum) => Number(current) + Number(sum), 0)) 

        setValorArmazenagem(data.valorArmazenagem)
        setValorLevante(data.valorLevante)
        setServicosCalculados(calcServicos)
        setValorServicos(valorServicosTotal)
        setValorEnergia(data.valorEnergia)
        setValorTotal(data.valorEnergia + valorServicosTotal + data.valorLevante + data.valorArmazenagem)
    })
    .catch(error => {
      console.error('Error:', error.message);

        // Handle error (e.g., show an error message)
    });
  };

  function getCodExt(valor : string) {
    setCodExt( () => valor)
  }

  return (
    <form id="form_calc" action={''} method="post" className="w-full">
        <div className="flex justify-between">
          <div className="grid gap-4 h-min w-3/5 grid-cols-2 mt-12">
            <div className="col-span-2">

              <label htmlFor="recinto" className="block text-lg font-inter font-light">Recinto</label>
              <Combobox ref={recintoRef} error={formErrors.recinto} selectValue={handleRecintoSelection} list={recintoList} emptyField="Nenhum recinto selecionado" placeholder="Selecione um recinto"></Combobox>
              
            </div>
            <InputForm ref={codExtRef} error={formErrors.cod_ext} selectValue={getCodExt} field = "cod_ext" name = "Referência Externa"/>
            
            <CurrencyInput ref={cifRef} error={formErrors.CIF} returnValorCIF={getCIF}/>  
            
            <div className="col-span-2">

              <label htmlFor="tipo_mercadoria" className="block text-lg font-inter font-light">Tipo de mercadoria</label>
              
              <Combobox ref={tipoMercadoriaRef} error={formErrors.tipo_mercadoria} selectValue={setTipoMercadoria} list={tipoMercadoriaList} emptyField="Nenhum tipo de mercadoria selecionado" placeholder="Selecione um tipo de mercadoria"></Combobox>
              
            </div>
          </div>

          <div className="relative h-92 p-4 w-2/6 mt-12 mx-auto bg-gray-900 bg-opacity-60 rounded-2xl">
          
            <h1 className="font-semibold font-inter text-lg w-min mx-auto">Simulação</h1>
            
            <h2 className="font-inter mt-4 font-regular text-md">Serviços extras: <span id="services" className="font-semibold">{realFormatter.format(valorServicos)}</span></h2>
            {
              Object.entries(servicosCalculados).map(([keyServico,valueServico])  =>            
                <h2 key={keyServico} className="ml-2 font-inter mt-4 font-regular text-md">{keyServico}: <span id="services" className="font-semibold">{realFormatter.format(valueServico)}</span></h2>
              )
            }
            <h2 className="font-inter mt-2 font-regular text-md">Levante: <span id="levante" className="font-semibold">{realFormatter.format(valorLevante)}</span></h2>
            <h2 className="font-inter mt-2 font-regular text-md">Armazenagem: <span id="armazenagem" className="font-semibold">{realFormatter.format(valorArmazenagem)}</span></h2>
            {
            valorEnergia > 0 
            ? <h2 id="energia"className="font-inter mt-2 font-regular text-md">Energia: <span id="energia_valor" className="font-semibold">{realFormatter.format(valorEnergia)}</span></h2> 
            : null}
            <h2 className="relative mt-10 font-inter  font-regular text-md">Total de Custos: <span id="total_custos" className="font-semibold">{realFormatter.format(valorTotal)}</span></h2>


          </div>
        </div>

        <h1 className="font-inter text-xl mt-12 mx-auto w-min text-nowrap font-bold">Custos adicionais</h1>

        <div id="custos_adicionais" className="grid w-full grid-cols-1 xl:grid-cols-3 mx-auto mt-12 gap-8 items-center">
          {custoObrigatorio.map(custo => {
              return <Checkbox key = {custo.id} input={custo} returnValue={updateCustosObrigatorios}></Checkbox>
          })}
        </div>
        <div className="flex mt-12 justify-between items-center mx-auto">

          <h1 className="w-min font-inter font-bold text-2xl">Conteineres</h1>
          
          <button type="button" onClick={() => addConteiner()} className="text-white relative text-2xl text-center p-0 h-8 w-8 border-2 border-white rounded-xl"><span className="relative text-center mb-4 p-0" >+</span></button>
        
        </div>

        {formErrors.conteinerList ? <span className="text-rose-400">É necessário incluir conteineres</span> : null}

        <div id="conteiners_form" className="grid gap-x-10 gap-y-4 mt-12 grid-cols-14 w-full font-inter font-semibold text-lg">

          <h1 className="">Seq</h1>
          <h1 className="col-span-3">Tipo Conteiner</h1>
          <h1 className="col-span-3">Entrada</h1>
          <h1 className="col-span-3">Saida</h1>
          <h1 className="col-span-4">Período</h1>
          
          
          {conteinerList.map(conteiner => {
            return <ConteinerTAG key={conteiner.id} conteiner_input={conteiner} conteiner_type={tipoConteinerList} periodos={periodosRecinto} servicosList={custoConteiner} removeConteiner={removeConteiner} copyConteiner={copyConteiner} refreshConteiners={refreshConteiners}></ConteinerTAG>
          })} 

        </div>

        <div className="mt-24 flex w-full">
          {/* <input type="submit" className=" bg-orange-700 bg-opacity-80 hover:bg-opacity-60 transition-opacity rounded-xl text-white text-lg py-3 px-6" value="Simular"/> */}
          <input type="button" onClick={handleSubmit} className=" bg-orange-700 bg-opacity-80 hover:bg-opacity-60 transition-opacity rounded-xl text-white text-lg py-3 px-6" value="Simular"/>
        </div>

      <input type="hidden" name="conteiners_qtd" id="conteiners_qtd" value="{{countConteiners}}"/>
    </form>

  );
}