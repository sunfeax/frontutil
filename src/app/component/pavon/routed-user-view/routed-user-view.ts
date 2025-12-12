import { Component } from '@angular/core';
import { IRecurso } from '../../../model/pavon/recurso';
import { PavonService } from '../../../service/pavon/recurso';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedUserViewPavon } from "../unrouted-user-view/unrouted-user-view";

@Component({
  selector: 'app-routed-user-view',
  imports: [UnroutedUserViewPavon],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class RoutedUserViewPavon {
  oRecurso: IRecurso | null = null;

  constructor(private oPavonService: PavonService, private route: ActivatedRoute) {
    // Obtener el ID del recurso desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const recursoId = idParam ? Number(idParam) : NaN;
    if (isNaN(recursoId)) {
      console.error('Invalid recurso id:', idParam);
      return;
    }
    this.getRecurso(recursoId);
  }

  ngOnInit() { }

  getRecurso(recursoId: number) {
    this.oPavonService.get(recursoId).subscribe({
      next: (data: IRecurso) => {
        this.oRecurso = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching recurso:', error);
      },
    });
  }
}
