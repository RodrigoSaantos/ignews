import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton Component', () => {
  it('Renders correctly when is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('Renders correctly when is authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
        expires: 'fake-test',
      },
      false,
    ]);

    render(<SignInButton />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
