import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _httpClient: HttpClient) { }




  public getAllUsers(): Observable<any> {
    return this._httpClient.get<any>("https://jsonplaceholder.typicode.com/todos");
  }

  public getAllFonts():Observable<any> {
    return this._httpClient.get<any>("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBbVyAZ535l5AE2Jsou9fN202AsOFSJzSg");
  }
}
