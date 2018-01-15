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

  // playlists: SpotifyPlaylist[] = [];
  // playlistsSubscription: Subscription;


  constructor(private albumsService: AlbumSputnikService, private userService: UserService, private spotifyApiService: SpotifyApiService) { }

  ngOnInit() {
    this.albumsList = this.albumsService.getAlbums();

     this.albumsSubscription = this.albumsService.albumsChanged.subscribe(
      (albums: AlbumSputnik[]) => {
        this.albumsList = albums;
     });

    //  this.playlists = this.userService.getPlaylists();

    //  this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
    //    (playlists: SpotifyPlaylist[]) => {
    //      this.playlists = playlists;
    //    }
    // );
  }


    async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      const spotifyAlbumId = this.albumsList[index].spotifyId;
      if (!spotifyAlbumId) {
        await this.searchAlbumOnSpotify(index);
      }
        // album has a spotify id, it has alredy be search and found previously
        this.spotifyApiService.addAlbumToPlaylist(spotifyAlbumId, this.userService.getSelectedPlaylistId());

    }

    searchAlbumOnSpotify(index: number) {
      const album = this.albumsList[index];

        this.spotifyApiService
          .searchItem('album:' + album.albumName + ' artist:' + album.artistName , 'album')
            .subscribe(
              (foundAlbums: AlbumSpotify[]) => {
                  // console.log(albumList);
                  if (foundAlbums.length > 0) {
                    this.albumsList[index].spotifySearchResults = foundAlbums;
                    this.albumsList[index].searchedOnSpotify = true;

                    if (foundAlbums.length === 1) {
                      // if only one result, save the spotify album id for later
                      // than add album to the selected playlist
                      this.albumsList[index].spotifyId = foundAlbums[0].id;
                      this.albumsService.updateAlbum(this.albumsList[index]);
                    }
                  } else {
                    // no result found for search with album+artist, search with only album
                    this.spotifyApiService.searchItem(this.albumsList[index].albumName, 'album').subscribe(
                        (foundAlbums2: AlbumSpotify[]) => {
                          // console.log(albList);
                          this.albumsList[index].spotifySearchResults = foundAlbums2;
                          this.albumsList[index].searchedOnSpotify = true;
                        });
                  }
              });
    }



    onChoose(index: number) {
      console.log(this.albumsList[index]);
      console.log(this.userService.getSelectedPlaylistId());
    }

}

