import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, value, defaultValue, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue)
    )

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(Boolean(e.target.value))
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value))
      props.onChange?.(e)
    }

    const isFloating = isFocused || hasValue || placeholder

    return (
      <div className="relative w-full group">
        <input
          id={inputId}
          type={type}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            "flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-foreground shadow-inner transition-all duration-300",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-transparent", // Hide placeholder initially if using floating label
            "focus-visible:outline-none focus-visible:bg-black/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            label && "pt-5 pb-1", // Extra padding for floating label
            className
          )}
          {...props}
        />
        
        {/* Animated Glow Border on Focus */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 blur-[2px] opacity-40 pointer-events-none"
            />
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 rounded-xl border border-transparent transition-colors duration-300 pointer-events-none group-focus-within:border-indigo-500/50" />

        {/* Floating Label */}
        {label && (
          <motion.label
            htmlFor={inputId}
            initial={false}
            animate={{
              y: isFloating ? -10 : 0,
              scale: isFloating ? 0.75 : 1,
              color: isFocused ? 'rgb(167 139 250)' : 'rgb(161 161 170)' // text-purple-400 vs text-zinc-400
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-3 top-3 origin-left text-sm pointer-events-none text-muted-foreground font-medium"
          >
            {label}
          </motion.label>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
