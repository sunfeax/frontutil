import { Component } from '@angular/core';
import { IPalomares } from '../../../model/palomares';
import { PalomaresService } from '../../../service/palomares';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedUserView } from "../unrouted-user-view/unrouted-user-view";
import { debug } from '../../../environment/environment';

@Component({
  selector: 'app-routed-user-view',
  imports: [UnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class RoutedUserView {
  oPalomares: IPalomares | null = null;
  debugging: boolean = debug;

  constructor(private oPalomaresService: PalomaresService, private route: ActivatedRoute) {
    // Obtener el ID de la tarea desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const tareaId = idParam ? Number(idParam) : NaN;
    if (isNaN(tareaId)) {
      this.debugging && console.error('Invalid tarea id:', idParam);
      return;
    }
    this.getPalomares(tareaId);
  }

  getPalomares(tareaId: number) {
    this.oPalomaresService.get(tareaId).subscribe({
      next: (data: IPalomares) => {
        this.debugging && console.log('📥 Tarea recibida:', data.id, '-', data.titulo);
        this.debugging && console.log('   publicado =', data.publicado, '(tipo:', typeof data.publicado + ')');
        
        // Solo mostrar si está publicada: true, 1, o "1"
        const estaPublicada = data.publicado === true || 
                             data.publicado === 1 || 
                             (data.publicado as any) === "1" ||
                             String(data.publicado) === "1";
        
        if (estaPublicada) {
          this.debugging && console.log('✅ Tarea PUBLICADA - Se mostrará');
          this.oPalomares = data;
        } else {
          this.debugging && console.warn('⛔ Tarea NO PUBLICADA - No se mostrará');
          this.oPalomares = null;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.debugging && console.error('❌ Error al cargar tarea:', error);
      },
    });
  }
}
