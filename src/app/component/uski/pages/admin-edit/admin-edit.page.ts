import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VisitasService } from '../../services/visitas.service';
import { IVisita } from '../../types/visitas';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-edit.page',
  imports: [ReactiveFormsModule, RouterLink, MatDialogModule, MatSnackBarModule],
  templateUrl: './admin-edit.page.html',
  styleUrl: './admin-edit.page.css',
})
export class UskiAdminEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private visitasService = inject(VisitasService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  visitaForm!: FormGroup;
  visitaId: number | null = null;
  loading: boolean = true;
  error: string | null = null;
  submitting: boolean = false;
  private originalRecord: IVisita | null = null;

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = Number(idParam);

      if (idParam === null || Number.isNaN(id)) {
        this.loading = false;
        this.error = 'ID de registro no válido';
        return;
      }

      this.visitaId = id;
      this.loadVisita(id);
    });
  }

  initForm(): void {
    this.visitaForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)]],
      comentario: ['', [
        Validators.required,
        Validators.minLength(25),
        Validators.maxLength(1024)]],
      estaPublicado: [false]
    });
  }

  loadVisita(id: number): void {
    this.visitasService.get(id).subscribe({
      next: (visita: IVisita) => {
        this.originalRecord = visita;
        this.visitaForm.patchValue({
            nombre: visita.nombre,
            comentario: visita.comentario,
            estaPublicado: visita.estaPublicado,
        });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error al cargar el registro';
        this.loading = false;
        this.snackBar.open('Error al cargar el registro', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (!this.visitaForm.valid || !this.visitaId) {
      this.visitaForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IVisita> = {
      id: this.visitaId!,
      nombre: this.visitaForm.value.nombre,
      comentario: this.visitaForm.value.comentario,
      estaPublicado: this.visitaForm.value.estaPublicado
    };

    this.visitasService.update(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Registro actualizado correctamente', 'Cerrar', { duration: 4000 });
        if (this.visitaForm) {
          this.visitaForm.markAsPristine();
        }
        this.router.navigate(['/visitas/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al guardar el registro';
        this.snackBar.open('Error al guardar el registro', 'Cerrar', { duration: 4000 });
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
