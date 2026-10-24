/** Capa da marca para posts sem imagem: gradiente escuro, símbolo MM grande e a primeira tag. */
export function BlogCoverFallback({ tag, className = "" }: { tag?: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1f1630] via-[#141414] to-[#0a0a0a] ${className}`}
    >
      <img
        src="/brand/mm-symbol-purple.svg"
        alt=""
        className="absolute -right-6 -bottom-10 h-[130%] opacity-[0.12] transition-transform duration-700 group-hover:scale-105"
      />
      <img src="/brand/mm-symbol-purple.svg" alt="" className="absolute left-6 top-6 h-7 opacity-70" />
      {tag && (
        <span className="absolute left-6 top-16 font-mono text-xs text-neon-lime/80">
          <span className="text-white/40">#</span> {tag}
        </span>
      )}
    </div>
  );
}
