export const NoisyBackground = () => (
    <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />
)

export const GradientBlur = ({ color = 'accent-pink', position = 'top-right' }) => {
    const posClasses = {
        'top-right': '-top-72 -right-72',
        'top-left': '-top-72 -left-72',
        'bottom-right': '-bottom-72 -right-72',
        'bottom-left': '-bottom-72 -left-72',
    }

    // Using a simpler style object to avoid PurgeCSS issues with dynamic template literals for colors
    const colorStyles = {
        'accent-pink': 'rgba(213, 51, 105, 0.08)',
        'accent-indigo': 'rgba(99, 102, 241, 0.08)',
        'indigo-500': 'rgba(99, 102, 241, 0.08)',
        'accent-orange': 'rgba(218, 174, 81, 0.08)'
    }

    return (
        <div
            className={`premium-blur w-[800px] h-[800px] ${posClasses[position]}`}
            style={{ backgroundColor: colorStyles[color] || 'rgba(255,255,255,0.05)' }}
        />
    )
}
