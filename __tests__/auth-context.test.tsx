import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/auth-context';

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
      }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

function TestComponent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div>{user ? `User: ${user.email}` : 'Not logged in'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides auth context to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('throws error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    
    consoleError.mockRestore();
  });
});
