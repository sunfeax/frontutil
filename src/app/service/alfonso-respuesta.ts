import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { IAlfonsoRespuesta } from '../model/alfonso-respuesta';

@Injectable({
  providedIn: 'root',
})
export class AlfonsoRespuestaService {

  constructor(private oHttp: HttpClient) { }

  getPage(page: number, rpp: number, order: string = 'id', direction: string = 'asc', filter: string = ''): Observable<IPage<IAlfonsoRespuesta>> {
    const params = [`page=${page}`, `size=${rpp}`, `sort=${order},${direction}`];
    if (filter) {
      params.push(`filter=${encodeURIComponent(filter)}`);
    }
    return this.oHttp.get<IPage<IAlfonsoRespuesta>>(serverURL + `/alfonsorespuesta?${params.join('&')}`);
  }

  get(id: number): Observable<IAlfonsoRespuesta> {
    return this.oHttp.get<IAlfonsoRespuesta>(serverURL + '/alfonsorespuesta/' + id);
  }

  create(respuesta: Partial<IAlfonsoRespuesta>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/alfonsorespuesta', respuesta);
  }

  update(respuesta: Partial<IAlfonsoRespuesta>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/alfonsorespuesta', respuesta);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/alfonsorespuesta/' + id);
  }

  rellena(cantidad: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/alfonsorespuesta/rellena/' + cantidad);
  }

  empty(): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/alfonsorespuesta/empty');
  }

  publicar(id: number): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/alfonsorespuesta/publicar/' + id, {});
  }

  despublicar(id: number): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/alfonsorespuesta/despublicar/' + id, {});
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/alfonsorespuesta/count');
  }

  countVisible(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/alfonsorespuesta/count/visible');
  }
}
