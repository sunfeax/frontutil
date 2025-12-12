import { Component, Input } from '@angular/core';
import { ISilvestre } from '../../../model/silvestre';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminView {
    @Input() public oSilvestre: ISilvestre | null = null;

}
