import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IRecurso } from '../../../model/pavon/recurso';
import { TrimPipe } from "../../../pipe/trim-pipe";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-unrouted-user-view2',
  imports: [TrimPipe, RouterLink, DatetimePipe],
  templateUrl: './unrouted-user-view2.html',
  styleUrl: './unrouted-user-view2.css',
})
export class UnroutedUserView2Pavon implements OnInit {
  @Input() oRecurso: IRecurso | null = null;

  iconClass: string = 'bi bi-link-45deg';

  ngOnInit(): void {
    const icons: string[] = [
      'bi bi-link-45deg',
      'bi bi-link',
      'bi bi-globe',
      'bi bi-browser-chrome',
      'bi bi-bookmark',
      'bi bi-star',
    ];
    this.iconClass = icons[Math.floor(Math.random() * icons.length)];
  }

}
