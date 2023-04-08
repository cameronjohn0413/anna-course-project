import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Client } from './client';
import { Meeting } from './meeting';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const clientsarray = [
    { id: 12, name: 'Bob Lob', email: 'boblob@bloblob.com', phone: '456-555-6526' },
    { id: 13, name: 'Billy Kid', email: 'bkid@test.com', phone: '624-555-9123' },
    { id: 14, name: 'Eddy Arnold', email: 'eddyarn@example.com', phone: '745-555-2123' },
    { id: 15, name: 'Gary Larson', email: 'glarson@test.com', phone: '897-555-4523' },
    { id: 16, name: 'Peter Berg', email: 'peterberg@test.com', phone: '678-555-4812' },
    { id: 17, name: 'Carson Hardy', email: 'aharde@example.com', phone: '351-555-3178' },
    { id: 18, name: 'Jade Bernstall', email: 'jadeb@test.com', phone: '801-555-6632' },
    { id: 19, name: 'Hary Gardone', email: 'haryf@example.com', phone: '456-555-6526' }
    ];

    const meetingsArray = [
      { id: 101, clientId: 12, clientName: 'Bob Lob', date: '04/13/2023', time: '2:30pm', meetLength: '30min', note: 'Go over terms and conditions' },
      { id: 102, clientId: 13, clientName: 'Billy Kid', date: '04/09/2023', time: '11:30am', meetLength: '1hr', note: '' },
      { id: 103, clientId: 14, clientName: 'Eddy Arnold', date: '04/17/2023', time: '1:00pm', meetLength: '1hr', note: 'Address pricing concerns' },
      { id: 104, clientId: 15, clientName: 'Gary Larson', date: '04/21/2023', time: '3:30pm', meetLength: '30min', note: '' },
      { id: 105, clientId: 16, clientName: 'Peter Berg', date: '04/29/2023', time: '9:00am', meetLength: '1hr', note: '' },
      { id: 106, clientId: 17, clientName: 'Carson Hardy', date: '05/02/2023', time: '2:00pm', meetLength: '1hr', note: '' },
      { id: 107, clientId: 18, clientName: 'Jade Bernstall', date: '05/13/2023', time: '10:30am', meetLength: '30min', note: 'Get info to estimate completion time' },
      { id: 108, clientId: 19, clientName: 'Hary Gardone', date: '05/20/2023', time: '11:00am', meetLength: '30min', note: '' }
    ];
    return {clientsarray, meetingsArray};
  }

  /* Overrides the genId method to ensure that a client always has an id.
  If the clients array is empty, the method below returns the initial number (11).
  If the clients array is not empty, the method below returns the highest client id +1. */
  genId(clientsarray: Client[]): number {
    return clientsarray.length > 0 ? Math.max(...clientsarray.map(client => client.id)) + 1 : 11;
  }

  genMeetingId(meetingsArray: Meeting[]): number {
    return meetingsArray.length > 0 ? Math.max(...meetingsArray.map(meeting => meeting.id)) + 1 : 100;
  }

  constructor() { }
  
}
