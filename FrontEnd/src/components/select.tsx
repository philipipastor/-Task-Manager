type Option = {
    label: string;
    value: string;
};

type SelectProps = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    id?: string;
    disabled?: boolean;
};

export function Select({ options, value, onChange, className = "", id, disabled }: SelectProps) {
    return (
        <select
            id={id}
            disabled={disabled}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`h-11 w-full min-w-0 cursor-pointer rounded-md border border-line bg-surface px-4 text-sm font-semibold text-content transition-colors hover:border-brand/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
