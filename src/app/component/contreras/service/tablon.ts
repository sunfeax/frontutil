import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../../../environment/environment';
import { IPage } from '../model/plist';
import { ITablon } from '../model/tablon';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TablonService {

  constructor(private oHttp: HttpClient) { }

  // OBTENER POSTS
  // posts para admin
  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<ITablon>> {
    if (order === '') order = 'id';
    if (direction === '') direction = 'asc';
    return this.oHttp.get<IPage<ITablon>>(serverURL + `/contreras/admin?page=${page}&size=${rpp}&sort=${order},${direction}`)
      .pipe(
        catchError((err) => {
          console.error('TablonService.getPage error:', err);
          return throwError(() => err);
        })
      );
  }

  // posts para usuario (solo publicos)
  getPublicPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<ITablon>> {
    if (order === '') order = 'id';
    if (direction === '') direction = 'asc';
    return this.oHttp.get<IPage<ITablon>>(serverURL + `/contreras?page=${page}&size=${rpp}&sort=${order},${direction}&publicado=true`)
      .pipe(
        catchError((err) => {
          console.error('TablonService.getPublicPage error:', err);
          return throwError(() => err);
        })
      );
  }
  
  // Obtener todos los posts sin paginación (para filtrado completo)
  getAll(): Observable<ITablon[]> {
    return this.oHttp.get<ITablon[]>(serverURL + '/contreras/all')
      .pipe(
        catchError((err) => {
          console.error('TablonService.getAll error:', err);
          return throwError(() => err);
        })
      );
  }

  get(id: number): Observable<ITablon> {
    return this.oHttp.get<ITablon>(serverURL + '/contreras/' + id)
      .pipe(
        catchError((err) => {
          console.error('TablonService.get error:', err);
          return throwError(() => err);
        })
      );
  }

  create(Tablon: Partial<ITablon>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/contreras', Tablon)
      .pipe(
        catchError((err) => {
          console.error('TablonService.create error:', err);
          return throwError(() => err);
        })
      );
  }

  update(Tablon: Partial<ITablon>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/contreras', Tablon)
      .pipe(
        catchError((err) => {
          console.error('TablonService.update error:', err);
          return throwError(() => err);
        })
      );
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/contreras/' + id)
      .pipe(
        catchError((err) => {
          console.error('TablonService.delete error:', err);
          return throwError(() => err);
        })
      );
  }

  // Borrar todos los posts
  deleteAll(): Observable<void> {
    return this.oHttp.delete<void>(serverURL + '/contreras/all')
      .pipe(
        catchError((err) => {
          console.error('TablonService.deleteAll error:', err);
          return throwError(() => err);
        })
      );
  }

  // Rellenar Tabla con posts
  rellenaTablon(numPosts: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/contreras/rellena/' + numPosts)
      .pipe(
        catchError((err) => {
          console.error('TablonService.rellenaTablon error:', err);
          return throwError(() => err);
        })
      );
  }





}
