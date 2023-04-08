import { Injectable } from '@angular/core';
import { Client } from './client';
import { Meeting } from './meeting';
// import { CLIENTLIST } from './mock-clients';
import { Observable, of, from, catchError, map, tap, BehaviorSubject } from 'rxjs';
import { find } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  private clientsarrayUrl = 'api/clientsarray';

  // Clientsarray web API header for HTTP save requests
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** Log a ClientService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ClientService: ${message}`);
    }

      /*Handle Http operation that failed. Let the app continue.  
  @param operation - name of the operation that failed.
  @param result - optional value to return as the observable result  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

    /** GET clients from the server */
  getClients(): Observable<Client[]> {
    this.messageService.add('ClientService: msgServ fetched clients');
    console.log(Client);
    return this.http.get<Client[]>(this.clientsarrayUrl)
      .pipe(
        tap(_ => this.log('tap fetched clients')),
        catchError(this.handleError<Client[]>('getClients', []))
      );
  }

  // GET client by id. Will 404 if id not found */
  getClient(id: number): Observable<Client> {
    const url = `${this.clientsarrayUrl}/${id}`; // Replaced: const client = CLIENTLIST.find(h => h.id === id)!;
    this.messageService.add(`ClientService: fetched client id=${id}`);
    return this.http.get<Client>(url).pipe(        // Replaced: of(client);
      tap(_ => this.log(`fetched client id=${id}`)),
      catchError(this.handleError<Client>(`getClient id=${id}`))
    );
  }

    /** PUT: update the client on the server. Returns the updated client upon success. */
    updateClient(client: Client): Observable<Client> {
      httpOptions.headers =
        httpOptions.headers.set('Authorization', 'my-new-auth-token');
  
      return this.http.put<Client>(this.clientsarrayUrl, client, httpOptions)
        .pipe(catchError(this.handleError('updateClient', client)))
        .pipe(
          tap(_ => this.log(`updated client id=${client.id}`)),
          catchError(this.handleError<Client>('updateClient'))
        );
    }


  // POST: add a new client to the server
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientsarrayUrl, client, this.httpOptions).pipe(
      tap((newClient: Client) => this.log(`added client w/ id=${newClient.id}`)),
      catchError(this.handleError<Client>('addClient'))
    );
  }

    /** DELETE: delete the hero from the server */
    deleteClient(id: number): Observable<Client> {
      const url = `${this.clientsarrayUrl}/${id}`;
      
      return this.http.delete<Client>(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted client id=${id}`)),
        catchError(this.handleError<Client>('deleteClient'))
      );
    }
  
    /* GET heroes whose name contains search term */
    searchClients(term: string): Observable<Client[]> {
      if (!term.trim()) {
        // if not search term, return empty client array.
        return of([]);
      }
      return this.http.get<Client[]>(`${this.clientsarrayUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
          this.log(`found clients matching "${term}"`) :
          this.log(`no clients matching "${term}"`)),
        catchError(this.handleError<Client[]>('searchClients', []))
      );
    }

  // addClient(client: Client): Observable<Client> {
  //   const id = client.id;
  //   const url = `${this.clientsarrayUrl}/${id}`;
  //   return this.http.post<Client>(this.clientsarrayUrl, client, this.httpOptions)
  //     .pipe(
  //       tap(_ => this.log(`added client id=${id}`)),
  //       catchError(this.handleError<Client>('AddedClient'))
  //     );
  // }

}
