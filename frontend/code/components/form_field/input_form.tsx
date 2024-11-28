import { forwardRef, Ref } from "react"

type props = {
    field : string
    name : string,
    currentValue : string,
    error? : boolean,
    selectValue : (valor : string) => void,
    trailingIcon? : React.ReactNode
}
function InputForm({
    field,
    name,
    currentValue,
    error,
    selectValue,
    trailingIcon
} : props, ref : Ref<HTMLInputElement>){
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        selectValue(event.target.value); // Call selectValue with the current input value
    };
    return (
        <div className="">
            <label htmlFor={field} className="block text-lg font-inter font-light">{name}</label>
            <div className={`flex p-2 bg-white h-12 text-black w-full font-inter rounded-md font-semibold justify-between ${error ? 'border-2 border-rose-400' : ''} ` }>
                <input 
                    type="text" 
                    ref={ref} 
                    name={field} 
                    id={field}
                    value={currentValue}
                    onChange={handleChange}
                    className="w-full rounded-md font-light outline-none pl-4"/>

                    {trailingIcon}

                </div>
            { error ? <span className="text-sm font-inter text-rose-400">Campo obrigatório</span> : null}
        </div>
    )
}

export default forwardRef(InputForm)