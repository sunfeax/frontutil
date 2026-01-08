import { VisitasService } from '../../services/visitas.service';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IVisita } from '../../types/visitas';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visitas-new',
  imports: [ReactiveFormsModule, RouterLink, MatDialogModule, MatSnackBarModule],
  templateUrl: './visitas-new.page.html',
  styleUrl: './visitas-new.page.css',
})
export class UskiVisitasNewPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private visitasService = inject(VisitasService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
      ]],
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
        this.snackBar.open('Reseña creada correctamente', 'Cerrar', { duration: 4000 });
        if (this.visitaForm) {
          this.visitaForm.markAsPristine();
        }
        this.router.navigate(['/visitas']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la reseña';
        this.snackBar.open('Error al crear la reseña', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  canDeactivate(): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {
    if (!this.visitaForm || !this.visitaForm.dirty) {
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

  get nombre() {
    return this.visitaForm.get('nombre');
  }

  get comentario() {
    return this.visitaForm.get('comentario');
  }
}
