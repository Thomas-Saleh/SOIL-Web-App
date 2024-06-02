import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT } from '../queries';

const ProductManagement = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [editProduct] = useMutation(EDIT_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddProduct = () => {
    const name = prompt('Enter product name:');
    const price = parseFloat(prompt('Enter product price:'));
    const special_price = parseFloat(prompt('Enter special price:'));
    const imageUrl = prompt('Enter image URL:');
    addProduct({ variables: { name, price, special_price, imageUrl } });
  };

  const handleEditProduct = (id) => {
    const name = prompt('Enter new product name:');
    const price = parseFloat(prompt('Enter new product price:'));
    const special_price = parseFloat(prompt('Enter new special price:'));
    const imageUrl = prompt('Enter new image URL:');
    editProduct({ variables: { id, name, price, special_price, imageUrl } });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ variables: { id } });
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      <button onClick={handleAddProduct}>Add Product</button>
      <ul>
        {data.products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} - {product.special_price ? `Special Price: $${product.special_price}` : 'No Special Price'}
            <img src={product.imageUrl} alt={product.name} width={50} height={50} />
            <button onClick={() => handleEditProduct(product.id)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
