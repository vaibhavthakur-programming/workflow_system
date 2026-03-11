import { createActionGroup, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': props<Record<string, never>>(),
    'Load User From Storage': props<Record<string, never>>(),
    'Set User': props<{ user: User | null }>(),
  },
});
