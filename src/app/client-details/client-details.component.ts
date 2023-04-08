import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Client } from '../client';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ClientService } from '../client.service';
import { NgbActiveModal, NgbModal, NgbAlertModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientPageComponent } from '../client-page/client-page.component';
import { from, Subject } from 'rxjs';
import { distinct, map, debounceTime } from 'rxjs/operators';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  private _success = new Subject<string>();
  successMessage = '';

  selectedClient?: Client;
  clients: Client[] = []
  @Input() client: Client | undefined;
  @Input() clientForm!: FormGroup;

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  clientUpdate: Client | undefined;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private location: Location) { 
      this.clientForm = new FormGroup({
        clientId: new FormControl({ value: 1, disabled: true}, Validators.required),
        clientName: new FormControl(''),
        clientEmail: new FormControl(''),
        clientPhone: new FormControl('')
      });
    }

  ngOnInit(): void {
    this.getClientDetails();

    // Alert On Save - Self Closes After 5 Seconds
		this._success.subscribe((message) => (this.successMessage = message));
		this._success.pipe(debounceTime(5000)).subscribe(() => {
			if (this.selfClosingAlert) {
				this.selfClosingAlert.close();
			}
		});
  }

  getClientDetails(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.clientService.getClient(id)
      .subscribe(client => {
        this.client = client;
        this.clientForm.setValue({
          clientId: this.client.id,
          clientName: this.client.name,
          clientEmail: this.client.email,
          clientPhone: this.client.phone
        })
      });
  }

  onSubmit() {
    console.log(this.clientForm.value);
  }

  goBack(): void {
    this.location.back();
  }

  save() {
    const formInput = this.clientForm.value;
    this.clientUpdate = {
      id: this.client!.id,
      name: formInput.clientName,
      email: formInput.clientEmail,
      phone: formInput.clientPhone
    };
      this.clientService.updateClient(this.clientUpdate)
      .subscribe(() => {
        this.clientForm.patchValue({
          clientId: this.clientUpdate!.id,
          clientName: this.clientUpdate!.name,
          clientEmail: this.clientUpdate!.email,
          clientPhone: this.clientUpdate!.phone
        })
      });
        //alert('Changes Saved');
  }

  public changeSuccessMessage() {
		this._success.next(`Save Successful!   -   ${new Date()}`);
	}

}
