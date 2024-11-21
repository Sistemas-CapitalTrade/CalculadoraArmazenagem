import { useState } from "react"
import { KeyValuePair } from "@/data/types";
import { NumberFormatValues, NumericFormat } from "react-number-format";

type KeyValueProps = {
    input_key : string,
    label : string,
    input_value : any,
    selectValue : (input_value : KeyValuePair) => void,
    isPercentage? : boolean
}


export function FieldKeyValuePair({
    input_key,
    label,
    input_value,
    selectValue,
    isPercentage
} : KeyValueProps){

    const [value, setValue] = useState<KeyValuePair>(
        {
            key : input_key,
            label : label,
            value : input_value,
            isPorcentage : isPercentage
         }
    )

    // function handleChange(input_value_number : string){
    //     console.log(input_value)
    //     const newValue : KeyValuePair = {
    //         key : input_key,
    //         label : label,
    //         value : Number(String(input_value_number).replace(",",".")),
    //         isPorcentage : isPercentage
    //     }

    //     setValue( ()=> newValue)
    //     selectValue(newValue)

    // }

    function handleChangeNumberPorcentage(input_value_number : NumberFormatValues){
        const valueInput : number = input_value_number.floatValue ? Number((input_value_number.floatValue / 100).toFixed(4)) : 0

        const newValue : KeyValuePair = {
            key : input_key,
            label : label,
            value : valueInput ,
            isPorcentage : isPercentage
        }
        console.log(newValue)
        setValue( ()=> newValue)
        selectValue(newValue)

    }

    
    function handleChangeNumber(input_value_number : NumberFormatValues){
        const valueInput : number = input_value_number.floatValue ? Number(input_value_number.floatValue.toFixed(2)) : 0 

        const newValue : KeyValuePair = {
            key : input_key,
            label : label,
            value : valueInput,
            isPorcentage : isPercentage
        }
        console.log(newValue)
        setValue( ()=> newValue)
        selectValue(newValue)

    }


    return(
        <div className="flex items-center justify-between">
            <h1 className="font-semibold h-min items-center text-center text-md">{label}</h1>
            
            {
                isPercentage 
                ?

                    <NumericFormat
                    suffix={'%'}
                    type="text"
                    decimalSeparator=","
                    decimalScale={2}
                    className="w-1/5 h-12 rounded-sm text-center text-gray-800 bg-gray-100 font-light outline-none"
                    value={value.value * 100}
                    onValueChange={(e : NumberFormatValues) => {
                        handleChangeNumberPorcentage(e)
                    }}
                    
                ></NumericFormat>
                :

                    <NumericFormat
                    type="text"
                    decimalSeparator=","
                    className="w-1/5 h-12 rounded-sm text-center text-gray-800 bg-gray-100 font-light outline-none"
                    value={value.value}
                    onValueChange={(e : NumberFormatValues) => {
                        handleChangeNumber(e)
                    }}
                    
                ></NumericFormat>
            }
        </div>
    )
}