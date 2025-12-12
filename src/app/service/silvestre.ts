import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ISilvestre } from '../model/silvestre';

@Injectable({
  providedIn: 'root',
})
export class SilvestreService {
  private readonly http = inject(HttpClient);

  getPage(page: number, rpp: number, order = 'id', direction = 'asc'): Observable<IPage<ISilvestre>> {
    return this.http.get<IPage<ISilvestre>>(
      `${serverURL}/silvestre?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }

  get(id: number): Observable<ISilvestre> {
    return this.http.get<ISilvestre>(`${serverURL}/silvestre/${id}`);
  }

  create(silvestre: Partial<ISilvestre>): Observable<number> {
    // don't send creation/modification dates on create (server should set them),
    // and keep payload immutable by using a shallow copy
    const payload = { ...silvestre } as Partial<ISilvestre> & Record<string, unknown>;
    delete payload.fechaCreacion;
    delete payload.fechaModificacion;
    return this.http.post<number>(`${serverURL}/silvestre`, payload);
  }

  update(silvestre: Partial<ISilvestre>): Observable<number> {
    // normalize date strings to ISO (contain 'T') before sending
    const payload = { ...silvestre } as Partial<ISilvestre>;
    if (payload.fechaCreacion) {
      payload.fechaCreacion = normalizeDate(payload.fechaCreacion);
    }
    if (payload.fechaModificacion) {
      payload.fechaModificacion = normalizeDate(payload.fechaModificacion);
    }
    return this.http.put<number>(`${serverURL}/silvestre`, payload);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${serverURL}/silvestre/${id}`);
  }

  rellenaSilvestre(num: number): Observable<number> {
    return this.http.get<number>(`${serverURL}/silvestre/rellena/${num}`);
  }
}

// helper to produce ISO-like LocalDateTime strings (ensures 'T' separator)
function normalizeDate(date: string | Date | unknown): string {
  if (date instanceof Date) {
    // toISOString includes timezone 'Z'; backend should accept ISO, otherwise adjust here
    return date.toISOString();
  }
  if (typeof date === 'string') {
    if (date.includes('T')) {
      return date;
    }
    // replace first space with 'T' (handles "YYYY-MM-DD HH:mm:ss")
    return date.replace(' ', 'T');
  }
  return String(date);
}