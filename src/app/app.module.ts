import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AlbumListComponent } from './components/album/album-list/album-list.component';
import { SpotifyAuthService } from './services/spotify/spotify-auth.service';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { UserService } from './services/spotify/user.service';
import { SpotifyEndPoints } from './services/spotify/spotifyApiEndpoints';
import { AlbumService } from './services/album.service';
import { SpotifyApiService } from './services/spotify/spotifyApi.service';
import { MessageService } from './services/message.service';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlbumListComponent,
    LoginComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    PaginationModule.forRoot(),
  ],
  providers: [
    AlbumService,
    SpotifyAuthService,
    UserService,
    SpotifyEndPoints,
    SpotifyApiService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
