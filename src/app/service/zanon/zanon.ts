import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../../environment/environment';
import { IPage } from '../../model/plist';
import { IZanon } from '../../model/zanon/zanon';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZanonService {

    constructor(private oHttp: HttpClient) {

    }

    getPage(page: number, rpp: number, order: string = '', direction: string = '', publico?: boolean): Observable<IPage<IZanon>> {
        if (order === '') {
            order = 'id';
        }

        if (direction === '') {
            direction = 'asc';
        }

        let url = `${serverURL}/zanon?page=${page}&size=${rpp}&sort=${order},${direction}`;

        if (publico !== undefined) {
            url += `&publico=${publico}`;
        }

        return this.oHttp.get<IPage<IZanon>>(url);
    }

    get(id: number): Observable<IZanon> {
        return this.oHttp.get<IZanon>(serverURL + '/zanon/' + id);
    }

    create(zanon: Partial<IZanon>): Observable<number> {
        return this.oHttp.post<number>(serverURL + '/zanon', zanon);
    }

    update(zanon: Partial<IZanon>): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/zanon', zanon);
    }

    delete(id: number): Observable<number> {
        return this.oHttp.delete<number>(serverURL + '/zanon/' + id);
    }

    rellenaBlog(numPosts: number): Observable<number> {
        return this.oHttp.get<number>(serverURL + '/zanon/rellena/' + numPosts);
    }

    /**
   * 
   * Vaciar la tabla (DELETE /zanon/empty).
   * Devuelve el número de filas eliminadas
   * 
   */

    empty(): Observable<number> {
        return this.oHttp.delete<number>(serverURL + '/zanon/empty');
    }

    publicar(id: number): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/zanon/publicar/' + id, {});
    }

    despublicar(id: number): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/zanon/despublicar/' + id, {});
    }
}
