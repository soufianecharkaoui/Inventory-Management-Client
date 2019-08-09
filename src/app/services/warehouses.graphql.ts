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