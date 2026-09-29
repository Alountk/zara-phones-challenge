import { render, screen } from '@testing-library/react';
import PhoneGrid from './PhoneGrid';
import { NormalizedPhoneSummary } from '@/types/phone';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/',
}));

const phones: NormalizedPhoneSummary[] = [
  { id: 'phone-1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: '' },
  { id: 'phone-2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: '' },
];

describe('PhoneGrid', () => {
  it('shows the "no phones available" empty state when there are no phones and no search', () => {
    render(<PhoneGrid phones={[]} search="" />);

    expect(
      screen.getByText('No phones available right now, please try again later.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Retry' })).toHaveAttribute('href', '/');
  });

  it('shows the "no matches" empty state when there are no phones but a search is active', () => {
    render(<PhoneGrid phones={[]} search="nokia" />);

    expect(screen.getByText('No matches for this search.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reset search' })).toHaveAttribute('href', '/');
  });

  it('renders one card per phone when data is present', () => {
    render(<PhoneGrid phones={phones} search="" />);

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('/phone/')),
    ).toHaveLength(2);
  });
});
