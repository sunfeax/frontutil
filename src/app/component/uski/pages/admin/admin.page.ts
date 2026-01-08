import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas.service';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { IPage } from '../../types/pageView';
import { IVisita } from '../../types/visitas';
import { RouterLink } from "@angular/router";
import { RegistroTablaComponent } from '../../components/registro-tabla-private/registro-tabla-private.component';
import { BotoneraRpp } from "../../../shared/botonera-rpp/botonera-rpp";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin.page',
  imports: [
    CommonModule,
    RouterLink,
    Paginacion,
    RegistroTablaComponent,
    BotoneraRpp,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class UskiAdminPage {
  oPage: IPage<IVisita> | null = null;
  numPage: number = 0;
  numRpp: number = 10;
  rellenaCantidad: number = 5;
  rellenando: boolean = false;
  deletingAll: boolean = false;
  column: string = 'id';
  direction: 'asc' | 'desc' = 'asc';
  totalElementsCount: number = 0;

  constructor(
    private oVisitasService: VisitasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oVisitasService.getPageAdmin(this.numPage, this.numRpp, this.column, this.direction).subscribe({
      next: (data: IPage<IVisita>) => {
        this.oPage = data;
        this.totalElementsCount = data.totalElements ?? 0;
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.snackBar.open('Error cargando los registros', 'Cerrar', { duration: 4000 });
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

  setSortColumn(column: string) {
    this.column = column;
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    this.getPage()
    return false;
  }

  generarFake() {
    this.rellenando = true;
    this.snackBar.open(`Generando ${this.rellenaCantidad} registros...`, 'Cerrar', { duration: 4000 });
    this.oVisitasService.rellenaBlog(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.getPage(); // refrescamos listado
        this.snackBar.open(`Generados ${count} registros.`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.snackBar.open('Error generando datos', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  deleteAll() {
    this.deletingAll = true;
    this.snackBar.open('Borrando todos los registros...', 'Cerrar', { duration: 4000 });
    this.oVisitasService.deleteAll().subscribe({
      next: (count: number) => {
        this.deletingAll = false;
        this.getPage();
        this.snackBar.open(`La tabla está vacia.`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.deletingAll = false;
        this.snackBar.open('Error eliminando registros', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  confirmDeleteDB(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Vaciar todos los datos',
          message: '¿Está seguro de que desea borrar TODOS los registros? Esta acción es irreversible.'
        }
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteAll();
      }
    });
  }
}
