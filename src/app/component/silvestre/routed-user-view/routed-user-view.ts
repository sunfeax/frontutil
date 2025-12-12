import { Component } from '@angular/core';
import { ISilvestre } from '../../../model/silvestre';
import { SilvestreService } from '../../../service/silvestre';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedUserView } from "../unrouted-user-view/unrouted-user-view";

@Component({
  selector: 'app-routed-user-view',
  imports: [UnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class RoutedUserView {
  oSilvestre: ISilvestre | null = null;

  constructor(private oSilvestreService: SilvestreService, private route: ActivatedRoute) {
    // Obtener el ID de la publi desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const silvestreId = idParam ? Number(idParam) : NaN;
    if (isNaN(silvestreId)) {
      console.error('Invalid silvestre id:', idParam);
      return;
    }
    this.getSilvestre(silvestreId);
  }

  ngOnInit() { }

  getSilvestre(silvestreId: number) {
    this.oSilvestreService.get(silvestreId).subscribe({
      next: (data: ISilvestre) => {
        this.oSilvestre = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching silvestre:', error);
      },
    });
  }
}
