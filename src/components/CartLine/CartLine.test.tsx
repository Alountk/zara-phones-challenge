import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartLine from './CartLine';
import { CartItem } from '@/types/cart';

const baseItem: CartItem = {
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

describe('CartLine', () => {
  it('renders name, storage, color and price', () => {
    render(<CartLine item={baseItem} onRemove={jest.fn()} />);

    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('only shows the quantity when it is greater than 1', () => {
    const { rerender } = render(<CartLine item={baseItem} onRemove={jest.fn()} />);
    expect(screen.queryByText(/^x\d+$/)).not.toBeInTheDocument();

    rerender(<CartLine item={{ ...baseItem, quantity: 3 }} onRemove={jest.fn()} />);
    expect(screen.getByText('x3')).toBeInTheDocument();
  });

  it('calls onRemove with the item id when Remove is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(<CartLine item={baseItem} onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith('phone-1-128GB-Black');
  });

  it('renders a placeholder instead of an invalid image when imageUrl is empty', () => {
    render(<CartLine item={{ ...baseItem, imageUrl: '' }} onRemove={jest.fn()} />);

    expect(screen.getByText('Image not available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not log to the console when rendered with a valid image (regression: missing sizes warning)', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CartLine item={baseItem} onRemove={jest.fn()} />);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
