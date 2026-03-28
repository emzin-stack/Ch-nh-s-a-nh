export function LoadingSpinner({ size = 20, label }: { size?: number; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'var(--accent)' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {label && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      )}
    </div>
  );
}