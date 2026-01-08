import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { IPage } from '../../../model/plist';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routed-alcanyiz-admin-questionlist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe, MatDialogModule, MatSnackBarModule],
  templateUrl: './routed-alcanyiz-admin-questionlist.html',
  styleUrl: './routed-alcanyiz-admin-questionlist.css',
})
export class RoutedAlcanyizAdminQuestionlist {
oPage: IPage<questionModel> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;
  totalElementsCount: number = 0;
  emptying: boolean = false;
  emptyOk: number | null = null;
  emptyError: string | null = null;
  publishingId: number | null = null;
  publishingAction: 'publicar' | 'despublicar' | null = null;

  constructor(private oQuestionService: jsQuestionService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  oBotonera: string[] = [];
  orderField: string = 'id';
  orderDirection: string = 'asc';

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oQuestionService.getPage(this.numPage, this.numRpp, this.orderField, this.orderDirection).subscribe({
      next: (data: IPage<questionModel>) => {
        this.oPage = data;
        this.totalElementsCount = data.totalElements ?? 0;
        this.rellenaOk = this.totalElementsCount;
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
    this.oQuestionService.rellenaQuestions(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos';
        console.error(err);
      }
    });
  }

  publicar(id: number) {
    this.publishingId = id;
    this.publishingAction = 'publicar';
    this.oQuestionService.publicar(id).subscribe({
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
    this.oQuestionService.despublicar(id).subscribe({
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

  openEmptyConfirm() {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Borrar todas las preguntas',
          message: '¿Estas seguro de que quieres eliminar todas las preguntas? Esta acción es irreversible.'
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
      this.snackBar.open(`Borrando preguntas... (actual: ${this.totalElementsCount})`, 'Cerrar', { duration: 3000 });
      this.oQuestionService.empty().subscribe({
        next: (count: number) => {
          this.emptying = false;
          this.emptyOk = count;
          this.numPage = 0;
          this.getPage();
          this.snackBar.open(`Preguntas borradas. Eliminados: ${count}. Total ahora: 0`, 'Cerrar', { duration: 4000 });
        },
        error: (err: HttpErrorResponse) => {
          this.emptying = false;
          this.emptyError = 'Error vaciando la tabla';
          console.error(err);
          this.snackBar.open('Error al vaciar la tabla', 'Cerrar', { duration: 4000 });
        }
      });
    }
}
