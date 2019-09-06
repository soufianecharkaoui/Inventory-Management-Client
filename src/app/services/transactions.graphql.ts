import gql from 'graphql-tag';

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
                address
                phone
                email
            }
            type
            clientName
            hasClientEmail
            clientEmail
            clientPhone
            clientAddress
            product {
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
                    address
                    phone
                    email
                }
                stockQuantity
                unit
                code
            }
            transactionQuantity
            buyingPrice
            sellingPrice
            amount
            packaging
            currency
            paymentMethod 
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const GET_TRANSACTION = gql`
    query getTransaction($id: ID!) {
        getTransaction(id: $id) {
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
                address
                phone
                email
            }
            type
            clientName
            hasClientEmail
            clientEmail
            clientPhone
            clientAddress
            product {
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
                    address
                    phone
                    email
                }
                stockQuantity
                unit
                code
            }
            transactionQuantity
            buyingPrice
            sellingPrice
            amount
            packaging
            currency
            paymentMethod 
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_TRANSACTION = gql`
    mutation addTransaction($input: Boolean!, $userId: ID!, $warehouseId: ID!, $type: String, 
            $clientName: String, $hasClientEmail: Boolean!, $clientEmail: String, $clientPhone: String, 
            $clientAddress: String, $productId: ID!, $transactionQuantity: Int!, $buyingPrice: Float,
            $sellingPrice: Float, $amount: Float!, $packaging: String, $currency: String!, $paymentMethod: String, 
            $otherPaymentMethod: String, $agentId: ID!, $cashed: Boolean, $code: String!) {
        addTransaction(input: $input, userId: $userId, warehouseId: $warehouseId, type: $type, 
            clientName: $clientName, hasClientEmail: $hasClientEmail, clientEmail: $clientEmail, 
            clientPhone: $clientPhone, clientAddress: $clientAddress, productId: $productId,
            transactionQuantity: $transactionQuantity, buyingPrice: $buyingPrice, sellingPrice: $sellingPrice,
            amount: $amount, packaging: $packaging, currency: $currency, paymentMethod: $paymentMethod, 
            otherPaymentMethod: $otherPaymentMethod, agentId: $agentId, cashed: $cashed, code: $code) {
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
                address
                phone
                email
            }
            type
            clientName
            hasClientEmail
            clientEmail
            clientPhone
            clientAddress
            product {
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
                    address
                    phone
                    email
                }
                stockQuantity
                unit
                code
            }
            transactionQuantity
            buyingPrice
            sellingPrice
            amount
            packaging
            currency
            paymentMethod
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_TRANSACTION = gql`
    mutation updateTransaction($id: ID!, $input: Boolean!, $userId: ID!, $warehouseId: ID!, $type: String, 
            $clientName: String, $hasClientEmail: Boolean!, $clientEmail: String, $clientPhone: String, 
            $clientAddress: String, $productId: ID!, $transactionQuantity: Int!, $buyingPrice: Float,
            $sellingPrice: Float, $amount: Float!,, $packaging: String, $currency: String!, $paymentMethod: String, 
            $otherPaymentMethod: String, $agentId: ID!, $cashed: Boolean, $code: String!) {
        updateTransaction(id: $id, input: $input, userId: $userId, warehouseId: $warehouseId, type: $type, 
            clientName: $clientName, hasClientEmail: $hasClientEmail, clientEmail: $clientEmail, 
            clientPhone: $clientPhone, clientAddress: $clientAddress, productId: $productId,
            transactionQuantity: $transactionQuantity, buyingPrice: $buyingPrice, sellingPrice: $sellingPrice,
            amount: $amount, packaging: $packaging, currency: $currency, paymentMethod: $paymentMethod, 
            otherPaymentMethod: $otherPaymentMethod, agentId: $agentId, cashed: $cashed, code: $code) {
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
                address
                phone
                email
            }
            type
            clientName
            hasClientEmail
            clientEmail
            clientPhone
            clientAddress
            product {
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
                    address
                    phone
                    email
                }
                stockQuantity
                unit
                code
            }
            transactionQuantity
            buyingPrice
            sellingPrice
            amount
            packaging
            currency 
            paymentMethod
            otherPaymentMethod
            agent {
                id
                name
                email
            }
            cashed
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_TRANSACTION = gql`
    mutation deleteTransaction($id: ID!) {
        deleteTransaction(id: $id) {
            id
            isDeleted
        }
    }
`;

export const REVOKE_TRANSACTION = gql`
    mutation revokeTransaction($id: ID!) {
        revokeTransaction(id: $id) {
            id
            isDeleted
        }
    }
`;