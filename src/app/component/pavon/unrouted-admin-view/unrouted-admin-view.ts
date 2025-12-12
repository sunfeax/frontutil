import { Component, Input } from '@angular/core';
import { IRecurso } from '../../../model/pavon/recurso';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminViewPavon {
  @Input() oRecurso: IRecurso | null = null;

}
