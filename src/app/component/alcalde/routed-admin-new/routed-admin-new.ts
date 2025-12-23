import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { CanComponentDeactivate } from '../../../guards/pending-changes.guard';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-alcalde-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class AlcaldeRoutedAdminNew implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(AlcaldeService);
  private dialog = inject(MatDialog);

  form!: FormGroup;
  submitting = false;
  error: string | null = null;
  private formSubmitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      autor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      genero: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      reseña: ['', [Validators.required, Validators.minLength(20)]],
      valoracion: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      publicado: [true],
      destacado: [false],
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.formSubmitted || !this.form.dirty) {
      return true;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cambios sin guardar',
        message: 'Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?'
      }
    });
    return ref.afterClosed();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IAlcalde> = {
      titulo: this.form.value.titulo,
      autor: this.form.value.autor,
      genero: this.form.value.genero,
      reseña: this.form.value.reseña,
      valoracion: Number(this.form.value.valoracion),
      publicado: this.form.value.publicado,
      destacado: this.form.value.destacado,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.formSubmitted = true;
        this.router.navigate(['/alcalde/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'No se pudo guardar la lectura';
        console.error(err);
      }
    });
  }

  get titulo() { return this.form.get('titulo'); }
  get autor() { return this.form.get('autor'); }
  get genero() { return this.form.get('genero'); }
  get valoracion() { return this.form.get('valoracion'); }
}
