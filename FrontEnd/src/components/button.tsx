type ButtonProps = React.ComponentProps<"button"> & {
    onclick?: () => void
}

export function Button({ onclick, children, ...props }: ButtonProps) {
    return (
        <div>
            <button type="submit" {...props}
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
                {children}
            </button>
        </div>
    )
}
