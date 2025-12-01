// Design System Constants

// Colors
export const COLORS = {
    primary: "amber-500",
    secondary: "blue-500",
    success: "green-500",
    warning: "yellow-500",
    error: "red-500",
    info: "blue-400",
} as const;

// Status Colors
export const STATUS_COLORS = {
    active: "green",
    coming_soon: "yellow",
    closed: "red",
    pending: "yellow",
    confirmed: "blue",
    shipped: "purple",
    completed: "green",
} as const;

// Breakpoints (Tailwind defaults)
export const BREAKPOINTS = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
} as const;

// Spacing
export const SPACING = {
    section: "py-14 sm:py-20",
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
} as const;

// Navigation Items
export const NAV_ITEMS = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Artwork", href: "/artwork" },
    { name: "Contact", href: "/contact" },
] as const;

// Product Status Options
export const PRODUCT_STATUS_OPTIONS = [
    { value: "coming_soon", label: "Coming Soon" },
    { value: "active", label: "Active" },
    { value: "closed", label: "Closed" },
] as const;

// Order Status Options
export const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
] as const;

// Form Field Type Options
export const FORM_FIELD_TYPES = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "select", label: "Select" },
    { value: "textarea", label: "Textarea" },
] as const;
