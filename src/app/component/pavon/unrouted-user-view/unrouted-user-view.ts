import { Component, Input } from '@angular/core';
import { IRecurso } from '../../../model/pavon/recurso';
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-unrouted-user-view',
  imports: [DatetimePipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class UnroutedUserViewPavon {
  @Input() oRecurso: IRecurso | null = null;
  
}
