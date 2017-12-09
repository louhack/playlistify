import { Component, OnInit } from '@angular/core';
import { AlbumSputnik } from '../../../models/albumSputnik.model';
import { Subscription } from 'rxjs/Subscription';
import { Http } from '@angular/http';
import { SpotifyAuthService } from '../../../services/spotify/spotify-auth.service';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumSputnikService } from '../../../services/albumSputnik.service';
import { SpotifyPlaylist } from '../../../models/spotifyPlaylist.model';
import { Event } from '@angular/router/src/events';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: AlbumSputnik[] = [];
  albumsSubscription: Subscription;

  playlists: SpotifyPlaylist[] = [];
  playlistsSubscription: Subscription;


  constructor(private albumsService: AlbumSputnikService, private userService: UserService, private spotifyApiService: SpotifyApiService) { }

  ngOnInit() {
    this.albumsList = this.albumsService.getAlbums();

     this.albumsSubscription = this.albumsService.albumsChanged.subscribe(
      (albums: AlbumSputnik[]) => {
        this.albumsList = albums;
     });

     this.playlists = this.userService.getPlaylists();

     this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
       (playlists: SpotifyPlaylist[]) => {
         this.playlists = playlists;
       }
     );
  }


    addToPlaylist(index: number) {
      this.spotifyApiService.searchItem(this.albumsList[index].albumName, 'album')
        .subscribe(
          (albumList: AlbumSpotify[]) => {
              console.log(albumList);
              this.albumsList[index].spotifySearchResults = albumList;
              this.albumsList[index].searchedOnSpotify = true;

              // Add to selected playlist if one result
              // if more than 1 : display a button to choose the right one
          });
    }

    onPlaylistChange(id: string) {
      console.log(JSON.stringify(id));

    }

    onChoose(index: number) {
      console.log(this.albumsList[index]);
    }

}

