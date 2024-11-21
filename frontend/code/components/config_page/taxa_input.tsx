import { useEffect, useState } from "react"
import { MercadoriasTaxas } from "@/data/types"
import { NumericFormat } from "react-number-format"


type props = {
    input_taxa : MercadoriasTaxas,
    input_key : string,
    label : string,
    selectValue : (valor : MercadoriasTaxas, key : string) => void
}
function TaxaInput({
    input_taxa,
    input_key,
    label,
    selectValue
} : props){

    const [taxa,setTaxa] = useState<MercadoriasTaxas>(input_taxa)

    // Update the local state when input_servico changes
    useEffect(() => {
        setTaxa(input_taxa);
    }, [input_taxa]); // Add input_servico as a dependency


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, tag : string) => {
        const valorTaxa = Number(event.target.value.replaceAll(",","."))
        const newTaxa = {...taxa, [tag] : isNaN(valorTaxa) ? event.target.value : valorTaxa } 

        setTaxa(newTaxa )
        selectValue(newTaxa , input_key); // Call selectValue with the current input value
    };

    return (
        <div className="mt-2">
            <div className={`grid grid-rows-6 grid-cols-1 gap-4 mt-2 h-full text-black w-full font-inter rounded-md font-semibold ` }>
                <h1 className="font-inter text-lg font-semibold text-white text-center">{label}</h1>
                <NumericFormat
                    type="text" 
                    name="Normal" 
                    id="Normal"
                    decimalSeparator=","
                    value={taxa.Normal}
                    onChange={(e : any) => handleChange(e,"Normal")}
                    className="w-full bg-white h-12  rounded-md font-light outline-none pl-4"/>

               <NumericFormat
                    type="text" 
                    name="IMO" 
                    id="IMO"
                    decimalSeparator=","
                    value={taxa.IMO}
                    onChange={(e : any) => handleChange(e,"IMO")}
                    className="w-full bg-white h-12  rounded-md font-light outline-none pl-4"/>
               
                <NumericFormat
                    type="text" 
                    name={"Oversize"} 
                    id={"Oversize"}
                    value={taxa.Oversize}
                    decimalSeparator=","
                    onChange={(e : any) => handleChange(e,"Oversize")}
                    className="w-full h-12  rounded-md font-light outline-none pl-4"/>

                <NumericFormat
                    type="text" 
                    name={"Oversize IMO"} 
                    id={"Oversize IMO"}
                    decimalSeparator=","
                    value={taxa["Oversize IMO"]}
                    onChange={(e : any) => handleChange(e,"Oversize IMO")}
                    className="w-full h-12  rounded-md font-light outline-none pl-4"/>
                
                <NumericFormat
                    type="text" 
                    name={"Reefer"} 
                    decimalSeparator=","
                    id={"Reefer"}
                    value={taxa.Reefer}
                    onChange={(e : any) => handleChange(e,"Reefer")}
                    className="w-full h-12  rounded-md font-light outline-none pl-4"/>
            </div>
        </div>
    )
}

export default TaxaInput