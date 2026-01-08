import { Component } from '@angular/core';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { SemperteguiService } from '../../../service/sempertegui/sempertegui.service';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SemperteguiUnroutedAdminView } from '../unrouted-admin-view/sempertegui-unrouted-admin-view';
import { Location } from '@angular/common'

@Component({
  selector: 'app-sempertegui-routed-admin-view',
  imports: [SemperteguiUnroutedAdminView, RouterLink],
  templateUrl: './sempertegui-routed-admin-view.html',
  styleUrl: './sempertegui-routed-admin-view.css',
})
export class SemperteguiRoutedAdminView {
  movie: IPelicula | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private semperteguiService: SemperteguiService, private route: ActivatedRoute, private location: Location) {
    // Obtener el ID del la película desde la ruta
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.getMovie(+id);
      } else {
          this.error = 'ID de película no válido';
          this.loading = false;
      }
  }

  ngOnInit() { }

  getMovie(movieId: number) {
    this.semperteguiService.get(movieId).subscribe({
      next: (data: IPelicula) => {
        this.movie = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Error cargando el registro';
        this.loading = false;
        console.error(error);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

}
