import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Category {
    id: string;
    name: string;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: string;
    customer: Principal;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    bonusOffer?: string;
    category: Category;
    photo?: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(id: string, name: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrderHistory(): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product>;
    getProductsByCategory(categoryId: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitOrder(items: Array<OrderItem>): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
    updateProduct(productId: string, name: string, description: string, price: bigint, photo: ExternalBlob | null, categoryId: string, bonusOffer: string | null): Promise<void>;
}
