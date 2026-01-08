import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SemperteguiService } from '../../../service/sempertegui/sempertegui.service';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmLeaveDialog } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sempertegui-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sempertegui-routed-admin-new.html',
  styleUrl: './sempertegui-routed-admin-new.css',
})
export class SemperteguiRoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private semperteguiService = inject(SemperteguiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  movieForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.movieForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      sinopsis: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1024)
      ]],
      generos: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      director: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      puntuacion: [50, [
        Validators.min(0),
        Validators.max(100)
      ]],
      anyo: [null, [
        Validators.required,
        Validators.min(1901),
        Validators.max(2155),
        Validators.pattern('^[0-9]*$')
      ]],
      publicado: [false],
    });
  }

  onSubmit(): void {
    if (!this.movieForm.valid) {
      this.movieForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IPelicula> = {
      titulo: this.movieForm.value.titulo,
      sinopsis: this.movieForm.value.sinopsis,
      generos: this.movieForm.value.generos,
      director: this.movieForm.value.director,
      puntuacion: Number(this.movieForm.value.puntuacion),
      anyo: Number(this.movieForm.value.anyo),
      publicado: this.movieForm.value.publicado,
    };

    this.semperteguiService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        // mark form as pristine so canDeactivate guard won't ask confirmation
        if (this.movieForm) {
          this.movieForm.markAsPristine();
        }
        // inform the user
        this.snackBar.open('Película añadida correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/sempertegui/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el registro';
        this.snackBar.open('Error al crear el registro', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  // Guard: ask confirmation if the form has unsaved changes
  canDeactivate(): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {
    if (!this.movieForm || !this.movieForm.dirty) {
      return true;
    }
    const dialogRef = this.dialog.open(ConfirmLeaveDialog);
    return dialogRef.afterClosed();
  }

  get titulo() {
    return this.movieForm.get('titulo');
  }
  get sinopsis() {
    return this.movieForm.get('sinopsis');
  }

  get generos() {
    return this.movieForm.get('generos');
  }

  get director() {
    return this.movieForm.get('director');
  }

  get puntuacion() {
      return this.movieForm.get('puntuacion');
  }
  
  get anyo() {
    return this.movieForm.get('anyo');
  }

  get publicado() {
    return this.movieForm.get('publicado');
  }
}
