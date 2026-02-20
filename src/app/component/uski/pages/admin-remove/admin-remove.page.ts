import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas.service';
import { IVisita } from '../../types/visitas';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-remove-page',
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './admin-remove.page.html',
  styleUrl: './admin-remove.page.css',
})
export class UskiAdminRemovePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitasService = inject(VisitasService);
  private snackBar = inject(MatSnackBar);

  oVisita: IVisita | null = null;
  loading = true;
  error: string | null = null;
  deleting = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }

    this.load(id);
  }

  load(id: number) {
    this.visitasService.get(id).subscribe({
      next: (data: IVisita) => {
        this.oVisita = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando el registro';
        this.loading = false;
        this.snackBar.open('Error cargando el registro', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  confirmDelete() {
    if (!this.oVisita) return;
    this.deleting = true;
    this.visitasService.delete(this.oVisita.id).subscribe({
      next: () => {
        this.deleting = false;
        this.snackBar.open('Registro borrado correctamente', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/visitas/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el registro';
        this.snackBar.open('Error borrando el registro', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/visitas/dashboard']);
  }
}
