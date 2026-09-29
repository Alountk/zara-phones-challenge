import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartView from './CartView';
import { CartItem } from '@/types/cart';

const pushMock = jest.fn();
const removeItemMock = jest.fn();
let mockItems: CartItem[] = [];

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: mockItems,
    itemCount: mockItems.reduce((total, item) => total + item.quantity, 0),
    removeItem: removeItemMock,
  }),
}));

const item1: CartItem = {
  id: 'phone-1-128GB-Black',
  phoneId: 'phone-1',
  name: 'iPhone 15',
  brand: 'Apple',
  imageUrl: 'https://example.com/black.jpg',
  price: 999,
  storage: '128GB',
  color: 'Black',
  quantity: 1,
};

const item2: CartItem = {
  id: 'phone-2-256GB-White',
  phoneId: 'phone-2',
  name: 'Galaxy S24',
  brand: 'Samsung',
  imageUrl: 'https://example.com/white.jpg',
  price: 899,
  storage: '256GB',
  color: 'White',
  quantity: 2,
};

describe('CartView', () => {
  beforeEach(() => {
    pushMock.mockClear();
    removeItemMock.mockClear();
    mockItems = [];
  });

  it('shows no total and no Pay button when the cart is empty', () => {
    render(<CartView />);

    expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    expect(screen.queryByText('Total')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pay' })).not.toBeInTheDocument();
  });

  it('renders one line per item, the correct total and item count', () => {
    mockItems = [item1, item2];
    render(<CartView />);

    expect(screen.getByText('Cart (3)')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('2797 EUR')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay' })).toBeInTheDocument();
  });

  it('navigates home when "Continue shopping" is clicked', async () => {
    const user = userEvent.setup();
    render(<CartView />);

    await user.click(screen.getByRole('button', { name: /continue shopping/i }));
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('calls removeItem with the correct id when removing a line', async () => {
    mockItems = [item1];
    const user = userEvent.setup();
    render(<CartView />);

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(removeItemMock).toHaveBeenCalledWith('phone-1-128GB-Black');
  });
});
