"use client"

import * as React from "react"
import {Root, Thumb } from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface ToggleSliderProps extends React.ComponentPropsWithoutRef<typeof Root> {
    className? : string
    label?: string
}

const ToggleSlider = React.forwardRef<
  React.ElementRef<typeof Root>,
  ToggleSliderProps
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
    >
      <Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </Root>
    {label && (
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    )}
  </div>
))
ToggleSlider.displayName = Root.displayName

export { ToggleSlider }

