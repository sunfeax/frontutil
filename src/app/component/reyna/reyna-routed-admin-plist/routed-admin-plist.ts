import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { IReyna } from '../../../model/reyna';
import { ReynaService } from '../../../service/reyna';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlist {
  oPage: IPage<IReyna> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  constructor(private oReynaService: ReynaService) {}

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oReynaService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<IReyna>) => {
        this.oPage = data;
        this.rellenaOk = this.oPage.totalElements;
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
    this.oReynaService.rellenaReyna(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.getPage(); // refrescamos listado
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos fake';
        console.error(err);
      },
    });
  }

  togglePublica(oReyna: IReyna) {
    this.oReynaService.togglePublica(oReyna).subscribe({
      next: (id: number) => {
        this.getPage(); // refrescamos listado
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }
}
