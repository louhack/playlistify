import { Component, OnInit } from '@angular/core';
import { AlbumSputnik } from '../../../models/albumSputnik.model';
import { Subscription } from 'rxjs/Subscription';
import { Http } from '@angular/http';
import { SpotifyAuthService } from '../../../services/spotify/spotify-auth.service';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumSputnikService } from '../../../services/albumSputnik.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: AlbumSputnik[] = [];
  albumsSubcription: Subscription;


  constructor(private albumsService: AlbumSputnikService, private userService: UserService) { }

  ngOnInit() {
    this.albumsList = this.albumsService.getAlbums();

     this.albumsSubcription = this.albumsService.albumsChanged.subscribe(
      (albums: AlbumSputnik[]) => {
        this.albumsList = albums;
     });
    }


    addToPlaylist(index: number) {
      console.log(this.albumsList[index]);
    }


}

