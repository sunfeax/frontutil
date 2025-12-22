import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IVisita } from '../../types/visitas';
import { VisitasService } from '../../services/visitas.service';
import { switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro-tabla-actions',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './registro-tabla-actions.component.html',
  styleUrl: './registro-tabla-actions.component.css'
})
export class RegistroTablaActionsComponent {
  constructor(
    private oVisitasService: VisitasService,
    private snackBar: MatSnackBar
  ) {}

  @Input() visita!: IVisita;

  onTogglePublish() {
    const nuevoEstado = !this.visita.estaPublicado;
    this.oVisitasService
      .publish({ id: this.visita.id, estaPublicado: nuevoEstado })
      .pipe(switchMap(() => this.oVisitasService.get(this.visita.id)))
      .subscribe({
        next: (visitaActualizada) => {
          Object.assign(this.visita, visitaActualizada);
          const mensaje = visitaActualizada.estaPublicado ? 'Reseña publicada' : 'Reseña ocultada';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
        },
        error: (err) => {
          this.snackBar.open('No se pudo actualizar el estado', 'Cerrar', { duration: 4000 });
          console.error('No se pudo actualizar', err);
        },
      });
  }
}
