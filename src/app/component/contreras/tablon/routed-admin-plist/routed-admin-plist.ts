import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../model/plist';
import { ITablon } from '../../model/tablon';
import { TablonService } from '../../service/tablon';
import { Paginacion } from "../../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../../pipe/datetime-pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe, FormsModule],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlist {
  // GESTION FILTRADOS TABLA
  get postsTablaFiltrada(): ITablon[] {
    if (this.filtro.trim()) {
      return this.postsFiltrados;
    }
    return this.oPage?.content || [];
  }
    filtro: string = '';
      filtroInput: string = '';
    postsFiltrados: ITablon[] = [];

  // filtrar posts
  filtrar() {
    this.filtro = this.filtroInput;
    if (this.filtro.trim()) {
      // Filtrar numero posts total, getpage antes
      this.oTablonService.getPage(0, 10000).subscribe({
        next: (data) => {
          const posts = data.content || [];
          const filtroLower = this.filtro.toLowerCase();
          this.postsFiltrados = posts.filter(post =>
            post.etiquetas?.toLowerCase().includes(filtroLower)
          );
        },
        error: (error: HttpErrorResponse) => {
          alert('Error al filtrar los posts');
          console.error(error);
        }
      });
    } else {
      this.postsFiltrados = [];
    }
  }

  // quitar filtros
  quitarFiltro() {
    this.filtro = '';
    this.filtroInput = '';
    this.getPage(); //
  }


  oPage: IPage<ITablon> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  numRellenar: number = 10;
  
  // Borrar todos los posts
  borrarTodos() {
    if (confirm('¿Seguro que quieres borrar todos los posts?')) {
      this.oTablonService.deleteAll().subscribe({
        next: () => {
          this.getPage();
        },
        error: (error: HttpErrorResponse) => {
          alert('Error al borrar todos los posts');
          console.error(error);
        },
      });
    }
  }

  // Rellenar con posts
  rellenarTablon(num: number) {
    // En caso de meter demasiados de golpe, aviso usuario
    if (num > 150) {
      const nSuperior = confirm('Estás mandando muchas peticiones, ¿seguro que quieres continuar? Puedes sobrecargar la base de datos.');
      if (!nSuperior) return;
    }
    if (num > 0) {
      this.oTablonService.rellenaTablon(num).subscribe({
        next: () => {
          this.getPage();
        },
        error: (error: HttpErrorResponse) => {
          alert('Error al rellenar el tablón');
          console.error(error);
        },
      });
    }
  }

  constructor(private oTablonService: TablonService, private router: Router) { }
  volver() {
    this.router.navigate(['']);
  }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  // Paginacion de posts normal
  getPage() {
    this.oTablonService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<ITablon>) => {
        console.log('Respuesta backend getPage (admin):', data);
        this.oPage = data;
        this.postsFiltrados = [];
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
