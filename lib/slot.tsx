// This is a workaround to fix the Button component's asChild prop
// In a real implementation, you would use Radix UI's Slot component

import React from "react";

// Simple implementation - in production use @radix-ui/react-slot
export const Slot = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement> & { children: React.ReactElement }
>(({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...props,
            ...(children.props || {}),
            ref,
        } as any);
    }
    return null;
});

Slot.displayName = "Slot";
