import { render } from '@testing-library/react';
import { Header } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe('Header Component', () => {
  it('Renders correctly', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Posts')).toBeInTheDocument();
  });
});
