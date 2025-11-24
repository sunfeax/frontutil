import { Component, Input } from '@angular/core';
import { IVisita } from '../../types/visitas';

@Component({
  selector: 'app-registro-card-public',
  imports: [],
  templateUrl: './registro-card-public.component.html',
  styleUrl: './registro-card-public.component.css',
  standalone: true
})
export class RegistroCardPublicComponent {
  @Input() oVisita!: IVisita;
}
