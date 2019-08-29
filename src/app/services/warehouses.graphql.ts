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
            address
            phone
            email
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const GET_WAREHOUSE = gql`
    query getWarehouse($id: ID!) {
        getWarehouse(id: $id) {
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
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_WAREHOUSE = gql`
    mutation addWarehouse($name: String!, $city: String!, $country: String!, $currencyId: ID!, $address: String!,
            $phone: String!, $email: String!) {
        addWarehouse(name: $name, city: $city, country: $country, currencyId: $currencyId, address: $address,
                phone: $phone, email: $email) {
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
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_WAREHOUSE = gql`
    mutation updateWarehouse($id: ID!, $name: String, $city: String, $country: String, $currencyId: ID, $address: String!,
            $phone: String!, $email: String!) {
        updateWarehouse(id: $id, name: $name, city: $city, country: $country, currencyId: $currencyId, address: $address,
                phone: $phone, email: $email) {
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
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_WAREHOUSE = gql`
    mutation revokeWarehouse($id: ID!) {
        revokeWarehouse(id: $id) {
            id
            isDeleted
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