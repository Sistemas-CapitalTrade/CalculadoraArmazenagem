import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Servico } from "@/data/types"


type props = {
    input_servico : Servico,
    index : number,
    error? : boolean,
    selectValue : (valor : Servico, index : number) => void,
    removeServico : ( index : number) => void
}
function ServicoInput({
    input_servico,
    index,
    error,
    selectValue,
    removeServico
} : props){

    const [servico,setServico] = useState<Servico>(input_servico)

    // Update the local state when input_servico changes
    useEffect(() => {
        setServico(input_servico);
    }, [input_servico]); // Add input_servico as a dependency


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, tag : string) => {
        const newServico = {...servico, [tag] : event.target.value} 

        setServico(newServico)
        selectValue(newServico, index); // Call selectValue with the current input value
    };

    function toggleObrigatorio(){
        const newServico = {...servico, obrigatorio : !servico.obrigatorio} 
        console.log(newServico)
        
        setServico(newServico)

        selectValue(newServico, index); // Call selectValue with the current input value

    }
    return (
        <div className="mt-2">
            <div className={`grid ${!servico.hasOwnProperty("obrigatorio") ? "grid-cols-4" : "grid-cols-5"} gap-4 mt-2 h-12 text-black w-full font-inter rounded-md font-semibold ${error ? 'border-2 border-rose-400' : ''} ` }>
                <input 
                    type="text" 
                    name={servico.id} 
                    id={servico.id}
                    value={servico.id}
                    onChange={(e) => handleChange(e,"id")}
                    className="w-full h-12 rounded-md font-light outline-none pl-4"/>

                <input 
                    type="text" 
                    name={servico.nome} 
                    id={servico.nome}
                    value={servico.nome}
                    onChange={(e) => handleChange(e,"nome")}
                    className="w-full h-12 rounded-md font-light outline-none pl-4"/>
                    
                <input 
                    type="text" 
                    name={servico.valor} 
                    id={servico.valor}
                    value={servico.valor}
                    onChange={(e) => handleChange(e,"valor")}
                    className={`w-full h-12 rounded-md font-light outline-none pl-4`}/>
                    
                {servico.hasOwnProperty("obrigatorio") ?
                    <div className="relative h-12">
                        <input
                            type="checkbox"
                            id={`pretty-checkbox-${servico.id}`}
                            className="peer sr-only"
                            checked={servico.obrigatorio}
                            onChange={() => {
                            toggleObrigatorio()
                    }}
                        />
                        <label
                            htmlFor={`pretty-checkbox-${servico.id}`}
                            className="flex h-6 w-6 mx-auto mt-2 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all duration-300 ease-in-out peer-checked:border-orange-600 peer-checked:bg-orange-500 peer-focus:ring-2 peer-focus:ring-orange-600 peer-focus:ring-offset-2 cursor-pointer"
                        >
                            <svg
                            className={`h-3 w-3 text-white transition-transform duration-300 ease-in-out ${
                                servico.obrigatorio ? "scale-100" : "scale-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M5 13l4 4L19 7"
                            />
                            </svg>
                        </label>
                    </div>
                    : null
                    }
                <Button
                    variant={"destructive"}
                    type="button"
                    className="w-full h-12 items-center justify-center"
                    onClick={() => removeServico(index)}
                > X </Button>
            </div>
            { error ? <span className="text-sm font-inter text-rose-400">Campo obrigatório</span> : null}
        </div>
    )
}

export default ServicoInput