import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/plist';
import { IPalomares } from '../../../model/palomares';
import { PalomaresService } from '../../../service/palomares';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { UnroutedUserView2 } from "../unrouted-user-view2/unrouted-user-view2";


@Component({
  selector: 'app-routed-user-plist',
  imports: [CommonModule, Paginacion, UnroutedUserView2],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class RoutedUserPlist {
  oPage: IPage<IPalomares> | null = null;
  numPage: number = 0;
  numRpp: number = 2;
  // contador actual de elementos en la tabla pública
  totalElementsCount: number = 0;

  constructor(private oPalomaresService: PalomaresService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oPalomaresService.getPage(0, 1000, 'fechaCreacion', 'desc').subscribe({
      next: (data: IPage<IPalomares>) => {
        // Filtrar solo las tareas publicadas
        const todasPublicadas = data.content ? data.content.filter(tarea => tarea.publicado) : [];
        
        // Calcular paginación manual
        const inicio = this.numPage * this.numRpp;
        const fin = inicio + this.numRpp;
        const paginaActual = todasPublicadas.slice(inicio, fin);
        
        // Crear objeto de página con los datos paginados
        this.oPage = {
          content: paginaActual,
          totalElements: todasPublicadas.length,
          totalPages: Math.ceil(todasPublicadas.length / this.numRpp),
          size: this.numRpp,
          number: this.numPage
        } as IPage<IPalomares>;
        
        this.totalElementsCount = todasPublicadas.length;
        
        // OJO! si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
        if (this.numPage > 0 && this.numPage >= this.oPage.totalPages) {
          this.numPage = this.oPage.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.getPage();
    return false;
  }

  onRppChange(n: number) {
    this.numRpp = n;
    this.getPage();
    return false;
  }
}
