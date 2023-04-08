import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { MeetingService } from '../meeting.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { Meeting } from '../meeting';
// import { MEETINGLIST } from '../mock-meetings';
import { Observable, Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormGroup, FormBuilder, ControlValueAccessor } from '@angular/forms';
// Search Related Imports
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  meetings: Meeting[] = [];

  constructor(
    private modal: NgbModal
  ) { }

   // ------------------------------   Calendar Info
   view: CalendarView = CalendarView.Month;

   CalendarView = CalendarView;
 
   viewDate: Date = new Date();
 
   modalData?: {
     action: string;
     event: CalendarEvent;
   };
 
   actions: CalendarEventAction[] = [
     {
       label: '<i class="fas fa-fw fa-pencil-alt"></i>',
       a11yLabel: 'Edit',
       onClick: ({ event }: { event: CalendarEvent }): void => {
         this.handleEvent('Edited', event);
       },
     },
     {
       label: '<i class="fas fa-fw fa-trash-alt"></i>',
       a11yLabel: 'Delete',
       onClick: ({ event }: { event: CalendarEvent }): void => {
         this.events = this.events.filter((iEvent) => iEvent !== event);
         this.handleEvent('Deleted', event);
       },
     },
   ];
 
   refresh = new Subject<void>();
 
   // Calendar Events
   events: CalendarEvent[] = [];
 
   activeDayIsOpen: boolean = true;
 
   dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
     if (isSameMonth(date, this.viewDate)) {
       if (
         (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
         events.length === 0
       ) {
         this.activeDayIsOpen = false;
       } else {
         this.activeDayIsOpen = true;
       }
       this.viewDate = date;
     }
   }
 
   eventTimesChanged({
     event,
     newStart,
     newEnd,
   }: CalendarEventTimesChangedEvent): void {
     this.events = this.events.map((iEvent) => {
       if (iEvent === event) {
         return {
           ...event,
           start: newStart,
           end: newEnd,
         };
       }
       return iEvent;
     });
     this.handleEvent('Dropped or resized', event);
   }
 
   handleEvent(action: string, event: CalendarEvent): void {
     this.modalData = { event, action };
     this.modal.open(this.modalContent, { size: 'lg' });
   }
 
   addEvent(): void {
     this.events = [
       ...this.events,
       {
         title: 'New event',
         start: startOfDay(new Date()),
         end: endOfDay(new Date()),
         color: colors['red'],
         draggable: true,
         resizable: {
           beforeStart: true,
           afterEnd: true,
         },
       },
     ];
   }
 
   deleteEvent(eventToDelete: CalendarEvent) {
     this.events = this.events.filter((event) => event !== eventToDelete);
   }
 
   setView(view: CalendarView) {
     this.view = view;
   }
 
   closeOpenMonthViewDay() {
     this.activeDayIsOpen = false;
   }

}
