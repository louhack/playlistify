import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

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
import { AlbumsModalComponent } from './components/album/albums-modal/albums-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlbumListComponent,
    LoginComponent,
    ErrorComponent,
    AlbumsModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
    AlbumService,
    SpotifyAuthService,
    UserService,
    SpotifyEndPoints,
    SpotifyApiService,
    MessageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlbumsModalComponent]
})
export class AppModule { }
