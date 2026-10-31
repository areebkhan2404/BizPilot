const variantClasses = {
  primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  ai: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm"
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl"
}

const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  children
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

export default Button
