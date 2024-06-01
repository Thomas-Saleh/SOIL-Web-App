import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../pages/Cart';
import { getCartItems, addCartItem, updateCartItem, removeCartItem } from '../data/repository';
import { decodeJWT } from '../utils/jwtUtils';

// Sample data for tests
let cartItems;
let container;

// Mock functions
jest.mock('../data/repository');
jest.mock('../utils/jwtUtils');

// Runs once before tests to initialize global test data.
beforeAll(() => {
  cartItems = [
    {
      id: 1,
      product: { id: 1, name: 'Test Product 1', price: 10.0, imageUrl: 'test1.jpg' },
      quantity: 2,
    },
    {
      id: 2,
      product: { id: 2, name: 'Test Product 2', price: 20.0, imageUrl: 'test2.jpg' },
      quantity: 1,
    },
  ];

  getCartItems.mockResolvedValue(cartItems);
  decodeJWT.mockReturnValue({ user_id: 1 });
});

// Runs before each test to render the Cart component.
beforeEach(() => {
  const utils = render(<Cart />);
  container = utils.container;
});

// Test rendering the Cart component
test('Render cart component', () => {
  expect(container).toBeInTheDocument();
});

// Test adding an item to the cart
test('Add item to the cart', async () => {
  // Define a new item to add
  const newItem = {
    product: { id: 3, name: 'Test Product 3', price: 30.0, imageUrl: 'test3.jpg' },
    quantity: 1,
  };

  // Mock the addCartItem function to resolve with the new item
  addCartItem.mockResolvedValue({ id: 3, ...newItem });

  // Find the button to add the item and simulate a click
  const addButton = screen.getByText('Add to Cart');
  fireEvent.click(addButton);

  // Check if addCartItem was called with the correct parameters
  expect(addCartItem).toHaveBeenCalledWith({
    user_id: 1,
    product_id: 3,
    quantity: 1,
    price: 30.0,
  });

  // Re-fetch the cart items to include the new item
  cartItems.push({ id: 3, ...newItem });
  getCartItems.mockResolvedValue(cartItems);

  // Re-render the Cart component
  const utils = render(<Cart />);
  container = utils.container;

  // Check if the new item is present in the cart
  expect(container).toHaveTextContent('Test Product 3');
  expect(container).toHaveTextContent('Quantity: 1');
  expect(container).toHaveTextContent('Total Price: $30.00');
});

// Test updating the quantity of an item in the cart
test('Update item quantity in the cart', async () => {
  // Get the input field for the quantity of the first item
  const input = screen.getAllByRole('spinbutton')[0];

  // Simulate input to change quantity
  fireEvent.change(input, { target: { value: 3 } });

  // Check if updateCartItem was called with the correct parameters
  expect(updateCartItem).toHaveBeenCalledWith(1, 3);

  // Check if the input field value is updated correctly
  expect(input.value).toBe('3');
});

// Test removing an item from the cart
test('Remove item from the cart', async () => {
  // Find the remove button for the first item and simulate a click
  const removeButton = screen.getAllByText('Remove')[0];
  fireEvent.click(removeButton);

  // Check if removeCartItem was called with the correct parameters
  expect(removeCartItem).toHaveBeenCalledWith(1);

  // Update the cart items to remove the first item and re-fetch
  cartItems.shift();
  getCartItems.mockResolvedValue(cartItems);

  // Re-render the Cart component
  const utils = render(<Cart />);
  container = utils.container;

  // Check if the first item is removed from the cart
  expect(container).not.toHaveTextContent('Test Product 1');
});
