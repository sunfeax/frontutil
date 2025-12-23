import { Component, inject, Input } from '@angular/core';
import { IPelicula } from '../../../model/sempertegui/sempertegui.interface';
import { MatDialog } from '@angular/material/dialog';
import { ShowDialog } from '../show-dialog/show-dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCardComponent {
  // El componente recibe un objeto 'movie' como entrada.
  @Input() movie!: IPelicula;
  @Input() isSessionActive!: boolean;
  private readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ShowDialog, {
      data : {
        title: this.movie.titulo,
        content: this.movie.sinopsis,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
    })
  }
}