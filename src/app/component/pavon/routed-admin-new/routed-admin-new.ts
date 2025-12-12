import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PavonService } from '../../../service/pavon/recurso';
import { IRecurso } from '../../../model/pavon/recurso';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNewPavon implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private pavonService = inject(PavonService);

  recursoForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.recursoForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1024)
      ]],
      url: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      publico: [false],
    });
  }

  onSubmit(): void {
    if (!this.recursoForm.valid) {
      this.recursoForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IRecurso> = {
      nombre: this.recursoForm.value.nombre,
      url: this.recursoForm.value.url,
      publico: this.recursoForm.value.publico,
    };

    this.pavonService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/recurso/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el recurso';
        console.error(err);
      },
    });
  }

  get nombre() {
    return this.recursoForm.get('nombre');
  }

  get url() {
    return this.recursoForm.get('url');
  }

  get publico() {
    return this.recursoForm.get('publico');
  }
}
