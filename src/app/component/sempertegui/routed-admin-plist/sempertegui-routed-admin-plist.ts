import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/plist';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { SemperteguiService } from '../../../service/sempertegui/sempertegui.service';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { MatDialog } from '@angular/material/dialog'; // MatDialogModule
import { MatSnackBar } from '@angular/material/snack-bar'; // , MatSnackBarModule
import { ConfirmDeleteAllDialog, ConfirmDeleteDialog } from '../confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sempertegui-routed-admin-plist',
  imports: [CommonModule, RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './sempertegui-routed-admin-plist.html',
  styleUrl: './sempertegui-routed-admin-plist.css',
})
export class SemperteguiRoutedAdminPlist {
  oPage: IPage<IPelicula> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  // estado para vaciar la tabla
  emptying: boolean = false;
  emptyError: string | null = null;
  // contador actual de elementos en la tabla
  totalElementsCount: number = 0;
  // track id being published/unpublished to show spinner per-row
  publishingId: number | null = null;
  publishingAction: 'publicar' | 'despublicar' | null = null;
  oBotonera: string[] = [];
  orderField: string = 'id';
  orderDirection: string = 'asc';

  constructor(private semperteguiService: SemperteguiService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.semperteguiService.getPage(this.numPage, this.numRpp, this.orderField, this.orderDirection).subscribe({
      next: (data: IPage<IPelicula>) => {
        this.oPage = data;
        // actualizar contador actual
        this.totalElementsCount = data.totalElements ?? 0;
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

  sortColumn(column: string) {
    this.orderField = column;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getPage()
    return false;
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
    this.rellenando = true;
    // notificar inicio con el conteo actual
    const loadingSnack = this.snackBar.open(`Generando ${this.rellenaCantidad} registros...`);
    this.semperteguiService.rellenaPeliculas(this.rellenaCantidad)
      .pipe(
        finalize(() => {
          this.rellenando = false;
          loadingSnack.dismiss();
        })
      )
    .subscribe({
      next: (count: number) => {
        // refrescamos listado y notificamos resultado
        this.getPage();
        this.snackBar.open(`Hecho! ${this.rellenaCantidad} registros generados. Total: ${count}`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error generando datos de prueba', 'Cerrar', { duration: 4000 });
      }
    });
  }

  openEmptyConfirm(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteAllDialog, {
      data: {
        title: 'Vaciar Registros de la Tabla Película',
        message: '¿Está seguro de que desea borrar TODOS los registros? Esta acción es irreversible.'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.doEmpty();
      }
    });
  }

  private doEmpty(): void {
    this.emptyError = null;
    this.emptying = true;
    // notificar inicio con el conteo actual
    const loadingSnack = this.snackBar.open("Vaciando tabla...");
    this.semperteguiService.empty()
      .pipe(
        finalize(() => {
          this.emptying = false;
          loadingSnack.dismiss();
        })
      )
    .subscribe({
      next: (count: number) => {
        // refrescar listado
        this.numPage = 0;
        this.getPage();
        this.snackBar.open(`Tabla vaciada. Total Eliminados: ${count}.`, 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.emptyError = 'Error vaciando la tabla';
        console.error(err);
        this.snackBar.open('Error al vaciar la tabla', 'Cerrar', { duration: 4000 });
      }
    });
  }


  openConfirmDelete(id: number, titulo: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      data: {
        id,
        titulo,
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.confirmDelete(id, titulo);
      }
    });
  }

  confirmDelete(id: number, titulo: string) {
    let error;
    let deleting = true;
    this.semperteguiService.delete(id).subscribe({
      next: () => {
        deleting = false;
        this.snackBar.open(`Se ha eliminado ${titulo}`, 'Cerrar', { duration: 3000 });
        this.getPage();
        // this.router.navigate(['/sempertegui/plist']);
      },
      error: (err: HttpErrorResponse) => {
        deleting = false;
        error = 'Error borrando el post';
        this.snackBar.open('Error al borrar el registro', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  publicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'publicar';
    this.semperteguiService.publicar(id).subscribe({
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
    this.semperteguiService.despublicar(id).subscribe({
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
