import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumListComponent } from './components/album/album-list/album-list.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';


const routes: Routes = [
  { path: '', redirectTo: '/sputnik', pathMatch: 'full' },
  {
    path: 'sputnik', component: AlbumListComponent
  },
  { path: 'login', component: LoginComponent},
  { path: 'error', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
