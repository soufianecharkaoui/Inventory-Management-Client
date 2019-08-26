export class Warehouse {
    id: string;
    name: string;
    city: string;
    country: string;
    currency: Currency;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Agent {
    id: string;
    name: string;
    email: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Brand {
    id: string;
    name: string;
    productCategories: [ProductCategory];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class ProductCategory {
    id: string;
    name: string;
    brands: [Brand];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Product {
    id: string;
    productCategory: ProductCategory;
    brand: Brand;
    specs: string;
    warehouse: Warehouse;
    stockQuantity: number;
    unit: string;
    transactionQuantity: number;
    buyingPrice: number;
    sellingPrice: number;
    amount: number = 0;
    isSelected: boolean = false;
    code: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class PaymentMethod {
    id: string;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Currency {
    id: string;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Transaction {
    id: string;
    input: boolean;
    user: User;
    warehouse: Warehouse;
    type: string;
    clientName: string;
    clientEmail: boolean;
    clientPhone: string;
    clientAddress: string;
    products: [Product];
    packaging: string;
    currency: string;
    totalAmount: number;
    paymentMethod: string;
    otherPaymentMethod: string;
    agent: Agent
    cashed: boolean;
    code: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}