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
            }
            type
            clientName
            hasClientEmail
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
                code
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
            $clientAddress: String, $productIds: [ID!]!, $packaging: String, 
            $currency: String!, $totalAmount: Int!, $paymentMethod: String, 
            $otherPaymentMethod: String, $agentId: ID!, $cashed: Boolean, $code: String!) {
        addTransaction(input: $input, userId: $userId, warehouseId: $warehouseId, type: $type, 
            clientName: $clientName, hasClientEmail: $hasClientEmail, clientEmail: $clientEmail, 
            clientPhone: $clientPhone, clientAddress: $clientAddress, productIds: $productIds, 
            packaging: $packaging, currency: $currency, totalAmount: $totalAmount, paymentMethod: $paymentMethod, 
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
            }
            type
            clientName
            hasClientEmail
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
                code
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
            $clientAddress: String, $productIds: [ID!]!, $packaging: String, 
            $currency: String!, $totalAmount: Int!, $paymentMethod: String, 
            $otherPaymentMethod: String, $agentId: ID!, $cashed: Boolean, $code: String!) {
        updateTransaction(id: $id, input: $input, userId: $userId, warehouseId: $warehouseId, type: $type, 
            clientName: $clientName, hasClientEmail: $hasClientEmail, clientEmail: $clientEmail, 
            clientPhone: $clientPhone, clientAddress: $clientAddress, productIds: $productIds, 
            packaging: $packaging, currency: $currency, totalAmount: $totalAmount, paymentMethod: $paymentMethod, 
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
            }
            type
            clientName
            hasClientEmail
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
                code
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