import { login } from '../src/js/api/auth/login.js';
import { logout } from '../src/js/api/auth/logout.js';
import * as storage from '../src/js/storage/index.js';

// Mock the storage functions before running the tests
jest.mock('../src/js/storage/index.js');

describe('Auth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  test('login function stores a token when provided with valid credentials', async () => {
    // Mock the fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ accessToken: 'mockAccessToken' }),
      })
    );

    // Call the login function
    const profile = await login('test@example.com', 'password');

    // Verify that the token is saved
    expect(storage.save).toHaveBeenCalledWith('token', 'mockAccessToken');
    expect(storage.save).toHaveBeenCalledWith('profile', profile);
  });

  test('logout function clears the token and profile from storage', () => {
    logout();

    // Verify that the token and profile are removed
    expect(storage.remove).toHaveBeenCalledWith('token');
    expect(storage.remove).toHaveBeenCalledWith('profile');
  });
});
