import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneHero from './PhoneHero';
import { NormalizedPhoneDetail } from '@/types/phone';

const addItemMock = jest.fn();

jest.mock('@/context/CartContext', () => ({
  useCart: () => ({ addItem: addItemMock }),
}));

const phone: NormalizedPhoneDetail = {
  id: 'phone-1',
  brand: 'Apple',
  name: 'iPhone 15',
  description: 'A phone.',
  rating: 4.5,
  specs: { Screen: '6.1"' },
  basePrice: 999,
  colorOptions: [
    { name: 'Black', hexCode: '#000000', imageUrl: 'https://example.com/black.jpg' },
    { name: 'White', hexCode: '#ffffff', imageUrl: 'https://example.com/white.jpg' },
  ],
  storageOptions: [
    { capacity: '128GB', price: 999 },
    { capacity: '256GB', price: 1099 },
  ],
  similarProducts: [],
};

describe('PhoneHero', () => {
  beforeEach(() => {
    addItemMock.mockClear();
  });

  it('disables ADD by default and enables it once storage and color are selected', async () => {
    const user = userEvent.setup();
    render(<PhoneHero phone={phone} />);

    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '128GB' }));
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Black' }));
    expect(addButton).toBeEnabled();
  });

  it('toggles aria-pressed on storage pills and color swatches as selections change', async () => {
    const user = userEvent.setup();
    render(<PhoneHero phone={phone} />);

    const pill128 = screen.getByRole('button', { name: '128GB' });
    const pill256 = screen.getByRole('button', { name: '256GB' });
    expect(pill128).toHaveAttribute('aria-pressed', 'false');

    await user.click(pill128);
    expect(pill128).toHaveAttribute('aria-pressed', 'true');
    expect(pill256).toHaveAttribute('aria-pressed', 'false');

    const swatchBlack = screen.getByRole('button', { name: 'Black' });
    const swatchWhite = screen.getByRole('button', { name: 'White' });
    expect(swatchBlack).toHaveAttribute('aria-pressed', 'false');

    await user.click(swatchBlack);
    expect(swatchBlack).toHaveAttribute('aria-pressed', 'true');
    expect(swatchWhite).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls addItem with the selected storage and color when ADD is clicked', async () => {
    const user = userEvent.setup();
    render(<PhoneHero phone={phone} />);

    await user.click(screen.getByRole('button', { name: '256GB' }));
    await user.click(screen.getByRole('button', { name: 'White' }));
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(addItemMock).toHaveBeenCalledWith({
      id: 'phone-1-256GB-White',
      phoneId: 'phone-1',
      name: 'iPhone 15',
      brand: 'Apple',
      imageUrl: 'https://example.com/white.jpg',
      price: 1099,
      storage: '256GB',
      color: 'White',
    });
  });

  it('updates the displayed image based on the selected color', async () => {
    const user = userEvent.setup();
    render(<PhoneHero phone={phone} />);

    expect(screen.getByAltText('iPhone 15')).toHaveAttribute(
      'src',
      expect.stringContaining('black.jpg'),
    );

    await user.click(screen.getByRole('button', { name: 'White' }));
    expect(screen.getByAltText('iPhone 15')).toHaveAttribute(
      'src',
      expect.stringContaining('white.jpg'),
    );
  });

  it('renders a placeholder when there are no color images to show', () => {
    render(<PhoneHero phone={{ ...phone, colorOptions: [] }} />);
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });
});
