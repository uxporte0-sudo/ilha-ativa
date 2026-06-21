import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-14 w-full rounded-xl border border-borderSemantic bg-container-secondary px-4 py-2 text-base text-text-primary shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-disabled hover:border-borderSemantic-strong focus-visible:border-borderSemantic-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus/30 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-disabled md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

const TextField = Input

export { Input, TextField }

