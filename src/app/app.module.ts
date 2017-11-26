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
import { AlbumSputnikService } from './services/albumSputnik.service';


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
    HttpModule,
    AppRoutingModule,
  ],
  providers: [
    AlbumSputnikService,
    SpotifyAuthService,
    UserService,
    SpotifyEndPoints,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
