import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../types/pageView';
import { IVisita } from '../types/visitas';
import { serverURL } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class VisitasService {

  constructor(private oHttp: HttpClient) { }

  getPagePublic(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<IVisita>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<IVisita>>(serverURL + `/visitas?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  getPagePrivate(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<IVisita>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<IVisita>>(serverURL + `/visitas/dashboard?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  get(id: number): Observable<IVisita> {
    return this.oHttp.get<IVisita>(serverURL + '/visitas/' + id);
  }

  create(visita: Partial<IVisita>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/visitas', visita);
  }

  update(visita: Partial<IVisita>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/visitas', visita);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/visitas/' + id);
  }

}
