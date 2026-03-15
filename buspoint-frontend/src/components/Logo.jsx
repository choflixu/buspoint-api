export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="20" width="160" height="100" rx="12" fill="#DC2626"/>
      <rect x="8" y="10" width="144" height="90" rx="8" fill="#B91C1C"/>
      <rect x="14" y="16" width="58" height="52" rx="4" fill="#FEF2F2" opacity="0.9"/>
      <rect x="80" y="16" width="58" height="52" rx="4" fill="#FEF2F2" opacity="0.9"/>
      <line x1="14" y1="42" x2="72" y2="42" stroke="#DC2626" stroke-width="2"/>
      <line x1="80" y1="42" x2="138" y2="42" stroke="#DC2626" stroke-width="2"/>
      <line x1="43" y1="16" x2="43" y2="68" stroke="#DC2626" stroke-width="2"/>
      <line x1="109" y1="16" x2="109" y2="68" stroke="#DC2626" stroke-width="2"/>
      <rect x="0" y="90" width="160" height="30" rx="0" fill="#991B1B"/>
      <rect x="4" y="95" width="30" height="16" rx="3" fill="#FCD34D"/>
      <rect x="126" y="95" width="30" height="16" rx="3" fill="#FCD34D"/>
      <rect x="55" y="94" width="50" height="14" rx="2" fill="#FEF2F2" opacity="0.5"/>
      <rect x="0" y="118" width="160" height="12" rx="0" fill="#7F1D1D"/>
      <circle cx="28" cy="136" r="16" fill="#1F2937"/>
      <circle cx="28" cy="136" r="10" fill="#374151"/>
      <circle cx="28" cy="136" r="5" fill="#9CA3AF"/>
      <circle cx="132" cy="136" r="16" fill="#1F2937"/>
      <circle cx="132" cy="136" r="10" fill="#374151"/>
      <circle cx="132" cy="136" r="5" fill="#9CA3AF"/>
      <rect x="-6" y="60" width="10" height="28" rx="3" fill="#B91C1C"/>
      <rect x="156" y="60" width="10" height="28" rx="3" fill="#B91C1C"/>
      <rect x="10" y="78" width="30" height="10" rx="2" fill="#FCD34D"/>
    </svg>
  )
}
