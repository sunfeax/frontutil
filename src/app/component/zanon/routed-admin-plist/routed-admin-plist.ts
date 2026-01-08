import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { IZanon } from '../../../model/zanon/zanon';
import { ZanonService } from '../../../service/zanon/zanon';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe, MatDialogModule, MatSnackBarModule],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlistZanon {
  oPage: IPage<IZanon> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  // Estado para vaciar la tabla
  emptying: boolean = false;
  emptyOk: number | null = null;
  emptyError: string | null = null;
  
  // Contador actual de elementos en la tabla
  totalElementsCount: number = 0;
  
  // track id being published/unpublished to show spinner per-row
  publishingId: number | null = null;
  publishingAction: 'publicar' | 'despublicar' | null = null;

  constructor(private oZanonService: ZanonService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    
  }

  oBotonera: string[] = [];

  orderField: string = 'id';
  orderDirection: string = 'asc';

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oZanonService.getPage(this.numPage, this.numRpp, this.orderField, this.orderDirection, false).subscribe({
      next: (data: IPage<IZanon>) => {
        this.oPage = data;

        // Actualizar el contador actual
        this.totalElementsCount = data.totalElements ?? 0;
        this.rellenaOk = this.totalElementsCount;

        // Si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
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

    // Notificar inicio con el conteo actual
    this.snackBar.open(`Generando ${this.rellenaCantidad} rutinas... (actual: ${this.totalElementsCount})`, 'Cerrar', { duration: 3000 });
    this.oZanonService.rellenaBlog(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;

        // Refrescamos el listado y notificamos el resultado
        this.getPage();
        this.snackBar.open(`¡ ${count} rutinas generadas con éxito! Total: ${this.totalElementsCount + count}`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos fake';
        console.error(err);
        this.snackBar.open('Error generando datos de prueba', 'Cerrar', { duration: 4000 });
      }
    });
  }

  onOrder(order: string) {
    if (this.orderField === order) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderField = order;
      this.orderDirection = 'asc';
    }
    this.numPage = 0;
    this.getPage();
    return false;
  }

  openEmptyConfirm() {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Vaciar la tabla',
          message: '¿Está seguro de que desea borrar todas las rutinas? Esta acción es irreversible'
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
    // notificar inicio con el conteo actual
    this.snackBar.open(`Vaciando tabla... (actual: ${this.totalElementsCount})`, 'Cerrar', { duration: 3000 });
    this.oZanonService.empty().subscribe({
      next: (count: number) => {
        this.emptying = false;
        this.emptyOk = count;
        // refrescar listado
        this.numPage = 0;
        this.getPage();
        this.snackBar.open(`Tabla vaciada. Se han eliminado ${count} rutinas.`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.emptying = false;
        this.emptyError = 'Error vaciando la tabla';
        console.error(err);
        this.snackBar.open('Error al vaciar la tabla', 'Cerrar', { duration: 4000 });
      }
    });
  }

  publicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'publicar';
    this.oZanonService.publicar(id).subscribe({
      next: () => {
        this.publishingId = null;
        this.publishingAction = null;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.publishingId = null;
        this.publishingAction = null;
      }
    });
    return false;
  }

  despublicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'despublicar';
    this.oZanonService.despublicar(id).subscribe({
      next: () => {
        this.publishingId = null;
        this.publishingAction = null;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.publishingId = null;
        this.publishingAction = null;
      }
    });
    return false;
  }
}
