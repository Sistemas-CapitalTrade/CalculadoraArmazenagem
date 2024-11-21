import { useState } from "react"
import { KeyValuePair } from "@/data/types";
import { NumericFormat } from "react-number-format";

type KeyValueProps = {
    input_key : string,
    label : string,
    input_value : any,
    selectValue : (input_value : KeyValuePair) => void,
}


export function FieldKeyValuePair({
    input_key,
    label,
    input_value,
    selectValue,
} : KeyValueProps){

    const [value, setValue] = useState<KeyValuePair>(
        {
            key : input_key,
            label : label,
            value : input_value
         }
    )

    function handleChange(input_value : string){
        const newValue : KeyValuePair = {
            key : input_key,
            label : label,
            value : input_value
        }

        setValue( ()=> newValue)
        selectValue(newValue)

    }


    return(
        <div className="flex items-center justify-between">
            <h1 className="font-semibold h-min items-center text-center text-md">{label}</h1>
            
            <NumericFormat
                type="text"
                decimalSeparator=","
                className="w-1/5 h-12 rounded-sm text-center text-gray-800 bg-gray-100 font-light outline-none"
                value={value.value}
                onChange={(e : any) => {
                    handleChange(e.target.value)
                }}
                
            ></NumericFormat>
        </div>
    )
}