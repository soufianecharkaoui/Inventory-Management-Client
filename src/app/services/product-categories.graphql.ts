import gql from 'graphql-tag';

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

export const UPDATE_PRODUCT_CATEGORY = gql`
    mutation updateProductCategory($id: ID!, $name: String, $brandIds: [ID]) {
        updateProductCategory(id: $id, name: $name, brandIds: $brandIds) {
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

export const REVOKE_PRODUCT_CATEGORY = gql`
    mutation revokeProductCategory($id: ID!) {
        revokeProductCategory(id: $id) {
            id
            isDeleted
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