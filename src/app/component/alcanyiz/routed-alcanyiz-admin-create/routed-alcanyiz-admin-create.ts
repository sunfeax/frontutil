import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-routed-alcanyiz-admin-create',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './routed-alcanyiz-admin-create.html',
  styleUrls: ['./routed-alcanyiz-admin-create.css'],
})
export class RoutedAlcanyizAdminCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private questionService = inject(jsQuestionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  questionForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
      correct: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      tema: ['backend', [Validators.required]],
      publicada: [false]
    });
  }

  onSubmit(): void {
    
    if (!this.questionForm.valid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<questionModel> = {
      question: this.questionForm.value.question,
      answer1: this.questionForm.value.answer1,
      answer2: this.questionForm.value.answer2,
      answer3: this.questionForm.value.answer3,
      answer4: this.questionForm.value.answer4,
      correct: Number(this.questionForm.value.correct),
      tema: this.questionForm.value.tema,
  publicado: !!this.questionForm.value.publicada,
    };

    this.questionService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        if (this.questionForm) {
          this.questionForm.markAsPristine();
        }

        this.snackBar.open('Pregunta creada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/alcanyiz/questionlist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la pregunta';
        console.error(err);
      },
    });
  }

  canDeactivate(): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {

      if (!this.questionForm || !this.questionForm.dirty) {
        return true;
      }
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Cambios por guardar',
          message: 'Se borrarán los datos de la pregunta. ¿Seguro que desea salir?'
        }
      });
      return ref.afterClosed();
    }

  get question() {
    return this.questionForm.get('question');
  }

  get answer1() {
    return this.questionForm.get('answer1');
  }
  get answer2() {
    return this.questionForm.get('answer2');
  }
  get answer3() {
    return this.questionForm.get('answer3');
  }
  get answer4() {
    return this.questionForm.get('answer4');
  }

  get correct() {
    return this.questionForm.get('correct');
  }

  get tema() {
    return this.questionForm.get('tema');
  }

  get publicada() {
    return this.questionForm.get('publicada');
  }
}

