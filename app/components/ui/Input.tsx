import React from "react";
import { cn } from "@/lib/utils/cn";
import type { InputProps } from "@/types";

/**
 * Input Component
 * Reusable input field with label, error, and helper text
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, helperText, className, id, required, ...props },
        ref
    ) => {
        const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-white"
                    >
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-white/20",
                        className
                    )}
                    required={required}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-white/60">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
