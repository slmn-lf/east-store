import React from "react";
import { cn } from "@/lib/utils/cn";
import type { SelectProps } from "@/types";

/**
 * Select Component
 * Reusable select dropdown with label, error, and helper text
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        { label, error, helperText, options, className, id, required, ...props },
        ref
    ) => {
        const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-white"
                    >
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}

                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        "w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        "appearance-none cursor-pointer",
                        error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-white/20",
                        className
                    )}
                    required={required}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-800 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

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

Select.displayName = "Select";
