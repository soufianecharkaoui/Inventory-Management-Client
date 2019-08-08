import gql from 'graphql-tag';

export const GET_WAREHOUSES = gql`
    query getWarehouses {
        getWarehouses {
            id
            name
            city
            country
            currency {
                id
                name
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_WAREHOUSE = gql`
    mutation addWarehouse($name: String!, $city: String!, $country: String!, $currencyId: ID!) {
        addWarehouse(name: $name, city: $city, country: $country, currencyId: $currencyId) {
            id
            name
            city
            country
            currency {
                id
                name
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_WAREHOUSE = gql`
    mutation deleteWarehouse($id: ID!) {
        deleteWarehouse(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_AGENTS = gql`
    query getAgents {
        getAgents {
            id
            name
            email
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_AGENT = gql`
    mutation addAgent($name: String!, $email: String!) {
        addAgent(name: $name, email: $email) {
            id
            name
            email
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_AGENT = gql`
    mutation deleteAgent($id: ID!) {
        deleteAgent(id: $id) {
            id
            name
            email
            isDeleted
        }
    }
`;

export const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            name
            email
            isAdmin
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($name: String!, $email: String!, $password: String!, $isAdmin: Boolean!) {
        addUser(name: $name, email: $email, password: $password, isAdmin: $isAdmin) {
            id
            name
            email
            isAdmin
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const LOGIN = gql`
    query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
        }
    }
`;



export const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_BRANDS = gql`
    query getBrands {
        getBrands {
            id
            name
            productCategories {
                id
                name
                brands {
                    id 
                    name
                }
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_BRAND = gql`
    mutation addBrand($name: String!) {
        addBrand(name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_BRAND = gql`
    mutation deleteBrand($id: ID!) {
        deleteBrand(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_PRODUCT_CATEGORIES = gql`
    query getProductCategories {
        getProductCategories {
            id
            name
            brands {
                id
                name
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const GET_PRODUCT_CATEGORY = gql`
    query getProductCategory($id: ID!) {
        getProductCategory(id: $id) {
            id
            name
            brands {
                id
                name
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_PRODUCT_CATEGORY = gql`
    mutation addProductCategory($name: String!, $brandIds: [ID!]!) {
        addProductCategory(name: $name, brandIds: $brandIds) {
            id
            name
            brands {
                id
                name
            }
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_PRODUCT_CATEGORY = gql`
    mutation deleteProductCategory($id: ID!) {
        deleteProductCategory(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
            id
            productCategory {
                id
                name
            }
            brand {
                id
                name
            }
            specs
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            stockQuantity
            unit
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const GET_PRODUCTS_BY_WAREHOUSE = gql`
    query getProductsByWarehouse($warehouseId: ID!) {
        getProductsByWarehouse(warehouseId: $warehouseId) {
            id
            productCategory {
                id
                name
            }
            brand {
                id
                name
            }
            specs
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            stockQuantity
            unit
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_PRODUCT = gql`
    mutation addProduct($productCategoryId: ID!, $brandId: ID!, $specs: String!, $warehouseId: ID!, 
            $stockQuantity: Int!, $unit: String!) {
        addProduct(productCategoryId: $productCategoryId, brandId: $brandId, specs: $specs, 
            warehouseId: $warehouseId, stockQuantity: $stockQuantity, unit: $unit) {
            id
            productCategory {
                id
                name
            }
            brand {
                id
                name
            }
            specs
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            stockQuantity
            unit
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation updateProduct($id: ID!, $productCategoryId: ID, $brandId: ID, $specs: String, $warehouseId: ID, 
            $stockQuantity: Int, $unit: String, $transactionQuantity: Int, $buyingPrice: Int, 
            $sellingPrice: Int, $amount: Int) {
        updateProduct(id: $id, productCategoryId: $productCategoryId, brandId: $brandId, specs: $specs, 
            warehouseId: $warehouseId, stockQuantity: $stockQuantity, unit: $unit, transactionQuantity: $transactionQuantity, 
            buyingPrice: $buyingPrice, sellingPrice: $sellingPrice, amount: $amount) {
            id
            productCategory {
                id
                name
            }
            brand {
                id
                name
            }
            specs
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            stockQuantity
            transactionQuantity
            buyingPrice
            sellingPrice
            amount
            unit
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_PAYMENT_METHODS = gql`
    query getPaymentMethods {
        getPaymentMethods {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_PAYMENT_METHOD = gql`
    mutation addPaymentMethod($name: String!) {
        addPaymentMethod(name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_PAYMENT_METHOD = gql`
    mutation deletePaymentMethod($id: ID!) {
        deletePaymentMethod(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_CURRENCIES = gql`
    query getCurrencies {
        getCurrencies {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_CURRENCY = gql`
    mutation addCurrency($name: String!) {
        addCurrency(name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_CURRENCY = gql`
    mutation deleteCurrency($id: ID!) {
        deleteCurrency(id: $id) {
            id
            isDeleted
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query getTransactions {
        getTransactions {
            id
            input
            user {
                id
                name
                email
            }
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            type
            clientName
            clientEmail
            clientPhone
            clientAddress
            products {
                id
                productCategory {
                    id
                    name
                    brands {
                        id
                        name
                    }
                }
                brand {
                    id
                    name
                }
                specs
                warehouse {
                    id
                    name
                    city
                    country
                    currency {
                        id
                        name
                    }
                }
                stockQuantity
                unit
                transactionQuantity
                buyingPrice
                sellingPrice
                amount
            }
            packaging
            currency
            totalAmount
            paymentMethod 
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_TRANSACTION = gql`
    mutation addTransaction($input: Boolean!, $userId: ID!, $warehouseId: ID!, $type: String, 
            $clientName: String, $clientEmail: Boolean!, $clientPhone: String, 
            $clientAddress: String, $productIds: [ID!]!, $packaging: String, 
            $currency: String!, $totalAmount: Int!, $paymentMethod: String, 
            $otherPaymentMethod: String, $agentId: ID!, $cashed: Boolean) {
        addTransaction(input: $input, userId: $userId, warehouseId: $warehouseId, type: $type, 
            clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, 
            clientAddress: $clientAddress, productIds: $productIds, packaging: $packaging, 
            currency: $currency, totalAmount: $totalAmount, 
            paymentMethod: $paymentMethod, otherPaymentMethod: $otherPaymentMethod, agentId: $agentId, cashed: $cashed) {
            id
            input
            user {
                id
                name
                email
            }
            warehouse {
                id
                name
                city
                country
                currency {
                    id
                    name
                }
            }
            type
            clientName
            clientEmail
            clientPhone
            clientAddress
            products {
                id
                productCategory {
                    id
                    name
                    brands {
                        id
                        name
                    }
                }
                brand {
                    id
                    name
                }
                specs
                warehouse {
                    id
                    name
                    city
                    country
                    currency {
                        id
                        name
                    }
                }
                stockQuantity
                unit
                transactionQuantity
                buyingPrice
                sellingPrice
                amount
            }
            packaging
            currency 
            totalAmount
            paymentMethod
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

