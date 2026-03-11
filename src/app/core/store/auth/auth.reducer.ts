import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { AuthActions } from './auth.actions';

const AUTH_KEY = 'workflow_auth_user';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function getInitialUser(): User | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    error: null,
  })),
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
  }))
);
