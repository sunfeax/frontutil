import { Component, Input } from '@angular/core';
import { IReyna } from '../../../model/reyna';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [DatetimePipe,RouterLink],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminView {
  @Input() oReyna: IReyna | null = null;
}
