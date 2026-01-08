import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPage } from '../../model/plist';
import { ITablon } from '../../model/tablon';
import { TablonService } from '../../service/tablon';
import { Paginacion } from "../../../shared/paginacion/paginacion";
import { UnroutedUserView2 } from "../unrouted-user-view2/unrouted-user-view2";
import { SessionService } from '../../../../service/session.service';


@Component({
  selector: 'app-routed-user-plist',
  imports: [Paginacion, UnroutedUserView2],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class RoutedUserPlist {
  oPage: IPage<ITablon> | null = null;
  numPage: number = 0;
  numRpp: number = 1;
  isAdmin: boolean = false;

  constructor(
    private oTablonService: TablonService,
    private router: Router,
    private sessionService: SessionService
  ) {
    // Considera admin si el username es 'admin' (ajusta según tu backend)
    const token = this.sessionService.getToken();
    if (token) {
      const jwt = this.sessionService.parseJWT(token);
      this.isAdmin = jwt.username === 'admin';
    }
  }

  volver() {
    this.router.navigate(['']);
  }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    if (this.isAdmin) {
      this.oTablonService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
        next: (data: IPage<ITablon>) => {
          console.log('Respuesta backend getPage (admin en tablon):', data);
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
    } else {
      this.oTablonService.getPublicPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
        next: (data: IPage<ITablon>) => {
          console.log('Respuesta backend getPublicPage:', data);
          const filteredContent = data.content.filter(post => post.publico === true);
          this.oPage = {
            ...data,
            content: filteredContent,
            numberOfElements: filteredContent.length
          };
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
