import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        soft:
          "border-transparent bg-button-bkg text-white shadow hover:bg-logo-green hover:text-white",
        medium:
          "border-transparent bg-logo-green text-white shadow hover:bg-prm-bkg",
        hard:
          "border-transparent bg-snd-bkg text-white shadow hover:bg-prm-bkg",
        active:
          "border-transparent bg-logo-green text-white shadow hover:bg-button-bkg hover:text-black",
        completed:
          "border-transparent bg-prm-bkg text-white shadow hover:bg-snd-bkg",
      },
    },
    defaultVariants: {
      variant: "soft",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
