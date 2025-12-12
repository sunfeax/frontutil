import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SilvestreService } from '../../../service/silvestre';
import { ISilvestre } from '../../../model/silvestre';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private silvestreService = inject(SilvestreService);

  silvestreForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.silvestreForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1024)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      urlImagen: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1024)]],
    });
  }

  // Formato que acepta el back
  private toLocalDateTime(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`; // ← SIN MILISEGUNDOS
  }

  onSubmit(): void {
    if (!this.silvestreForm.valid) {
      this.silvestreForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const payload: ISilvestre = {
      id: 0,
      titulo: this.silvestreForm.value.titulo!,
      descripcion: this.silvestreForm.value.descripcion!,
      urlImagen: this.silvestreForm.value.urlImagen!,
      publicado: false,
      fechaCreacion: this.toLocalDateTime(), 
      fechaModificacion: null,
    };

    this.silvestreService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/silvestre/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la imagen';
        console.error(err);
      },
    });
  }

  get titulo() {
    return this.silvestreForm.get('titulo');
  }

  get descripcion() {
    return this.silvestreForm.get('descripcion');
  }

  get urlImagen() {
    return this.silvestreForm.get('urlImagen');
  }
}
