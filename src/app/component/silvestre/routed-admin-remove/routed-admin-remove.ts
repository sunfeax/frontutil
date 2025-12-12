import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SilvestreService } from '../../../service/silvestre';
import { ISilvestre } from '../../../model/silvestre';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'app-routed-admin-remove',
  imports: [UnroutedAdminView],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css'
})
export class RoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private silvestreService = inject(SilvestreService);

  oSilvestre: ISilvestre | null = null;
  loading: boolean = true;
  error: string | null = null;
  deleting: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(+id);
  }

  load(id: number) {
    this.silvestreService.get(id).subscribe({
      next: (data: ISilvestre) => {
        this.oSilvestre = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando el post';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.oSilvestre) return;
    this.deleting = true;
    this.silvestreService.delete(this.oSilvestre.id).subscribe({
      next: () => {
        this.deleting = false;
        // antes: this.router.navigate(['/blog/plist']);
        this.router.navigate(['/silvestre/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el post';
        console.error(err);
      }
    });
  }

  cancel() {
    // antes: this.router.navigate(['/blog/plist']);
    this.router.navigate(['/silvestre/plist']);
  }
}
