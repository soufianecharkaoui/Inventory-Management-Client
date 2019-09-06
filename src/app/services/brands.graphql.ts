import gql from 'graphql-tag';

export const GET_BRANDS = gql`
    query getBrands {
        getBrands {
            id
            name
            productCategories {
                id
                name
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

export const UPDATE_BRAND = gql`
    mutation updateBrand($id: ID!, $name: String) {
        updateBrand(id: $id, name: $name) {
            id
            name
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_BRAND = gql`
    mutation revokeBrand($id: ID!) {
        revokeBrand(id: $id) {
            id
            isDeleted
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