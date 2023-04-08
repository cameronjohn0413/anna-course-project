import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientPageComponent } from './client-page/client-page.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientMeetingComponent } from './client-meeting/client-meeting.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'clients', component: ClientPageComponent },
  { path: 'details/:id', component: ClientDetailsComponent },
  { path: 'meetings', component: ClientMeetingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
