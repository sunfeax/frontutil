import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginType } from '../model/login';
import { serverURL } from '../environment/environment';
import { IToken } from '../model/token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private oHttp: HttpClient) {}

  create(login: Partial<LoginType>): Observable<IToken> {
    return this.oHttp.post<IToken>(`${serverURL}/session/login`, login);
  }
}
