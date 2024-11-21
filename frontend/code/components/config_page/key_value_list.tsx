import {  useState } from "react"
import { KeyValuePair } from "@/data/types";
import { FieldKeyValuePair } from "./key_value_pair"

type KeyValueProps = {
    input_key : string,
    keyValueList : KeyValuePair[],
    selectValue : (input_value : any) => void,
}



export function FiledListKeyValue({
    input_key,
    keyValueList,
    selectValue,
} : KeyValueProps){

    

    const [list, setList] = useState<KeyValuePair[]>(keyValueList)

    
    //  useEffect( () => {
   
    //      const updatedList = list
    //      selectValue( {
    //          [input_key] : updatedList.reduce((acc : any, item) => {
    //              const value_number = Number(String(item.value).replace(",","."))
    //              acc[item.key] = isNaN(value_number) ? item.value : value_number;
    //              return acc;
    //          }, {})
    //      })
    //  },[])

    function handleChange(input_value : KeyValuePair){

        const newList = [...list]

        console.log(input_value)

        const updatedList = newList.map( input => 
            input.key == input_value.key ? {...input, value : input_value.value} : input)
            
        setList( ()=> updatedList)
        selectValue( {
            [input_key] : updatedList.reduce((acc : any, item) => {
                
                acc[item.key] = item.value;
                return acc;
            }, {})
        })

    }


    return(
        keyValueList.map( valor => {
            return <FieldKeyValuePair
                key={valor.key}
                input_key={valor.key}
                label = {valor.label}
                input_value = {valor.value}
                selectValue={handleChange}
                isPercentage={valor.isPorcentage}
                
            ></FieldKeyValuePair>
        })
    )
}