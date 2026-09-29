import { render, screen } from '@testing-library/react';
import PhoneCard from './PhoneCard';
import { NormalizedPhoneSummary } from '@/types/phone';

const phone: NormalizedPhoneSummary = {
  id: 'phone-1',
  brand: 'Apple',
  name: 'iPhone 15',
  basePrice: 999,
  imageUrl: 'https://example.com/black.jpg',
};

describe('PhoneCard', () => {
  it('renders brand, name, price and links to the detail page', () => {
    render(<PhoneCard phone={phone} isPriority={false} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/phone/phone-1');
  });

  it('renders an image with the phone name as alt text when imageUrl is set', () => {
    render(<PhoneCard phone={phone} isPriority={false} />);

    expect(screen.getByAltText('iPhone 15')).toBeInTheDocument();
  });

  it('renders a placeholder instead of an image when imageUrl is empty', () => {
    render(<PhoneCard phone={{ ...phone, imageUrl: '' }} isPriority={false} />);

    expect(screen.getByText('Image not available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
