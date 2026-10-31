const Card = ({ className = "", hoverEffect = false, onClick, children }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-card ${hoverEffect ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
