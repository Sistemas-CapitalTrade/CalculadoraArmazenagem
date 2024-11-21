
import { forwardRef, Ref, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
type props = {
    returnValorCIF : (cif : any) => void,
    initialValue? : number,
    error? : boolean
}
function CurrencyInput({
    returnValorCIF,
    initialValue,
    error
} : props, ref: Ref<HTMLInputElement>){
    const [CIF,setCIF] = useState<number>()
    const handleLangChange = (cif : any) => {
        returnValorCIF(cif)    
    }

    useEffect( () => {
        if(initialValue)
            setCIF(initialValue)
    })

    return (
        <div className="">
            <label className="block text-lg font-inter font-light">CIF</label>
            <NumericFormat
            getInputRef={ref}
            className={`flex bg-white mt-2 h-12 p-2 text-black w-full font-inter rounded-md font-light justify-end ${error ? 'border-2 border-rose-400' : ''}`}
            value={CIF}
            thousandSeparator="."  // Brazilian format for thousands separator
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}  // Always show two decimal places
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