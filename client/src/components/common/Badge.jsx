const variantClasses = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  danger: "bg-red-50 text-red-700 border-red-200"
}

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1"
}

const dotColors = {
  success: "bg-emerald-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
  purple: "bg-violet-500",
  neutral: "bg-slate-400",
  danger: "bg-red-500"
}

const Badge = ({ variant = "neutral", size = "md", dot = false, className = "", children }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantClasses[variant] || variantClasses.neutral} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral}`} />
      )}
      {children}
    </span>
  )
}

export default Badge
