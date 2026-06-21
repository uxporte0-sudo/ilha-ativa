import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] text-sm font-semibold tracking-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:bg-interaction-disabled disabled:text-text-inverse disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary text-text-inverse shadow-button hover:bg-brand-primary-strong active:bg-interaction-pressed",
        destructive:
          "bg-error text-error-foreground shadow-sm hover:bg-error/90",
        outline:
          "border border-borderSemantic bg-container-secondary text-text-primary shadow-sm hover:bg-brand-primary-subtle",
        secondary:
          "bg-brand-secondary text-text-primary shadow-sm hover:brightness-95",
        ghost: "text-text-primary hover:bg-container-primary",
        link: "min-h-0 rounded-none p-0 text-text-tertiary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-[var(--radius-card)] px-3 text-xs",
        lg: "h-16 px-8 text-base",
        icon: "h-11 w-11 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

