import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'app-show-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content class="mat-typography">
        <h6 class="fw-bold mt-1">Sinopsis</h6>
        <p>{{data.content}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button matButton mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
})
export class ShowDialog {
  data = inject(MAT_DIALOG_DATA);
}