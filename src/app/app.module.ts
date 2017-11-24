import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AlbumListComponent } from './components/album/album-list/album-list.component';
import { AlbumService } from './services/album.service';
import { SpotifyAuthService } from './services/spotify/spotify-auth.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlbumListComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [AlbumService, SpotifyAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
