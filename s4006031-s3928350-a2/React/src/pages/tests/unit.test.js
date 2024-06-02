import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Products from '../Product';
import Cart from '../Cart';
import ReviewList from '../ReviewList';
import * as jwtUtils from '../../utils/jwtUtils';
import { getCartItems, updateCartItem, removeCartItem, addReview, getAllReviewsForProduct } from '../../data/repository';
import axios from 'axios';

jest.mock('../../data/repository');
jest.mock('../../utils/jwtUtils');
jest.mock('axios');

beforeAll(() => {
  window.alert = jest.fn(); // Mock window.alert
});

beforeEach(() => {
  const mockToken = 'valid.mock.jwt.token';
  localStorage.setItem('sessionToken', mockToken);
  jwtUtils.decodeJWT.mockReturnValue({ user_id: 1, username: 'testuser' }); // Mock a valid decoded token
  getCartItems.mockResolvedValue([]); // Mock a resolved promise for getCartItems
  axios.get.mockResolvedValue({ data: [{ id: 1, name: 'Product 1', price: 10.0, imageUrl: '/img/product1.jpg' }] }); // Mock axios response
  axios.post.mockResolvedValue({ data: { message: 'Item added to cart' } }); // Mock post request
});

afterEach(() => {
  localStorage.clear();
  window.alert.mockClear(); // Clear the mock alert calls after each test
});

/**
 * This test verifies that the Products component renders correctly,
 * and an item can be successfully added to the cart, displaying an alert message.
 */
test('Render Products component and Add to Cart', async () => {
  render(<Products />);

  // Ensure the Products component has rendered correctly
  await waitFor(() => expect(screen.getByText('Vegetable Market')).toBeInTheDocument());

  // Simulate adding a new item to the cart
  const addButton = await screen.findByText('Add to Cart');
  fireEvent.click(addButton);

  // Check if the alert message is displayed
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Product 1 added to cart!');
  });
});

/**
 * This test verifies that an item can be removed from the cart,
 * and the cart is updated accordingly, ensuring the item is no longer displayed.
 */
test('Remove item from cart', async () => {
  const mockCartItems = [{ id: 1, product: { id: 1, name: 'Product 1', price: 10.0, imageUrl: '/img/product1.jpg' }, quantity: 1, price: 10.0 }];
  getCartItems.mockResolvedValue(mockCartItems); // Mock initial cart items
  removeCartItem.mockResolvedValue({ message: 'Item removed from cart' });

  render(<Cart />);

  // Ensure the Cart component has rendered correctly
  await waitFor(() => expect(screen.getByText('Product 1')).toBeInTheDocument());

  // Simulate removing an item from the cart
  const removeButton = screen.getByText('Remove');
  fireEvent.click(removeButton);

  // Check if the item is removed and the cart is updated
  await waitFor(() => {
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });
});

/**
 * This test verifies that the quantity of an item in the cart can be updated,
 * and the cart is updated accordingly, reflecting the new quantity.
 */
test('Change item quantity in cart', async () => {
  const mockCartItems = [{ id: 1, product: { id: 1, name: 'Product 1', price: 10.0, imageUrl: '/img/product1.jpg' }, quantity: 1, price: 10.0 }];
  getCartItems.mockResolvedValue(mockCartItems); // Mock initial cart items
  updateCartItem.mockResolvedValue({ message: 'Item quantity updated' });

  render(<Cart />);

  // Ensure the Cart component has rendered correctly
  await waitFor(() => expect(screen.getByText('Product 1')).toBeInTheDocument());

  // Simulate changing the quantity of an item in the cart
  const quantityInput = screen.getByDisplayValue('1');
  fireEvent.change(quantityInput, { target: { value: '2' } });

  // Check if the item quantity is updated
  await waitFor(() => {
    expect(quantityInput.value).toBe('2');
  });
});

/**
 * This test verifies that a user can submit a new review for a product,
 * and the submitted review is displayed in the list of reviews for that product.
 */
test('Add review for product', async () => {
  const mockReviews = [];
  getAllReviewsForProduct.mockResolvedValue(mockReviews); // Mock initial reviews
  addReview.mockResolvedValue({ message: 'Review added successfully' });

  render(<ReviewList productId={1} />);

  // Ensure the ReviewList component has rendered correctly
  await waitFor(() => expect(screen.getAllByText('Reviews')[0]).toBeInTheDocument());

  // Simulate adding a new review
  const reviewTextArea = screen.getByPlaceholderText('Write your review here...');
  fireEvent.change(reviewTextArea, { target: { value: 'Great product!' } });

  const starRatingSelect = screen.getByLabelText('Star Rating:');
  fireEvent.change(starRatingSelect, { target: { value: '5' } });

  const submitButton = screen.getByText('Submit Review');
  fireEvent.click(submitButton);

  // Mock fetching the updated reviews
  getAllReviewsForProduct.mockResolvedValue([
    {
      id: 1,
      user_id: 1,
      user: { username: 'testuser' },
      review_text: 'Great product!',
      star_rating: 5,
    },
  ]);

  // Re-render the component to reflect the updated reviews
  render(<ReviewList productId={1} />);

  // Check if the new review is added and displayed
  await waitFor(() => {
    const reviewsContainers = screen.getAllByText('Reviews');
    expect(reviewsContainers.length).toBeGreaterThan(0);
    const reviewContainer = reviewsContainers[0].closest('div');

    const reviewItems = within(reviewContainer).getAllByText('Great product!');
    expect(reviewItems).toHaveLength(1);

    expect(within(reviewContainer).getByText('testuser')).toBeInTheDocument(); // Assuming username is displayed with the review

    const stars = within(reviewContainer).getAllByText('★');
    expect(stars).toHaveLength(5); // Check if 5 stars are displayed
  });
});
