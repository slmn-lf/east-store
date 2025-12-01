// Product Types
export interface Product {
  id: string | number;
  slug?: string;
  sku?: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  price_idr?: number;
  image_url?: string;
  images?: string[];
  status: ProductStatus;
  formFields?: FormField[];
  storePhone?: string;
  wa_store?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export type ProductStatus =
  | "coming_soon"
  | "active"
  | "closed"
  | "pre_order"
  | "close";

// Order Types
export interface Order {
  id: string;
  productId: string;
  product?: Product;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  dynamicFormData?: Record<string, string | number>;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "cancelled";

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | "mentrack_pesanan"
  | "dikonfirmasi"
  | "belum_lunas"
  | "lunas";

// Message Types
export interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Form Types
export interface FormField {
  id: string;
  name: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export type FormFieldType = "text" | "number" | "email" | "select" | "textarea";

// Component Props Types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}
