export default function StorageChart({ used, total }) {
  const pct = Math.round((used / total) * 100)
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="storage-donut">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke="#0f172a"
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        {pct}%
      </text>
      <text x="55" y="64" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Inter, sans-serif">
        Usado
      </text>
    </svg>
  )
}
