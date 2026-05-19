type IconProps = {
    className?: string
}

export function ShieldIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M12 3l7 4v5c0 4.5-2.5 7.7-7 9-4.5-1.3-7-4.5-7-9V7l7-4z" />
        </svg>
    )
}

export function ServerIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M4 6h16v4H4zM4 14h16v4H4z" />
            <circle cx="7" cy="8" r="0.8" fill="currentColor" />
            <circle cx="7" cy="16" r="0.8" fill="currentColor" />
        </svg>
    )
}

export function NoLogsIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M6 6l12 12" />
        </svg>
    )
}

export function SpeedIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M4 16l5-5 3 3 8-8" />
            <path d="M17 6h3v3" />
        </svg>
    )
}

export function BoltIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z" />
        </svg>
    )
}

export function SwitchIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M7 7h10M7 17h10" />
            <circle cx="9" cy="7" r="2" />
            <circle cx="15" cy="17" r="2" />
        </svg>
    )
}

export function DevicesIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <rect x="3" y="5" width="12" height="11" rx="2" />
            <rect x="16" y="8" width="5" height="10" rx="1.5" />
        </svg>
    )
}

export function RouteIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <circle cx="6" cy="7" r="2" />
            <circle cx="18" cy="17" r="2" />
            <path d="M8 7h4a4 4 0 0 1 4 4v4" />
        </svg>
    )
}

export function ChinaNodeIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M4 12h16M12 4v16" />
            <circle cx="12" cy="12" r="8" />
        </svg>
    )
}

export function PlayIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
            <path d="M8 6l10 6-10 6V6z" />
        </svg>
    )
}
