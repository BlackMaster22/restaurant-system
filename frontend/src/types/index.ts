export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    profile: UserProfile;
}

export interface UserProfile {
    role: 'cashier' | 'waiter' | 'admin';
    phone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    display_order: number;
    is_active: boolean;
    menu_items: MenuItem[];
    product_count: number;
    created_at: string;
    updated_at: string;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: number;
    category_name: string;
    image: string;
    image_url: string;
    image_thumbnail?: string;
    preparation_time: number;
    is_available: boolean;
    is_visible: boolean;
    allergens: string[];
    customization_options: CustomizationOption[];
    created_at: string;
    updated_at: string;
}

export interface CustomizationOption {
    id: number;
    name: string;
    is_required: boolean;
    max_choices: number;
    choices: CustomizationChoice[];
}

export interface CustomizationChoice {
    id: number;
    name: string;
    price_extra: number;
}

export interface Table {
    id: number;
    number: number;
    capacity: number;
    is_occupied: boolean;
    created_at: string;
}

export interface Order {
    id: number;
    table: number;
    table_number: number;
    waiter: number;
    waiter_name: string;
    status: OrderStatus;
    total_amount: number;
    notes: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    menu_item: MenuItem;
    menu_item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes: string;
    customizations: CustomizationChoice[];
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'served'
    | 'paid'
    | 'cancelled';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    notes: string;
    customizations: CustomizationChoice[];
    totalPrice: number;
}