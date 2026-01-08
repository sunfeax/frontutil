import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { CanComponentDeactivate } from '../../../guards/pending-changes.guard';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-alcalde-admin-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-edit.html',
  styleUrl: './routed-admin-edit.css',
})
export class AlcaldeRoutedAdminEdit implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AlcaldeService);
  private dialog = inject(MatDialog);

  form!: FormGroup;
  loading = true;
  submitting = false;
  error: string | null = null;
  entryId: number | null = null;
  private formSubmitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      autor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      genero: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      reseña: ['', [Validators.required, Validators.minLength(20)]],
      valoracion: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      publicado: [true],
      destacado: [false],
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id)) {
      this.entryId = id;
      this.load(id);
    } else {
      this.loading = false;
      this.error = 'Identificador no válido';
    }
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

  load(id: number) {
    this.service.get(id).subscribe({
      next: (data: IAlcalde) => {
        this.form.patchValue({
          titulo: data.titulo,
          autor: data.autor,
          genero: data.genero,
          reseña: data.reseña,
          valoracion: data.valoracion,
          publicado: data.publicado,
          destacado: data.destacado,
        });
        this.form.markAsPristine();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error = 'No se pudo cargar la lectura';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.entryId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IAlcalde> = {
      id: this.entryId,
      titulo: this.form.value.titulo,
      autor: this.form.value.autor,
      genero: this.form.value.genero,
      reseña: this.form.value.reseña,
      valoracion: Number(this.form.value.valoracion),
      publicado: this.form.value.publicado,
      destacado: this.form.value.destacado,
    };

    this.service.update(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.formSubmitted = true;
        this.router.navigate(['/alcalde/plist']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error = 'No se pudo actualizar la lectura';
        this.submitting = false;
      }
    });
  }

  get titulo() { return this.form.get('titulo'); }
  get autor() { return this.form.get('autor'); }
  get genero() { return this.form.get('genero'); }
  get valoracion() { return this.form.get('valoracion'); }
}
