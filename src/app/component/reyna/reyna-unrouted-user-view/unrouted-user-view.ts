import { Component, Input } from '@angular/core';
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { IReyna } from '../../../model/reyna';

@Component({
  selector: 'app-unrouted-user-view',
  imports: [DatetimePipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class UnroutedUserView {
  @Input() oReyna: IReyna | null = null;
  
}
