import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { IPage } from '../../types/pageView';
import { IVisita } from '../../types/visitas';
import { RouterLink } from "@angular/router";
import { RegistroTablaComponent } from '../../components/registro-tabla-private/registro-tabla-private.component';

@Component({
  selector: 'app-admin.page',
  imports: [CommonModule, RouterLink, Paginacion, RegistroTablaComponent],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class UskiAdminPage {
  oPage: IPage<IVisita> | null = null;
  numPage: number = 0;
  numRpp: number = 10;

  constructor(private oVisitasService: VisitasService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oVisitasService.getPagePrivate(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
      next: (data: IPage<IVisita>) => {
        this.oPage = data;
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
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
