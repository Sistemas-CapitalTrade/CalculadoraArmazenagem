"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InputLabelForm } from "@/data/types"


type Comboboxprop ={
    list : InputLabelForm[],
    initialValue? : string | null,
    emptyField : string, 
    placeholder : string,
    error? : boolean,
    selectValue : (value : any) => void
}

function Combobox({
    list,
    initialValue,
    emptyField,
    placeholder,
    error,
    selectValue
} : Comboboxprop, ref? : React.Ref<HTMLButtonElement>) {

  function updateValue(selectedValue : any) {
    if(value == selectedValue)
      selectValue('')
    else
      selectValue(selectedValue)
  }

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect( () => {
    if(initialValue)
      setValue(initialValue)
  })//,[])

  return (
    
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="default"
            ref={ref}
            role="combobox"
            type="button"
            aria-expanded={open}
            className={`w-full h-12 bg-white text-black hover:bg-white justify-between ${error ? 'border-2 border-rose-400' : ''}`}
          >
            {value
              ? list.find((item) => item.label === value)?.label
              : <span>{placeholder}</span>}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          
          { error ? <span className="text-sm font-inter text-rose-400">Campo obrigatório</span> : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyField}</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue : any) => {
                    setValue(currentValue === value ? "" : currentValue)
                    updateValue(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default React.forwardRef(Combobox)