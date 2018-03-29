import { Component, OnInit, Input } from '@angular/core';
import { Event } from '@angular/router/src/events';
import { Http } from '@angular/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Album } from '../../../models/album.model';
import { SpotifyAuthService } from '../../../services/spotify/spotify-auth.service';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/album.service';
import { SpotifyPlaylist } from '../../../models/spotifyPlaylist.model';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';
import { AlbumsModalComponent } from '../albums-modal/albums-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: Album[] = [];
  albumSubscription: Subscription;

  totalNumberOfAlbums: number;
  totalNumberOfPages: number;
  currentPage: number;
  maxSize = 5;
  numPages = 0;
  itemsPerPage = 20;


  bsModalRef: BsModalRef;

  constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) {
    this.albumSubscription = albumsService.albumChanged.subscribe(
      albumChanged => {
        this.albumsList[albumChanged.index] = albumChanged.album;
      }
    );
  }

  ngOnInit() {
    this.albumsService.getAlbums(1, 20)
      .subscribe(albumsListI => {
        this.albumsList = albumsListI.albumsList;
        this.currentPage = albumsListI.currentPage;
        this.totalNumberOfPages = albumsListI.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
      });
  }

  pageChanged(event: any): void {
    this.albumsService.getAlbums(event.page, event.itemsPerPage)
      .subscribe(albumsListI => {
        this.albumsList = albumsListI.albumsList;
        this.currentPage = albumsListI.currentPage;
        this.totalNumberOfPages = albumsListI.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
      });
  }

  openModalWithComponent(albumIndex: number) {
    // retrieve albumsFound and pass them to the modal
    const album = this.albumsList[albumIndex];
    const initialState = {
      albumsFound: album.spotifySearchResults,
      title: album.albumName
    };
    this.bsModalRef = this.modalService.show(AlbumsModalComponent, {initialState});
    this.bsModalRef.content.albumIndex = albumIndex;
    this.bsModalRef.content.onChosenAlbum.subscribe((info: {index: number, spotifyId: string}) => {
      album.spotify.id = info.spotifyId;
      album.searchedOnSpotify = true;
      album.spotifySearchResults = [];
      this.albumsService.updateAlbumonDB(album).then(success => {
        // console.log('mise à jour album');
        this.updateAlbum(info.index, album);
        this.addToPlaylist(info.index);
      });
      console.log('depuis album list. index: ' + info.index + ' SpotifyId: ' + info.spotifyId);
    });
  }

  // numPages(event: any): void {

  // }

  // playlists: SpotifyPlaylist[] = [];
  // playlistsSubscription: Subscription;


    getDate(i: number) {
        return (MyCalendar.month[+this.albumsList[i].sputnikMusic.releaseDate.month - 1]) + ' ' + this.albumsList[i].sputnikMusic.releaseDate.year;
    }

    async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      // console.log(this.albumsList[index]);
      const album = this.albumsList[index];
      // console.log(album);

      if (!album.searchedOnSpotify) {
        // console.log('Searchin on spotify');
        await this.searchAlbumOnSpotify(index);
      }

      // console.log('Search finished');
      // console.log('Id spotifyfound', album.spotify.id);

      // album has a spotify id, it has alredy be search and found previously
      if (album.searchedOnSpotify && album.spotify.id !== '') {
        // console.log('ajouter album à la playlist');
        const spotifyAlbumId = this.albumsList[index].spotify.id;
        await this.spotifyApiService.addAlbumToPlaylist(
              spotifyAlbumId,
              this.userService.getSelectedPlaylistId()
        );
        this.albumsList[index].addedToPlaylist = this.userService.getSelectedPlaylistName();
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
                  // console.log('FoundAlbums');
                  // console.log(foundAlbums);
                  if (foundAlbums.length > 0) {
                    album.spotifySearchResults = foundAlbums;
                    album.searchedOnSpotify = true;

                    if (foundAlbums.length === 1) {
                      // if only one result, save the spotify album id for later
                      // than add album to the selected playlist
                      // console.log('alb list: ');
                      // console.log(album);
                      album.spotify.id = foundAlbums[0].id;
                      this.albumsService.updateAlbumonDB(album).then(success => {
                        // console.log('mise à jour album');
                        this.updateAlbum(index, album);
                      });
                    }
                    resolve(true);
                  } else {
                    // no result found for search with album+artist, search with only album
                    this.spotifyApiService.searchItem(album.albumName, 'album').subscribe(
                      (foundAlbums2: AlbumSpotify[]) => {
                        if (foundAlbums2.length > 0) {
                          // console.log('foundAlbums 2');
                          // console.log(foundAlbums2);
                          album.spotifySearchResults = foundAlbums2;
                          album.searchedOnSpotify = true;
                          if (foundAlbums2.length === 1) {
                            // console.log('mise à jour album if 2');
                            album.spotify.id = foundAlbums2[0].id;
                            this.albumsService.updateAlbumonDB(album).then(success => {
                            this.updateAlbum(index, album);
                            });
                          }
                          resolve(true);
                          } else {
                            album.searchedOnSpotify = true;
                            resolve(false);
                          }
                        });
                  }
              },
            err => console.log(err));
        });
    }

    updateAlbum(index: number, newAlbum: Album) {
      this.albumsList[index] = newAlbum;
    }

    // onChoose(index: number) {
    //   console.log(this.albumsList[index]);
    //   console.log(this.userService.getSelectedPlaylistId());
    // }

}

