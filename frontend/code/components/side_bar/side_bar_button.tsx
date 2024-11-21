import { useEffect, useState } from "react"
import { Panel } from "@/data/types"
import { Button } from "../ui/button"

type SideBarButtonProps = {
    value : Panel,
    selectValue : (input_value : Panel) => void,
    selectedValue? : Panel | null
}



export function SideBarButton({
    value,
    selectValue,
    selectedValue
} : SideBarButtonProps){

    const [isSelected,setIsSelected] = useState<boolean>(false)

    useEffect( () => {
        if(selectedValue)
            setIsSelected(selectedValue.id == value.id)
        else    
            setIsSelected(false)
    
    },[selectedValue])

    return(
        <div className="mx-auto w-min">

            <Button
                variant="outline"
                className={`border-transparent w-[10rem] border-b-2 mx-auto border-b-gray-200 bg-transparent hover:bg-transparent hover:text-orange-400 rounded-none ${isSelected ? "text-orange-600 font-semibold" : "" } `}
                type="button"
                onClick={() => {
                    selectValue(value)
                            
                 }}
            >
                {value.label}
            </Button>
        </div>
    )
}