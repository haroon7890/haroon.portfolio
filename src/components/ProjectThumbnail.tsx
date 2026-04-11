export default function ProjectThumbnail({
  title,
  gradient,
  pattern,
  category,
  imageSrc
}: {
  title: string
  gradient: string
  pattern: "grid" | "dots" | "circuit"
  category: string
  imageSrc?: string
}) {
  const patternId = title.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={`relative w-full aspect-video
      bg-gradient-to-br ${gradient} overflow-hidden
      flex items-center justify-center`}>

      {imageSrc ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
          <div className="absolute inset-0 bg-[#060b16]/55" />
        </>
      ) : null}

      {pattern === "grid" && (
        <svg className="absolute inset-0 w-full h-full
          opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${patternId}`} width="32"
              height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none"
                stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%"
            fill={`url(#grid-${patternId})`}/>
        </svg>
      )}

      {pattern === "dots" && (
        <svg className="absolute inset-0 w-full h-full
          opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`dots-${patternId}`} width="20"
              height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%"
            fill={`url(#dots-${patternId})`}/>
        </svg>
      )}

      {pattern === "circuit" && (
        <svg className="absolute inset-0 w-full h-full
          opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`circuit-${patternId}`} width="40"
              height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 20 L 40 20 M 20 0 L 20 40"
                fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="20" cy="20" r="3" fill="none"
                stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%"
            fill={`url(#circuit-${patternId})`}/>
        </svg>
      )}

      <span className="absolute text-white/[0.07]
        font-black text-6xl tracking-tighter
        text-center px-4 leading-none select-none">
        {title}
      </span>

      <span className="absolute top-3 left-3
        bg-black/30 backdrop-blur-sm text-[color:var(--accent)]
        text-xs font-mono tracking-widest
        px-2 py-1 rounded-md border
        border-[color:var(--accent-soft)] uppercase">
        {category}
      </span>

      <div className="absolute top-0 left-0 right-0
        h-[2px] bg-gradient-to-r from-[#ff8a5b00]
        via-[#ff8a5bcc] to-[#ff8a5b00]"/>
    </div>
  )
}
