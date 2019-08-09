import gql from 'graphql-tag';

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

export const UPDATE_PAYMENT_METHOD = gql`
    mutation updatePaymentMethod($id: ID!, $name: String) {
        updatePaymentMethod(id: $id, name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_PAYMENT_METHOD = gql`
    mutation revokePaymentMethod($id: ID!) {
        revokePaymentMethod(id: $id) {
            id
            isDeleted
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