import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Login } from './login';
import { AuthActions } from '../../../core/store/auth/auth.actions';
import { ThemeService } from '../../../core/services/theme.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let storeSpy: jasmine.SpyObj<Store<unknown>>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store<unknown>>('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of(null));

    const themeServiceStub: Partial<ThemeService> = {
      isDark: of(false) as any,
      toggleTheme: () => {},
      setTheme: () => {},
    } as any;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: ThemeService, useValue: themeServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not dispatch login when form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });

    component.onSubmit();

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch login action with form values when form is valid', () => {
    const creds = { email: 'admin@test.com', password: 'secret' };
    component.loginForm.setValue(creds);

    component.onSubmit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      AuthActions.login({ email: creds.email, password: creds.password })
    );
  });
});
