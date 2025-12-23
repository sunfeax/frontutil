import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../model/plist';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { SemperteguiService } from '../../../service/sempertegui/sempertegui.service';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { MovieCardComponent } from "../movie-card/movie-card";
import { SessionService } from '../../../service/session.service';


@Component({
  selector: 'app-sempertegui-routed-user-plist',
  imports: [Paginacion, MovieCardComponent],
  templateUrl: './sempertegui-routed-user-plist.html',
  styleUrl: './sempertegui-routed-user-plist.css',
})
export class SemperteguiRoutedUserPlist {
  oPage: IPage<IPelicula> | null = null;
  numPage: number = 0;
  numRpp: number = 2;
  // contador actual de elementos en la tabla pública
  totalElementsCount: number = 0;
  isSessionActive: boolean = false;

  constructor(private semperteguiService: SemperteguiService, private sessionService: SessionService) { 
    this.isSessionActive = this.sessionService.isSessionActive();
  }

  oBotonera: string[] = [];
  
  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.semperteguiService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
      next: (data: IPage<IPelicula>) => {
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
