import { Component, Input } from '@angular/core';
import { IVisita } from '../../types/visitas';
import { TrimPipe } from '../../../../pipe/trim-pipe';
import { RouterLink } from '@angular/router';
import { DatetimePipe } from "../../../../pipe/datetime-pipe";

@Component({
  selector: 'app-registro-card-public',
  imports: [RouterLink, TrimPipe, DatetimePipe],
  templateUrl: './registro-card-public.component.html',
  styleUrl: './registro-card-public.component.css',
  standalone: true
})
export class RegistroCardPublicComponent {
  @Input() oVisita!: IVisita;
}
