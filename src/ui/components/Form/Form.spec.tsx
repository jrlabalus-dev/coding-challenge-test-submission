import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

describe('<Form />', () => {
  const mockOnChange = jest.fn();
  const mockOnFormSubmit = jest.fn((e) => e.preventDefault());

  const formEntries = [
    { name: 'keyA', placeholder: 'placeholderA' },
    { name: 'keyB', placeholder: 'placeholderB' },
  ];

  const values = { keyA: '', keyB: '' };
  const errors = { keyA: 'keyA is required' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with label', () => {
    render(
      <Form
        label="Test Form"
        formEntries={formEntries}
        onFormSubmit={mockOnFormSubmit}
        submitText="Submit"
        values={values}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    render(
      <Form
        label="Test Form"
        formEntries={formEntries}
        onFormSubmit={mockOnFormSubmit}
        submitText="Submit"
        values={values}
        onChange={mockOnChange}
      />
    );

    await userEvent.type(screen.getByPlaceholderText('placeholderA'), 'John');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onFormSubmit when form is submitted', async () => {
    render(
      <Form
        label="Test Form"
        formEntries={formEntries}
        onFormSubmit={mockOnFormSubmit}
        submitText="Submit"
        values={values}
        onChange={mockOnChange}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mockOnFormSubmit).toHaveBeenCalled();
  });

  it('renders errors when provided', () => {
    render(
      <Form
        label="Test Form"
        formEntries={formEntries}
        onFormSubmit={mockOnFormSubmit}
        submitText="Submit"
        values={values}
        onChange={mockOnChange}
        errors={errors}
      />
    );

    expect(screen.getByText('keyA is required')).toBeInTheDocument();
  });

  it('shows loading state on button', () => {
    render(
      <Form
        label="Test Form"
        formEntries={formEntries}
        onFormSubmit={mockOnFormSubmit}
        submitText="Submit"
        values={values}
        onChange={mockOnChange}
        loading
      />
    );

    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('disabled');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
