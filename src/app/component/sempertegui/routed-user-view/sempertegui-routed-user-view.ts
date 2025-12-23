import { Component } from '@angular/core';
import { SemperteguiService } from '../../../service/sempertegui/sempertegui.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { TrimPipe } from "../../../pipe/trim-pipe";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { Location } from "@angular/common";
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-sempertegui-routed-user-view',
  imports: [TrimPipe, DatetimePipe, RouterLink],
  templateUrl: './sempertegui-routed-user-view.html',
  styleUrl: './sempertegui-routed-user-view.css',
})
export class SemperteguiRoutedUserView {
  movie: IPelicula | null = null;
  loading: boolean = true;
  error: string | null = null;
  isSessionActive: boolean = false;

  constructor(
    private semperteguiService: SemperteguiService, 
    private route: ActivatedRoute, 
    private sessionService: SessionService
  ) {
    this.isSessionActive = this.sessionService.isSessionActive();
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
        this.error = 'Error cargando el registro o no existe';
        this.loading = false;
        console.error(error);
      },
    });
  }

}
