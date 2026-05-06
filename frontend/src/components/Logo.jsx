export default function Logo({ size = 'md', onClick }) {
  const scale = size === 'sm' ? 0.8 : size === 'lg' ? 1.3 : 1;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 30,
        height: 30,
        borderRadius: 6,
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 16, height: 16 }}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
        </svg>
      </div>

      {/* Wordmark */}
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 500,
        fontSize: 15,
        color: '#111',
        letterSpacing: '-0.01em',
      }}>
        Brainly
      </span>
    </div>
  );
}