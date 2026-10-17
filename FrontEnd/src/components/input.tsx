import { useId } from "react";

type InputProps = React.ComponentProps<"input"> & {
    label: string;
};

export function Input({ label, id, type = "text", className = "", ...props }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="flex w-full flex-col gap-2">
            <label htmlFor={inputId} className="text-sm font-medium text-content">
                {label}
            </label>

            <input {...props} id={inputId} type={type}
                className={`
                    h-12 w-full rounded-lg border border-line
                    bg-surface px-4 text-base text-content
                    placeholder:text-muted
                    transition-colors
                    focus:border-brand focus:outline-none
                    focus:ring-2 focus:ring-brand/20
                    disabled:cursor-not-allowed disabled:opacity-60
                    ${className}`}
            />
        </div>
    );
}
