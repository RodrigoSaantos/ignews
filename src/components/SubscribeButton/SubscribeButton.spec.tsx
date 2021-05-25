import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router');

describe('SubscribeButton Component', () => {
  it('Renders correctly ', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SubscribeButton />);
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('Redirects user to sing in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('Redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
        activeSubscription: 'fake-test',
        expires: 'fake-test',
      },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith('posts');
  });
});
