export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary indigo blob */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'aurora-drift-1 50s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Secondary violet blob */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          top: '50%',
          right: '10%',
          animation: 'aurora-drift-2 45s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Tertiary slate-blue blob */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #475569 0%, transparent 70%)',
          bottom: '5%',
          left: '40%',
          animation: 'aurora-drift-3 55s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
