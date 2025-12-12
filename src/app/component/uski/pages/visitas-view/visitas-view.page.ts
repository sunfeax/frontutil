import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VisitasService } from '../../services/visitas';
import { IVisita } from '../../types/visitas';
import { DatetimePipe } from "../../../../pipe/datetime-pipe";

@Component({
  selector: 'app-visitas-view-page',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './visitas-view.page.html',
  styleUrl: './visitas-view.page.css',
})
export class UskiVisitasViewPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitasService = inject(VisitasService);

  oVisita: IVisita | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(id);
  }

  load(id: number) {
    this.visitasService.get(id).subscribe({
      next: (data: IVisita) => {
        this.oVisita = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando el registro';
        this.loading = false;
        console.error(err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/visitas']);
  }
}
