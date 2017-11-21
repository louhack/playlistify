import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { AlbumService } from './services/album.service';


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
  providers: [AlbumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
