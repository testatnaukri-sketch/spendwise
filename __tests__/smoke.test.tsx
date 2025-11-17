import { render, screen } from '@testing-library/react';
import SignInPage from '@/app/auth/sign-in/page';
import SignUpPage from '@/app/auth/sign-up/page';

jest.mock('@/lib/actions/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  resetPasswordRequest: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('Smoke Tests - Authentication Pages Render', () => {
  it('sign-in page renders without crashing', () => {
    render(<SignInPage />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('sign-up page renders without crashing', () => {
    render(<SignUpPage />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('sign-in form has all required fields', () => {
    render(<SignInPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('sign-up form has all required fields', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
