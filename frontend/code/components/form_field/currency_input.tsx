
import { forwardRef, Ref, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
type props = {
    returnValor : (cif : any) => void,
    initialValue? : number,
    error? : boolean,
    prefix? : string,
    decimalScale? : number,
    name : string,    
}
function CurrencyInput({
    returnValor,
    initialValue,
    error,
    prefix,
    decimalScale,
    name
} : props, ref: Ref<HTMLInputElement>){
    const [valor,setValor] = useState<number>()
    const handleLangChange = (valor : any) => {
        returnValor(valor)    
    }

    useEffect( () => {
        if(initialValue)
            setValor(initialValue)
    })

    return (
        <div className="">
            <label className="block text-lg font-inter font-light">{name}</label>
            <NumericFormat
            getInputRef={ref}
            className={`flex bg-white h-12 p-2 text-black w-full font-inter rounded-md font-light justify-end ${error ? 'border-2 border-rose-400' : ''}`}
            value={valor}
            thousandSeparator="."  // Brazilian format for thousands separator
            decimalSeparator=","
            prefix={prefix ? prefix : "R$ "}
            decimalScale={decimalScale ? decimalScale : 2}  // Always show two decimal places
            fixedDecimalScale={true}
            onValueChange={(valor : any) => {
                const { floatValue } = valor;
                handleLangChange(floatValue || 0);
            }}
            placeholder="R$ 0,00"
            displayType="input"
            type="text"
            />
          { error ? <span className="text-sm font-inter text-rose-400">Campo obrigatório</span> : null}
        </div>
    )
}
export default forwardRef(CurrencyInput)