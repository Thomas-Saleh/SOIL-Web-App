import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      age
      height
      weight
      activity_level
      dietary_preferences
      health_goals
      isBlocked
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      special_price
      imageUrl
    }
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      id
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id) {
      id
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: Float!, $special_price: Float, $imageUrl: String) {
    addProduct(name: $name, price: $price, special_price: $special_price, imageUrl: $imageUrl) {
      id
      name
      price
      special_price
      imageUrl
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EditProduct($id: ID!, $name: String, $price: Float, $special_price: Float, $imageUrl: String) {
    editProduct(id: $id, name: $name, price: $price, special_price: $special_price, imageUrl: $imageUrl) {
      id
      name
      price
      special_price
      imageUrl
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
