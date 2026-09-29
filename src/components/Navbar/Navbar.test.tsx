import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

let mockItemCount = 0;

jest.mock('@/context/CartContext', () => ({
  useCart: () => ({ itemCount: mockItemCount }),
}));

describe('Navbar', () => {
  beforeEach(() => {
    mockItemCount = 0;
  });

  it('links the logo to home and the cart icon to /cart', () => {
    render(<Navbar />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/cart');
  });

  it('shows the item count next to the cart icon', () => {
    mockItemCount = 3;
    render(<Navbar />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('uses the empty cart icon when there are no items', () => {
    render(<Navbar />);

    expect(screen.getByAltText('cart')).toHaveAttribute('src', expect.stringContaining('cart.svg'));
  });

  it('uses the filled cart icon when there are items', () => {
    mockItemCount = 2;
    render(<Navbar />);

    expect(screen.getByAltText('cart')).toHaveAttribute(
      'src',
      expect.stringContaining('cart_black.svg'),
    );
  });
});
