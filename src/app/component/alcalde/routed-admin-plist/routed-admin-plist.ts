import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { IPage } from '../../../model/plist';
import { IAlcalde } from '../../../model/alcalde';
import { AlcaldeService } from '../../../service/alcalde';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-alcalde-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, MatDialogModule, MatSnackBarModule, DatetimePipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class AlcaldeRoutedAdminPlist {
  oPage: IPage<IAlcalde> | null = null;
  numPage = 0;
  numRpp = 5;
  order = 'id';
  direction: 'asc' | 'desc' = 'asc';
  onlyPublished = false;

  rellenaCantidad = 25;
  rellenando = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  // vaciar tabla
  emptying = false;
  emptyOk: number | null = null;
  emptyError: string | null = null;

  // contador total de registros
  totalElementsCount = 0;

  // publicar/despublicar
  publishingId: number | null = null;
  publishingAction: 'publicar' | 'despublicar' | null = null;

  constructor(
    private service: AlcaldeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.service.getPage(this.numPage, this.numRpp, this.order, this.direction, this.onlyPublished).subscribe({
      next: (data: IPage<IAlcalde>) => {
        this.oPage = data;
        this.totalElementsCount = data.totalElements ?? 0;
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

  togglePublished() {
    this.onlyPublished = !this.onlyPublished;
    this.numPage = 0;
    this.getPage();
  }

  changeSort(column: string) {
    if (this.order === column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.order = column;
      this.direction = 'asc';
    }
    this.getPage();
  }

  onCantidadChange(value: string) {
    this.rellenaCantidad = +value;
    return false;
  }

  generarFake() {
    this.rellenaOk = null;
    this.rellenaError = null;
    this.rellenando = true;
    this.snackBar.open(`Generando ${this.rellenaCantidad} lecturas...`, 'Cerrar', { duration: 2000 });
    this.service.rellena(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.getPage();
        this.snackBar.open(`Generadas ${this.rellenaCantidad} lecturas. Total: ${count}`, 'Cerrar', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando lecturas';
        console.error(err);
        this.snackBar.open('Error generando datos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openEmptyConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Vaciar tabla de lecturas',
        message: '¿Está seguro de que desea borrar TODAS las lecturas? Esta acción es irreversible.'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.doEmpty();
      }
    });
  }

  private doEmpty() {
    this.emptying = true;
    this.emptyOk = null;
    this.emptyError = null;
    this.snackBar.open(`Vaciando tabla (${this.totalElementsCount} registros)...`, 'Cerrar', { duration: 2000 });
    this.service.empty().subscribe({
      next: (count: number) => {
        this.emptying = false;
        this.emptyOk = count;
        this.numPage = 0;
        this.getPage();
        this.snackBar.open(`Tabla vaciada. Eliminados: ${count}`, 'Cerrar', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        this.emptying = false;
        this.emptyError = 'Error vaciando tabla';
        console.error(err);
        this.snackBar.open('Error vaciando la tabla', 'Cerrar', { duration: 3000 });
      }
    });
  }

  publicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'publicar';
    this.service.publicar(id).subscribe({
      next: () => {
        this.publishingId = null;
        this.publishingAction = null;
        this.getPage();
        this.snackBar.open('Lectura publicada', 'Cerrar', { duration: 2000 });
      },
      error: (err: HttpErrorResponse) => {
        this.publishingId = null;
        this.publishingAction = null;
        console.error(err);
        this.snackBar.open('Error al publicar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  despublicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'despublicar';
    this.service.despublicar(id).subscribe({
      next: () => {
        this.publishingId = null;
        this.publishingAction = null;
        this.getPage();
        this.snackBar.open('Lectura despublicada', 'Cerrar', { duration: 2000 });
      },
      error: (err: HttpErrorResponse) => {
        this.publishingId = null;
        this.publishingAction = null;
        console.error(err);
        this.snackBar.open('Error al despublicar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
