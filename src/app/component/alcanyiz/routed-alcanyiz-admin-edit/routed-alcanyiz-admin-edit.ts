import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { FormBuilder, FormGroup, ReactiveFormsModule,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routed-alcanyiz-admin-edit',
  imports: [RouterLink, ReactiveFormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './routed-alcanyiz-admin-edit.html',
  styleUrl: './routed-alcanyiz-admin-edit.css',
})
export class RoutedAlcanyizAdminEdit {

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private questionService = inject(jsQuestionService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    questionForm!: FormGroup;
    questionId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalQuestion: questionModel | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.questionId = +id;
            this.loadQuestion(+id);
        } else {
            this.loading = false;
            this.error = 'ID de post no válido';
        }
    }

    initForm(): void {
        this.questionForm = this.fb.group({
            question: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            answer1: ['', [Validators.required]],
            answer2: ['', [Validators.required]],
            answer3: ['', [Validators.required]],
            answer4: ['', [Validators.required]],
            correct: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
            tema: ['backend', [Validators.required]],
            publicado: [false]
        });
    }

    loadQuestion(id: number): void {
        this.questionService.get(id).subscribe({
            next: (question: questionModel) => {
                this.originalQuestion = question;
                this.questionForm.patchValue({
                    question: question.question,
                    answer1: question.answer1,
                    answer2: question.answer2,
                    answer3: question.answer3,
                    answer4: question.answer4,
                    correct: question.correct,
                    tema: (question as any).tema ?? 'backend',
                    publicado: !!(question as any).publicado
                });
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = 'Error al cargar la pregunta';
                this.loading = false;
                console.error(err);
            },
        });
    }

    onSubmit(): void {

        if (!this.questionForm.valid || !this.questionId) {
            this.questionForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<questionModel> = {
            id: this.questionId!,
            question: this.questionForm.value.question,
            answer1: this.questionForm.value.answer1,
            answer2: this.questionForm.value.answer2,
            answer3: this.questionForm.value.answer3,
            answer4: this.questionForm.value.answer4,
            correct: Number(this.questionForm.value.correct),
            tema: this.questionForm.value.tema,
            publicado: !!this.questionForm.value.publicado,
        };

        this.questionService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                if (this.questionForm) {
                        this.questionForm.markAsPristine();
                }
                this.snackBar.open('Pregunta editada correctamente', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/alcanyiz/questionlist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar la pregunta';
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
                title: 'Cambios sin guardar',
                message: 'Se van a revertir los cambios. ¿Seguro que desea salir?'
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

  get publicado() {
    return this.questionForm.get('publicado');
  }
}
