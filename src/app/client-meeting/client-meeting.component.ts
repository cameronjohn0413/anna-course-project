import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { MeetingService } from '../meeting.service';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { Meeting } from '../meeting';
// import { MEETINGLIST } from '../mock-meetings';
import { Observable, Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, ControlValueAccessor } from '@angular/forms';
// Search Related Imports
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-client-meeting',
  templateUrl: './client-meeting.component.html',
  styleUrls: ['./client-meeting.component.css']
})

export class ClientMeetingComponent implements OnInit {


public meetForm!: FormGroup;
  meetingList: Meeting[] = [];
  meeting: Meeting | undefined;
  newMeet?: Meeting;
  meetingToUpdate: Meeting | undefined;
  client: Client | undefined;
  getClient?: Client
  closeResult = '';
  addClicked = 'no';
  editClicked = 'no';
  meetingLength: any = ['30min', '1hr', '2hr'];
  public clientlist: Array<any> = [];
  clientFetchId: any;

  // Search Info
  meetings$!: Observable<Meeting[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private meetingService: MeetingService,
    private modalService: NgbModal,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.getMeetingList();
    this.getClientlist();
    //Search OnInit
    this.meetings$ = this.searchTerms.pipe(
      //wait 300ms after each keystroke before considering the term
      debounceTime(300),
      //ignore new term if same as previous term
      distinctUntilChanged(),
      //switch to new search observable each time the term changes
      switchMap((term: string) => this.meetingService.searchMeetings(term)),
      );

    this.meetForm = this.fb.group({
      id: ({ value: 1, disabled: true }),
      clientId: 1,
      clientName: [''],
      meetDate: [''],
      meetTime: [''],
      meetLength: [''],
      meetNote: ['']
    });
  }

    // Client Dropdown
    getClientlist(): void {
      this.meetingService.getClients()
        .subscribe(clientNames => {
          clientNames.forEach(element => {
            this.clientlist.push(element["name"])
          });
        });
      }
    // getClientlist(): void {
    //   this.meetingService.getClients()
    //     .subscribe(clientlist => this.clientlist = clientlist);
    //     //console.log(`GetMeetingList: ${this.meetingList.values}`);
    //   }
    getClientId() {
      const meetingForm = this.meetForm.value;
      this.meetingService.getClients()
        .subscribe(clientlist => {
          this.getClient = clientlist.find(c => c.name == meetingForm.clientName);
          this.clientFetchId = this.getClient!.id;
          console.log(this.getClient);
          console.log(this.clientFetchId);
        });
        return this.clientFetchId;
    }

  getMeetingList(): void {
    this.meetingService.getMeetings()
      .subscribe(meetingList => this.meetingList = meetingList);
      //console.log(`GetMeetingList: ${this.meetingList.values}`);
    }

    getNewList(): void {
      this.meetingService.getMeetings()
      .subscribe(meetingList => this.meetingList = this.meetingList);
    }

    createMeeting() {
      this.meetForm.reset();
      this.meetForm.setValue({
        id: '',
        clientId: '',
        clientName: '',
        meetDate: '',
        meetTime: '',
        meetLength: '',
        meetNote: ''
      });
    }
  
    saveCreate() {
      const formInput = this.meetForm.value;
      this.addClicked = 'no';
      this.newMeet = {
        id: formInput.id,
        clientId: 0,
        clientName: formInput.clientName,
        date: formInput.meetDate,
        time: formInput.meetTime,
        meetLength: formInput.meetLength,
        note: formInput.meetNote
      }
      this.meetingService.addMeeting(this.newMeet)
        .subscribe(meeting => {
          this.meetingList.push(meeting);
        });
    }
  
    edit() {
      this.meetForm.patchValue({
        id: this.meetingToUpdate!.id,
        clientId: this.meetingToUpdate!.clientId,
        clientName: this.meetingToUpdate!.clientName,
        meetDate: this.meetingToUpdate!.date,
        meetTime: this.meetingToUpdate!.time,
        meetLength: this.meetingToUpdate!.meetLength,
        meetNote: this.meetingToUpdate!.note
      });
    }
  
    save() {
      const formInput = this.meetForm.value;
      const currentClientId = this.getClientId();
      this.meetingToUpdate!.clientId = currentClientId;
      this.editClicked = 'no';
      this.meetingToUpdate = {
        id: this.meetingToUpdate!.id,
        clientId: this.meetingToUpdate!.clientId,
        clientName: formInput.clientName,
        date: formInput.meetDate,
        time: formInput.meetTime,
        meetLength: formInput.meetLength,
        note: formInput.meetNote
      }
        this.meetingService.updateMeeting(this.meetingToUpdate)
          .subscribe(() => {
            this.meetForm.patchValue({
              id: this.meetingToUpdate!.id,
              clientId: currentClientId,
              clientName: this.meetingToUpdate!.clientName,
              meetDate: this.meetingToUpdate!.date,
              meetTime: this.meetingToUpdate!.time,
              meetLength: this.meetingToUpdate!.meetLength,
              meetNote: this.meetingToUpdate!.note
            })
          });
      this.getMeetingList();
      this.getNewList()
      console.log(this.meetingList);
    }
  
    delete(meeting: Meeting): void {
      this.meetingList = this.meetingList.filter(m => m !== meeting);
      this.meetingService.deleteMeeting(meeting.id).subscribe();
    }

    //Push a search term into the observable stream.
    search(term: string): void {
      this.searchTerms.next(term);
      }

    // Logic to Open the Client Modal. Copied from Online
    open(mymodal: any) {
      this.modalService.open(mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
        }
        private getDismissReason(reason: any): string {
          if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
          } else {
            return `with: ${reason}`;
          }
        }
    
    onSubmit() {
      // TODO: Use EventEmitter with form value
      console.warn(this.meetForm.value);
    }
}
