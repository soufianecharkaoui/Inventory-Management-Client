import gql from 'graphql-tag';

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
            code
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
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_PRODUCT = gql`
    mutation addProduct($productCategoryId: ID!, $brandId: ID!, $specs: String!, $warehouseId: ID!, 
            $stockQuantity: Int!, $unit: String!, $code: String!) {
        addProduct(productCategoryId: $productCategoryId, brandId: $brandId, specs: $specs, 
            warehouseId: $warehouseId, stockQuantity: $stockQuantity, unit: $unit, code: $code) {
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
            code
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
            code
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const REVOKE_PRODUCT = gql`
    mutation revokeProduct($id: ID!) {
        revokeProduct(id: $id) {
            id
            isDeleted
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