import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../service/login.service';
import { LoginType } from '../../../model/login';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debug } from '../../../environment/environment';
import { SessionService } from '../../../service/session.service';
import { IToken } from '../../../model/token';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;
  debugging: boolean = debug;

  @Inject(SessionService)
  private oSessionService = inject(SessionService);


  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1024)]],
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.error = null;
    this.submitting = true;

    const payload: Partial<LoginType> = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.loginService.create(payload).pipe(
      finalize(() => this.submitting = false)
    ).subscribe({
      next: (data: IToken) => {
        if (!data?.token) {
          this.error = 'Usuario o contraseña incorrectos';
          return;
        }

        // aqui hay que guardarse el token
        this.oSessionService.setToken(data.token);
        this.debugging && console.log('Login successful, token: ', data);
        this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.status === 401 ? 'Usuario o contraseña incorrectos' : 'Error al login';
        this.debugging && console.error(err);
      },
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
