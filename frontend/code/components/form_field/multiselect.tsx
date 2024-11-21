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



type MultipleSelectorProps = {
  inputList? : string[],
  servicosList : InputLabelForm[],
  returnList : (list : string[]) => void
}

export function MultipleSelector({
  inputList,
  servicosList,
  returnList
}: MultipleSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string[]>((inputList ? inputList : []))

  function handleOnOpenChange(input_bool : boolean){
    returnList(value)
    setOpen(input_bool)
  }
  
  const handleSetValue = (val: string) => {
      if (value.includes(val)) {
        
        setValue(() => {
          value.splice(value.indexOf(val), 1);
          const newValue = value.filter((item) => item !== val)
          return newValue
        }
        );
      } else {
           
          setValue(prevValue =>{
            const newValue = [...prevValue, val]
            return newValue
            
          } );
      }
  }

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange }>
      <PopoverTrigger asChild>
        <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className="w-full h-full justify-between overflow-scroll  bg-white hover:bg-white text-black"
        >
            <div className="h-full w-full items-start flex flex-wrap justify-start">
                {value?.length ?
                    value.map((val, i) => (
                        <div key={i} className="flex px-2 items-center h-8 m-1 py-1 w-min rounded-xl border bg-slate-200 text-black text-xs font-medium">
                          {servicosList.find((servico) => servico.id === val)?.label}
                          <div
                            onClick={(e) => {
                              handleSetValue(val) 
                              returnList(value)
                              e.stopPropagation()
                             } }
                            className="bg-red-600 ml-2 rounded-md text-white w-4 h-4"
                          >
                            X                            
                          </div>
                        </div>
                    ))
                    : ""}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
        <Command>
          <CommandInput placeholder="" />
          <CommandEmpty>Nenhum serviço encontrado</CommandEmpty>
          <CommandGroup className="max-h-24">
            <CommandList className="max-h-24">
                {servicosList.map((servico) => (
                    <CommandItem
                        key={servico.id}
                        value={servico.id}
                        onSelect={(option) => {
                            handleSetValue(option);
                        }}>
                        <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                value.includes(servico.id) ? "opacity-100" : "opacity-0"
                            )} />
                        {servico.label}
                    </CommandItem>
                ))}
                </CommandList>
            </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}