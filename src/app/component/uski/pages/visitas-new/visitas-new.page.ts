import { UskiVisitasPage } from './../visitas/visitas.page';
import { VisitasService } from './../../services/visitas';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IVisita } from '../../types/visitas';

@Component({
  selector: 'app-visitas-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './visitas-new.page.html',
  styleUrl: './visitas-new.page.css',
})
export class UskiVisitasNewPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private visitasService = inject(VisitasService);

  visitaForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.visitaForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      comentario: ['', [
        Validators.required,
        Validators.minLength(25),
        Validators.maxLength(1024)
      ]]
    });
  }

  onSubmit(): void {
    if (!this.visitaForm.valid) {
      this.visitaForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IVisita> = {
      nombre: this.visitaForm.value.nombre,
      comentario: this.visitaForm.value.comentario,
    };

    this.visitasService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/visitas']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el post';
        console.error(err);
      },
    });
  }

  get nombre() {
    return this.visitaForm.get('nombre');
  }

  get comentario() {
    return this.visitaForm.get('comentario');
  }
}
