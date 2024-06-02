import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
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

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: Float!, $special_price: Float, $imageUrl: String!) {
    addProduct(name: $name, price: $price, special_price: $special_price, imageUrl: $imageUrl) {
      id
      name
      price
      special_price
      imageUrl
    }
  }
`;

const EDIT_PRODUCT = gql`
  mutation EditProduct($id: ID!, $name: String, $price: Float, $special_price: Float, $imageUrl: String!) {
    editProduct(id: $id, name: $name, price: $price, special_price: $special_price, imageUrl: $imageUrl) {
      id
      name
      price
      special_price
      imageUrl
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

function ProductManagement() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [editProduct] = useMutation(EDIT_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', price: '', special_price: '', imageUrl: '' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddProduct = () => {
    setAddingProduct(true);
    setFormValues({ name: '', price: '', special_price: '', imageUrl: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormValues({ name: product.name, price: product.price, special_price: product.special_price, imageUrl: product.imageUrl });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ variables: { id } });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const imageUrl = formValues.imageUrl || 'default-image-url.jpg';
    if (editingProduct) {
      editProduct({
        variables: {
          id: editingProduct,
          name: formValues.name,
          price: parseFloat(formValues.price),
          special_price: parseFloat(formValues.special_price),
          imageUrl
        }
      }).then(() => {
        setEditingProduct(null);
        setFormValues({ name: '', price: '', special_price: '', imageUrl: '' });
      });
    } else {
      addProduct({
        variables: {
          name: formValues.name,
          price: parseFloat(formValues.price),
          special_price: parseFloat(formValues.special_price),
          imageUrl
        }
      }).then(() => {
        setAddingProduct(false);
        setFormValues({ name: '', price: '', special_price: '', imageUrl: '' });
      });
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      {!addingProduct && (
        <button onClick={handleAddProduct}>Add Product</button>
      )}
      {(addingProduct || editingProduct) && (
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="name" value={formValues.name} onChange={handleInputChange} placeholder="Product Name" required />
          <input type="number" name="price" value={formValues.price} onChange={handleInputChange} placeholder="Price" required />
          <input type="number" name="special_price" value={formValues.special_price} onChange={handleInputChange} placeholder="Special Price" />
          <input type="text" name="imageUrl" value={formValues.imageUrl} onChange={handleInputChange} placeholder="Image URL" />
          <button type="submit">{editingProduct ? 'Save' : 'Add'}</button>
          <button type="button" onClick={() => { setEditingProduct(null); setAddingProduct(false); }}>Cancel</button>
        </form>
      )}
      <ul>
        {data.products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} - {product.special_price ? `Special Price: $${product.special_price}` : 'No Special Price'}
            <img src={product.imageUrl} alt={product.name} width={50} height={50} />
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductManagement;
