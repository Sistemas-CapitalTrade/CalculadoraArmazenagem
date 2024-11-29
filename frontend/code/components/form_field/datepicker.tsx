"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { InputMask } from '@react-input/mask';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type PickerProps ={
    selectValue : (value : any) => void,
    initialValue : Date | null,
    error? : boolean
}


export function DatePicker({
    selectValue,
    initialValue,
    error
} : PickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [stringDate, setStringDate] = React.useState<string>("")

  React.useEffect(()=>{
      if(initialValue){
      setDate(initialValue)
      setStringDate(format(initialValue, "dd/MM/yyyy")); // Set initial string date
      }
    },[initialValue]
  )
  
  React.useEffect(()=>{
    
  },[stringDate]
  )



  return (
    <Popover>
      <div className="relative w-full">
        <InputMask
          type="string"
          value={stringDate}
          className={`w-full h-12 justify-start bg-white text-black p-4 text-left font-normal rounded-lg text-sm ${error ? 'border-2 border-rose-400' : ''}`}
          mask="XX/XX/XXXX"
          
          replacement={{
            'X': /[0-9]/, // Matches any digit (0-9)
            '_': /[0-9]?/, // Matches any digit (0-9) for the year
          }}
          onChange={(e) => {
            setStringDate(e.target.value)
          }}  
          onBlur={(e) => {

            const parsedDate = parse(stringDate,"dd/MM/yyyy", new Date()) 
            console.log(parsedDate)

            if (parsedDate.toString() === "Invalid Date") {
              setDate(undefined)
            } else {
              setDate(parsedDate)
              setStringDate(e.target.value)
              selectValue(parsedDate)
            } 
          }}
        ></InputMask>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "text-muted-foreground font-normal right-2 absolute top-1"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        { error ? <span className="text-sm font-inter text-rose-400">Campo Obrigatorio</span> : null}
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return
            setDate(selectedDate)
            setStringDate(format(selectedDate, "dd/MM/yyyy"))
            selectValue(selectedDate)
          }}
          defaultMonth={date}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}



{/* <Popover>
<PopoverTrigger asChild>
  <div>
    <Button
      variant={"outline"}
      type="button"
      className={cn(
        `w-full h-12 justify-start text-black text-left font-normal ${error ? 'border-2 border-rose-400' : ''}`,
        !date && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      { date ? format(date, 'dd/MM/yyyy') : <span>Pick a date</span>}
    </Button>
    { error ? <span className="text-sm font-inter text-rose-400">Campo obrigatório</span> : null}
  </div>
</PopoverTrigger>
<PopoverContent className="w-auto p-0">
  <Calendar
    mode="single"
    selected={date}
    onSelect={(date) => {
      setDate(date)
      selectValue(date)
    }}
    initialFocus
  />
</PopoverContent>
</Popover> */}