import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { ActivatedRoute, Router } from '@angular/router';
import { UnroutedAlcanyizAdminView } from "../unrouted-alcanyiz-admin-view/unrouted-alcanyiz-admin-view";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routed-alcanyiz-admin-remove',
  imports: [UnroutedAlcanyizAdminView, MatSnackBarModule],
  templateUrl: './routed-alcanyiz-admin-remove.html',
  styleUrl: './routed-alcanyiz-admin-remove.css',
})
export class RoutedAlcanyizAdminRemove {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private questionService = inject(jsQuestionService);
  private snackBar = inject(MatSnackBar);

  oQuestion: questionModel | null = null;
  loading: boolean = true;
  error: string | null = null;
  deleting: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(+id);
  }

  load(id: number) {
    this.questionService.get(id).subscribe({
      next: (data: questionModel) => {
        this.oQuestion = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando la pregunta';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.oQuestion) return;
    this.deleting = true;
    this.questionService.delete(this.oQuestion.id).subscribe({
      next: () => {
        this.deleting = false;
        this.snackBar.open('Pregunta borrada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/alcanyiz/questionlist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error al borrar la pregunta';
        this.snackBar.open('Error al borrar la pregunta', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }
  cancel() {
    this.router.navigate(['/alcanyiz/questionlist']);
  }
}
