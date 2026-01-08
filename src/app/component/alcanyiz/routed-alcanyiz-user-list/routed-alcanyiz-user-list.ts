import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { IPage } from '../../../model/plist';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { UnroutedAlcanyizUserView2 } from '../unrouted-alcanyiz-user-view2/unrouted-alcanyiz-user-view2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routed-alcanyiz-user-list',
  imports: [CommonModule, Paginacion, UnroutedAlcanyizUserView2, RouterLink],
  templateUrl: './routed-alcanyiz-user-list.html',
  styleUrl: './routed-alcanyiz-user-list.css',
})
export class RoutedAlcanyizUserList {
oPage: IPage<questionModel> | null = null;
  numPage: number = 0;
  numRpp: number = 3;
  totalElementsCount: number = 0;

  constructor(private oQuestionService: jsQuestionService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
  this.oQuestionService.getPage(this.numPage, this.numRpp, 'id', 'asc').subscribe({
      next: (data: IPage<questionModel>) => {
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
}
