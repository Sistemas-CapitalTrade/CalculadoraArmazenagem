"use client"

import { useState } from "react"
import { InputLabelForm } from "@/data/types"
type CheckboxProp = {
    input : InputLabelForm,
    returnValue : (input : InputLabelForm, check : boolean) => void
}
export default function Checkbox({
    input,
    returnValue
} : CheckboxProp) {
  const [isChecked, setIsChecked] = useState(true)
   return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <input
          type="checkbox"
          id="pretty-checkbox"
          className="peer sr-only"
          checked={isChecked}
          onChange={() => {
            
        returnValue({...input},isChecked)
        setIsChecked(!isChecked)
    }}
        />
        <label
          htmlFor="pretty-checkbox"
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all duration-300 ease-in-out peer-checked:border-orange-600 peer-checked:bg-orange-500 peer-focus:ring-2 peer-focus:ring-orange-600 peer-focus:ring-offset-2 cursor-pointer"
        >
          <svg
            className={`h-3 w-3 text-white transition-transform duration-300 ease-in-out ${
              isChecked ? "scale-100" : "scale-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
      </div>
      <label
        htmlFor="pretty-checkbox"
        className="text-sm text-gray-100 font-medium  cursor-pointer select-none"
      >
        {input.label}
      </label>
    </div>
  )
}