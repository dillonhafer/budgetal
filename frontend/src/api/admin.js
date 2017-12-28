import { _get, _post } from 'api';

export function AdminUsersRequest() {
  return _get(`/admin/users`);
}

export function AdminTestEmailRequest() {
  return _get(`/admin/test-email`);
}

export function AdminErrorRequest() {
  return _get(`/admin/error`);
}

export function AdminTestPushNotificationRequest({ title, body }) {
  return _post(`/admin/test-push-notification`, { title, body });
}
