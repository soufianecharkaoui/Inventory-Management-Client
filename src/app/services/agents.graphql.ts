import gql from 'graphql-tag';

export const GET_AGENTS = gql`
    query getAgents {
        getAgents {
            id
            name
            email
            isDeleted
            createdAt
            updatedAt
            transactions {
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
                    specs
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
                cashed
                code
                isDeleted
                createdAt
                updatedAt
            }
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

export const UPDATE_AGENT = gql`
    mutation updateAgent($id: ID!, $name: String, $email: String) {
        updateAgent(id: $id, name: $name, email: $email) {
            id
            name
            email
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_AGENT = gql`
    mutation revokeAgent($id: ID!) {
        revokeAgent(id: $id) {
            id
            isDeleted
        }
    }
`;

export const DELETE_AGENT = gql`
    mutation deleteAgent($id: ID!) {
        deleteAgent(id: $id) {
            id
            isDeleted
        }
    }
`;