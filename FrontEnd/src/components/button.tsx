type ButtonProps = React.ComponentProps<"button"> & {
    onclick?: () => void
    isLoading?: boolean
}

export function Button({ onclick, children, isLoading = false, disabled, ...props }: ButtonProps) {
    return (
        <div>
            <button type="submit" {...props}
                disabled={disabled || isLoading}
                aria-busy={isLoading}
                className="
                    flex h-11 w-full items-center justify-center gap-2 [&>img]:size-4 [&>img]:shrink-0 [&>img]:object-contain
                    rounded-md bg-brand px-4 whitespace-nowrap
                    text-sm font-medium text-on-brand
                    cursor-pointer transition-colors
                    hover:bg-brand-hover
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-brand
                    disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading && <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />}
                {children}
            </button>
        </div>
    )
}
