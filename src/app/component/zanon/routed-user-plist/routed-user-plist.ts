import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/plist';
import { IZanon } from '../../../model/zanon/zanon';
import { ZanonService } from '../../../service/zanon/zanon';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { UnroutedUserView2 } from "../unrouted-user-view2/unrouted-user-view2";

@Component({
  selector: 'app-routed-user-plist',
  imports: [CommonModule, Paginacion, UnroutedUserView2],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class RoutedUserPlistZanon {
  oPage: IPage<IZanon> | null = null;
  numPage: number = 0;
  numRpp: number = 2;

  // Contador actual de elementos en la tabla
  totalElementsCount: number = 0;

  constructor(private oZanonService: ZanonService) {

  }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oZanonService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc', true).subscribe({
      next: (data: IPage<IZanon>) => {
        this.oPage = data;
        this.totalElementsCount = data.totalElements ?? 0;

        // OJO! si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
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
