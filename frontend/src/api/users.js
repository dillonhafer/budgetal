import { _post, _put } from 'api';

export function RegisterRequest({ email, password }) {
  return _post('/register', { email, password });
}

export function PasswordResetRequest({ email }) {
  return _post('/reset-password', { email });
}

export function ResetPasswordRequest({ password, reset_password_token }) {
  return _put('/reset-password', { password, reset_password_token });
}
