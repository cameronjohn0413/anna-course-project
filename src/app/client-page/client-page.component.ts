import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// Search Related Imports
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit {

  public clientForm!: FormGroup;
  clientlist: Client[] = [];
  client: Client | undefined;
  newClient?: Client;
  clientToUpdate: Client | undefined;
  closeResult = '';
  addClicked = 'no';
  editClicked = 'no';
  //Search Info
  clients$!: Observable<Client[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private clientService: ClientService,
    private modalService: NgbModal,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.getClientlist();

    //Search OnInit
    this.clients$ = this.searchTerms.pipe(
      //wait 300ms after each keystroke before considering the term
      debounceTime(300),
      //ignore new term if same as previous term
      distinctUntilChanged(),
      //switch to new search observable each time the term changes
      switchMap((term: string) => this.clientService.searchClients(term)),
      );

    this.clientForm = this.fb.group({
      clientId: ({ value: 1, disabled: true }),
      clientName: [''],
      clientEmail: [''],
      clientPhone: ['']
    });
  }

  getClientlist(): void {
    this.clientService.getClients()
      .subscribe(clientlist => this.clientlist = clientlist)
      console.log(`GetclientList: ${this.clientlist}`);
    }

  createClient() {
    this.clientForm.setValue({
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: ''
    });
    // this.addClicked = 'yes'
  }

  saveCreate() {
    const formInput = this.clientForm.value;
    this.addClicked = 'no';
    this.newClient = {
      id: formInput.clientId,
      name: formInput.clientName,
      email: formInput.clientEmail,
      phone: formInput.clientPhone
    }
    this.clientService.addClient(this.newClient)
      .subscribe(client => {
        this.clientlist.push(client);
      });
  }

  edit() {
    this.clientForm.patchValue({
      clientId: this.clientToUpdate!.id,
      clientName: this.clientToUpdate!.name,
      clientEmail: this.clientToUpdate!.email,
      clientPhone: this.clientToUpdate!.phone
    });
    // this.editClicked = 'yes'
  }

  save() {
    const formInput = this.clientForm.value;
    this.editClicked = 'no';
    this.clientToUpdate = {
      id: this.clientToUpdate!.id,
      name: formInput.clientName,
      email: formInput.clientEmail,
      phone: formInput.clientPhone
    }
      this.clientService.updateClient(this.clientToUpdate)
        .subscribe(() => {
          this.clientForm.patchValue({
            clientId: this.clientToUpdate!.id,
            clientName: this.clientToUpdate!.name,
            clientEmail: this.clientToUpdate!.email,
            clientPhone: this.clientToUpdate!.phone
          })
        });
    this.getClientlist();
  }

  delete(client: Client): void {
    this.clientlist = this.clientlist.filter(c => c !== client);
    this.clientService.deleteClient(client.id).subscribe();
  }

    onSubmit() {
      // TODO: Use EventEmitter with form value
      console.warn(this.clientForm.value);
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

  }
