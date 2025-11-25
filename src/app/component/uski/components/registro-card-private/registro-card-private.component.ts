import { Component, Input } from '@angular/core';
import { IVisita } from '../../types/visitas';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas';

@Component({
  selector: 'app-registro-card-private',
  imports: [CommonModule],
  templateUrl: './registro-card-private.component.html',
  styleUrl: './registro-card-private.component.css',
  standalone: true
})
export class RegistroCardPrivateComponent {
  constructor(private oVisitasService: VisitasService) {}

  @Input() oVisita!: IVisita;

  onTogglePublish(visita: IVisita) {
    const nuevoEstado = !visita.estaPublicado;
    this.oVisitasService.update({ id: visita.id, estaPublicado: nuevoEstado}).subscribe({
      next: () => visita.estaPublicado = nuevoEstado,
      error: (err) => console.error('No se pudo actualizar', err)
    });
  }
}
