import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors focus:outline-none focus:ring-2 focus:ring-interaction-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-text-inverse",
        secondary:
          "border-transparent bg-container-secondary-strong text-text-primary",
        destructive:
          "border-transparent bg-error text-error-foreground",
        outline: "border-borderSemantic text-text-secondary",
        accent: "border-transparent bg-container-accent-strong text-text-primary",
        success: "border-transparent bg-success text-success-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }

