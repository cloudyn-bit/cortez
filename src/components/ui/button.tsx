import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-[calc(200ms*var(--anim-speed))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] active:brightness-95"
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-[0_4px_14px_0_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23),0_4px_14px_0_hsl(var(--primary)/0.5)] hover:-translate-y-0.5",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5",
      outline: "glass-button border border-white/5 bg-transparent shadow-sm hover:bg-white/5 hover:border-white/15 text-foreground hover:-translate-y-0.5",
      secondary: "glass-button text-secondary-foreground shadow-sm hover:bg-white/10 hover:-translate-y-0.5",
      ghost: "hover:bg-white/5 text-foreground hover:-translate-y-0.5",
      link: "text-primary underline-offset-4 hover:underline",
      glow: "relative bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.8)] hover:scale-105"
    }

    const sizes = {
      default: "h-9 px-4 py-2 rounded-[calc(var(--radius)-2px)]",
      sm: "h-8 px-3 text-xs rounded-[calc(var(--radius)-4px)]",
      lg: "h-11 px-8 text-base rounded-[var(--radius)]",
      icon: "h-9 w-9 rounded-[calc(var(--radius)-2px)]"
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
