import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { IRecurso } from '../../../model/pavon/recurso';
import { PavonService } from '../../../service/pavon/recurso';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlistPavon {
  oPage: IPage<IRecurso> | null = null;
  numPage: number = 0;
  numRpp: number = 5;

  constructor(private oPavonService: PavonService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oPavonService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<IRecurso>) => {
        this.oPage = data;
        // si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
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
