import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneSearch from './PhoneSearch';

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/',
}));

describe('PhoneSearch', () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('has an accessible name on the search input', () => {
    render(<PhoneSearch search="" quantityResult={0} />);
    expect(screen.getByRole('textbox', { name: /search for a smartphone/i })).toBeInTheDocument();
  });

  it('does not show the clear button when the input is empty', () => {
    render(<PhoneSearch search="" quantityResult={0} />);
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('shows the clear button once there is text, and clears the input on click', async () => {
    const user = userEvent.setup();
    render(<PhoneSearch search="" quantityResult={0} />);
    const input = screen.getByRole('textbox', { name: /search for a smartphone/i });

    await user.type(input, 'iphone');
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('displays the results count', () => {
    render(<PhoneSearch search="" quantityResult={7} />);
    expect(screen.getByText('7 RESULTS')).toBeInTheDocument();
  });

  it('replaces the URL with the search query after the debounce delay', () => {
    jest.useFakeTimers();
    render(<PhoneSearch search="" quantityResult={0} />);
    const input = screen.getByRole('textbox', { name: /search for a smartphone/i });

    fireEvent.change(input, { target: { value: 'pixel' } });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(replaceMock).toHaveBeenCalledWith('/?search=pixel');
  });

  it('replaces the URL with the bare pathname when the search is cleared', () => {
    jest.useFakeTimers();
    render(<PhoneSearch search="pixel" quantityResult={1} />);
    const clearButton = screen.getByRole('button', { name: /clear search/i });

    fireEvent.click(clearButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
