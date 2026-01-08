import { Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { AlcaldeUnroutedUserCard } from '../unrouted-user-card/unrouted-user-card';

@Component({
  selector: 'app-alcalde-user-plist',
  imports: [Paginacion, AlcaldeUnroutedUserCard, RouterLink],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class AlcaldeRoutedUserPlist implements OnDestroy {
  featured: IAlcalde[] = [];
  genreFilter = 'Todos';
  minRating = 0;
  genreOptions: string[] = [];
  featuredExpanded = false;
  featuredLimit = 3;

  pagePublished: IPage<IAlcalde> | null = null;
  numPage = 0;
  numRpp = 5;
  rppOptions = [5, 10, 20];

  loadingFeatured = false;
  loadingPage = false;

  private filterSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private service: AlcaldeService) {
    this.filterSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadPublished());
  }

  ngOnInit() {
    this.loadGeneros();
    this.loadFeatured();
    this.loadPublished();
  }

  get filteredFeatured(): IAlcalde[] {
    return this.featured;
  }

  loadFeatured() {
    this.loadingFeatured = true;
    this.service.selection(this.featuredLimit).subscribe({
      next: (data) => {
        this.featured = data;
        this.loadingFeatured = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loadingFeatured = false;
      }
    });
  }

  loadPublished() {
    this.loadingPage = true;
    this.service.getPageFiltered(this.numPage, this.numRpp, 'fechaCreacion', 'desc', this.genreFilter, this.minRating).subscribe({
      next: (data) => {
        this.pagePublished = data;
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.loadPublished();
        } else {
          this.loadingPage = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loadingPage = false;
      }
    });
  }

  onGenreChange(value: string) {
    this.genreFilter = value;
    this.numPage = 0;
    this.filterSubject.next();
  }

  onRatingChange(value: string) {
    this.minRating = Number(value);
    this.numPage = 0;
    this.filterSubject.next();
  }

  loadGeneros() {
    this.service.generos().subscribe({
      next: (data) => {
        this.genreOptions = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.loadPublished();
    return false;
  }

  onRppChange(value: string) {
    this.numRpp = Number(value);
    this.numPage = 0;
    this.loadPublished();
  }

  toggleFeatured() {
    this.featuredExpanded = !this.featuredExpanded;
  }

  onFeaturedLimitChange(value: string) {
    this.featuredLimit = Number(value);
    this.loadFeatured();
  }

  get hasActiveFilters(): boolean {
    return this.genreFilter !== 'Todos' || this.minRating > 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
