import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthActions } from './auth.actions';

export const login$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        authService.login(email, password).pipe(
          map((user) => (user ? AuthActions.loginSuccess({ user }) : AuthActions.loginFailure({ error: 'Invalid credentials' }))),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);

export const loginSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => router.navigate(['/app/dashboard']))
    ),
  { functional: true, dispatch: false }
);

export const logout$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => authService.logout())
    ),
  { functional: true, dispatch: false }
);
