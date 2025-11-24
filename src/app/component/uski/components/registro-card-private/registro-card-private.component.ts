import { Component, Input } from '@angular/core';
import { IVisita } from '../../types/visitas';

@Component({
  selector: 'app-registro-card-private',
  imports: [],
  templateUrl: './registro-card-private.component.html',
  styleUrl: './registro-card-private.component.css',
  standalone: true
})
export class RegistroCardPrivateComponent {
  @Input() oVisita!: IVisita;
}
