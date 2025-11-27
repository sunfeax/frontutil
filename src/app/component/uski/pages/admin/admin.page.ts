import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { IPage } from '../../types/pageView';
import { IVisita } from '../../types/visitas';
import { RouterLink } from "@angular/router";
import { RegistroTablaComponent } from '../../components/registro-tabla-private/registro-tabla-private.component';
import { BotoneraRpp } from "../../../shared/botonera-rpp/botonera-rpp";

@Component({
  selector: 'app-admin.page',
  imports: [CommonModule, RouterLink, Paginacion, RegistroTablaComponent, BotoneraRpp],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class UskiAdminPage {
  oPage: IPage<IVisita> | null = null;
  numPage: number = 0;
  numRpp: number = 10;
  rellenaCantidad: number = 5;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

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

  onCantidadChange(value: string) {
    this.rellenaCantidad = +value;
    return false;
  }

  generarFake() {
    this.rellenaOk = null;
    this.rellenaError = null;
    this.rellenando = true;
    this.oVisitasService.rellenaBlog(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.getPage(); // refrescamos listado
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos fake';
        console.error(err);
      }
    });
  }
}
