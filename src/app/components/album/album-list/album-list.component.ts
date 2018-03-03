import { Component, OnInit } from '@angular/core';
import { Album } from '../../../models/album.model';
import { Subscription } from 'rxjs/Subscription';
import { Http } from '@angular/http';
import { SpotifyAuthService } from '../../../services/spotify/spotify-auth.service';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/album.service';
import { SpotifyPlaylist } from '../../../models/spotifyPlaylist.model';
import { Event } from '@angular/router/src/events';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: Album[] = [];
  albumsSubscription: Subscription;

  // playlists: SpotifyPlaylist[] = [];
  // playlistsSubscription: Subscription;


  constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService) { }

  ngOnInit() {
    this.albumsList = this.albumsService.getAlbums();

     this.albumsSubscription = this.albumsService.albumsChanged.subscribe(
      (albums: Album[]) => {
        this.albumsList = albums;
     });

    //  this.playlists = this.userService.getPlaylists();

    //  this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
    //    (playlists: SpotifyPlaylist[]) => {
    //      this.playlists = playlists;
    //    }
    // );
  }

    getDate(i: number) {
        return (MyCalendar.month[+this.albumsList[i].sputnikMusic.releaseDate.month - 1]) + ' ' + this.albumsList[i].sputnikMusic.releaseDate.year;
    }

    async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      // console.log(this.albumsList[index]);
      const album = this.albumsList[index];
      // console.log(album);

      if (!album.searchedOnSpotify) {
        console.log('Searchin on spotify');
        await this.searchAlbumOnSpotify(index);
      }

      console.log('Search finished');
      console.log('Id spotifyfound', album.spotify.id);

      // album has a spotify id, it has alredy be search and found previously
      if (album.searchedOnSpotify && album.spotify.id !== '') {
        console.log('ajouter album à la playlist');
        const spotifyAlbumId = this.albumsList[index].spotify.id;
        await this.spotifyApiService.addAlbumToPlaylist(
              spotifyAlbumId,
              this.userService.getSelectedPlaylistId()
        );
      }
    }


    searchAlbumOnSpotify(index: number): Promise<boolean> {
      return new Promise(
        resolve => {
        const album = this.albumsList[index];
        this.spotifyApiService
          .searchItem('album:' + album.albumName + ' artist:' + album.artistName , 'album')
            .subscribe(
              (foundAlbums: AlbumSpotify[]) => {
                  console.log('FoundAlbums');
                  console.log(foundAlbums);
                  if (foundAlbums.length > 0) {
                    album.spotifySearchResults = foundAlbums;
                    album.searchedOnSpotify = true;

                    if (foundAlbums.length === 1) {
                      // if only one result, save the spotify album id for later
                      // than add album to the selected playlist
                      console.log('alb list: ');
                      console.log(album);
                      album.spotify.id = foundAlbums[0].id;
                      this.albumsService.updateAlbumonDB(album).then(success => {
                        console.log('mise à jour album');
                        this.albumsService.updateAlbum(index, album);
                      });
                    }
                    resolve(true);
                  } else {
                    // no result found for search with album+artist, search with only album
                    this.spotifyApiService.searchItem(album.albumName, 'album').subscribe(
                      (foundAlbums2: AlbumSpotify[]) => {
                        if (foundAlbums2.length > 0) {
                          console.log('foundAlbums 2');
                          console.log(foundAlbums2);
                          album.spotifySearchResults = foundAlbums2;
                          album.searchedOnSpotify = true;
                          if (foundAlbums2.length === 1) {
                            console.log('mise à jour album if 2');
                            album.spotify.id = foundAlbums2[0].id;
                            this.albumsService.updateAlbumonDB(album).then(success => {
                              this.albumsService.updateAlbum(index, album);
                            });
                          }
                          resolve(true);
                          } else {
                            resolve(false);
                          }
                        });
                  }
              },
            err => console.log(err));
        });
    }



    onChoose(index: number) {
      console.log(this.albumsList[index]);
      console.log(this.userService.getSelectedPlaylistId());
    }

}

