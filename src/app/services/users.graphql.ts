import gql from 'graphql-tag';

export const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            name
            email
            isAdmin
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($name: String!, $email: String!, $password: String!, $isAdmin: Boolean!) {
        addUser(name: $name, email: $email, password: $password, isAdmin: $isAdmin) {
            id
            name
            email
            isAdmin
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const LOGIN = gql`
    query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
        }
    }
`;



export const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            isDeleted
        }
    }
`;