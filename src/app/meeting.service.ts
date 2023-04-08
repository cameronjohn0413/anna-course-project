import { Injectable } from '@angular/core';
import { Client } from './client';
import { ClientService } from './client.service';
import { Meeting } from './meeting';
// import { MEETINGLIST } from './mock-meetings';
import { Observable, of, from, catchError, map, tap, BehaviorSubject } from 'rxjs';
import { find } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ClientDetailsComponent } from './client-details/client-details.component';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class MeetingService {

  private meetingsArrayUrl = 'api/meetingsArray';
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
    this.messageService.add(`MeetingService: ${message}`);
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
        return this.http.get<Client[]>(this.clientsarrayUrl);
      }

      // PUT: Update meetings id for new meeting
    getClient(name: string): Observable<Client> {
      const url = `${this.clientsarrayUrl}/${name}`;
      return this.http.get<Client>(url);
    }

    /** GET meetings from the server */
  getMeetings(): Observable<Meeting[]> {
    this.messageService.add('MeetingService: msgServ fetched meetings');
    return this.http.get<Meeting[]>(this.meetingsArrayUrl)
      .pipe(
        tap(_ => this.log('tap fetched meetings')),
        catchError(this.handleError<Meeting[]>('getMeetings', []))
      );
  }

  // GET meeting by id. Will 404 if id not found */
  getMeeting(id: number): Observable<Meeting> {
    const url = `${this.meetingsArrayUrl}/${id}`; // Replaced: const client = CLIENTLIST.find(h => h.id === id)!;
    this.messageService.add(`MeetingService: fetched meeting id=${id}`);
    return this.http.get<Meeting>(url).pipe(        // Replaced: of(client);
      tap(_ => this.log(`fetched meeting id=${id}`)),
      catchError(this.handleError<Meeting>(`getMeeting id=${id}`))
    );
  }

    /** PUT: update the meeting on the server. Returns the updated client upon success. */
    updateMeeting(meeting: Meeting): Observable<Meeting> {
      httpOptions.headers =
        httpOptions.headers.set('Authorization', 'my-new-auth-token');
  
      return this.http.put<Meeting>(this.meetingsArrayUrl, meeting, httpOptions)
        .pipe(catchError(this.handleError('updateMeeting', meeting)))
        .pipe(
          tap(_ => this.log(`updated meeting id=${meeting.id}`)),
          catchError(this.handleError<Meeting>('updateMeeting'))
        );
    }


  // POST: add a new client to the server
  addMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.meetingsArrayUrl, meeting, this.httpOptions).pipe(
      tap((newMeet: Meeting) => this.log(`added meeting w/ id=${newMeet.id}`)),
      catchError(this.handleError<Meeting>('addMeeting'))
    );
  }

    /** DELETE: delete the hero from the server */
    deleteMeeting(id: number): Observable<Meeting> {
      const url = `${this.meetingsArrayUrl}/${id}`;
      
      return this.http.delete<Meeting>(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted meeting id=${id}`)),
        catchError(this.handleError<Meeting>('deleteMeetings'))
      );
    }
  
    /* GET heroes whose name contains search term */
    searchMeetings(term: string): Observable<Meeting[]> {
      if (!term.trim()) {
        // if not search term, return empty client array.
        return of([]);
      }
      return this.http.get<Meeting[]>(`${this.meetingsArrayUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
          this.log(`found meetings matching "${term}"`) :
          this.log(`no meetings matching "${term}"`)),
        catchError(this.handleError<Meeting[]>('searchMeetings', []))
      );
    }
}
