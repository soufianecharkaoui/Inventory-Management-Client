import gql from 'graphql-tag';

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

export const GET_FCFA = gql`
    query getFCFA {
        getFCFA {
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

export const UPDATE_CURRENCY = gql`
    mutation updateCurrency($id: ID!, $name: String!) {
        updateCurrency(id: $id, name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_CURRENCY = gql`
    mutation revokeCurrency($id: ID!) {
        revokeCurrency(id: $id) {
            id
            isDeleted
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