export class Warehouse {
    id: string;
    name: string;
    city: string;
    country: string;
    currency: Currency;
    address: string;
    phone: string;
    email: string;
    transactions: Transaction[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Agent {
    id: string;
    name: string;
    email: string;
    transactions: Transaction[];
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
    isSelected: boolean = false;
    code: string;
    averagePrice: number;
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
    hasClientEmail: boolean;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    product: Product;
    transactionQuantity: number;
    buyingPrice: number;
    sellingPrice: number;
    amount: number = 0;
    packaging: string;
    currency: string;
    paymentMethod: string;
    otherPaymentMethod: string;
    agent: Agent
    cashed: boolean;
    code: string;
    rfq: string;
    bl: string;
    chargementDate: Date;
    dechargementDate: Date;
    warehouseReceiveDate: Date;
    sellingDate: Date;
    numberCountainers: number;
    packagingPlanned: number;
    packagingReceived: number;
    packagingDecharged: number;
    missingPackaging: number;
    damagedPackaging: number;
    emptyUnits: number;
    emptyRepackablePackaging: number;
    damagedPackagingReconditionnable: number;
    devise: Currency;
    dechargement: string;
    refundable: boolean;
    security: string;
    penality: string;
    bonus: string;
    comment: string;
    cost: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}