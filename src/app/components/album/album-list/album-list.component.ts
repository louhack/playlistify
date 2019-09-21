import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { Album } from '../../../models/album.model';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/album.service';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';
import { AlbumsModalComponent } from '../albums-modal/albums-modal.component';
import { AlbumPlaylistI } from '../../../interfaces/albumAddedToPlaylist.interface';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: Album[] = [];
  albumSubscription: Subscription;
  userSubscription: Subscription;

  totalNumberOfAlbums: number;
  totalNumberOfPages: number;
  currentPage: number;
  maxSize = 5;
  numPages = 0;
  itemsPerPage = 20;

// Modal for playlist creation
bsModalRef: BsModalRef;

constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) {
  // console.log('CONSTRUCTOR');
  this.albumSubscription = albumsService.albumChanged.subscribe(
      albumChanged => {
        this.albumsList[albumChanged.index] = albumChanged.album;
      }
    );

    this.userSubscription = userService.userChanged.subscribe( () => {
      if (this.userService.isAuthenticated()) {
         this.searchPlaylistifiedAlbums();
       }
    }
    );


  }

  ngOnInit() {
    // console.log('ON INIT');
    this.albumsService.getAlbums(1, 20)
      .subscribe(albumsListI => {
        this.albumsList = albumsListI.albumsList;
        this.currentPage = albumsListI.currentPage;
        this.totalNumberOfPages = albumsListI.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
        if (this.userService.isAuthenticated()) {
          this.searchPlaylistifiedAlbums();
        }
      });
  }

  pageChanged(event: any): void {
    this.albumsService.getAlbums(event.page, event.itemsPerPage)
      .subscribe(albumsListI => {
        this. albumsList = albumsListI.albumsList;
        this.currentPage = albumsListI.currentPage;
        this.totalNumberOfPages = albumsListI.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
        if (this.userService.isAuthenticated()) {
          this.searchPlaylistifiedAlbums();
        }
      });
      window.scroll(0, 0);
  }

  openModalWithComponent(albumIndex: number) {
    // retrieve albumsFound and pass them to the modal
    const albumToUpdate = this.albumsList[albumIndex];
    // console.log('AlbumToUpdate: ' + JSON.stringify(albumToUpdate));
    const initialState = {
      albumsFound: albumToUpdate.spotifySearchResults,
      title: albumToUpdate.albumName,
      artist: albumToUpdate.artistName
    };
    this.bsModalRef = this.modalService.show(AlbumsModalComponent, {initialState});
    this.bsModalRef.content.albumIndex = albumIndex;
    this.bsModalRef.content.onChosenAlbum.subscribe((info: {resultIndex: number}) => {
      // console.log('Result Selected: ' + JSON.stringify(info.resultIndex));
      albumToUpdate.spotify = albumToUpdate.spotifySearchResults[info.resultIndex];
      albumToUpdate.searchedOnSpotify = true;
      albumToUpdate.spotifySearchResults = [];
      this.albumsService.updateAlbumOnDB(albumToUpdate).then( (albumUpdated: Album) => {
        albumUpdated.searchedOnSpotify = true;
        albumUpdated.spotifySearchResults = [];
        this.updateAlbum(albumIndex, albumUpdated);
        this.addToPlaylist(albumIndex);
      });
    });
  }



    getDate(i: number, s: number) {
      if (s === 0) {
        return (MyCalendar.month[+this.albumsList[i].sputnikMusic.releaseDate.month - 1]) + ' ' + this.albumsList[i].sputnikMusic.releaseDate.year;
      } else if (s === 1) {
        return (MyCalendar.month[+this.albumsList[i].heavyBIsH.releaseDate.month - 1]) + ' ' + this.albumsList[i].heavyBIsH.releaseDate.year;
      }  else if (s === 2) {
        return (MyCalendar.month[+this.albumsList[i].yourLastRites.releaseDate.month - 1]) + ' ' + this.albumsList[i].yourLastRites.releaseDate.year;
      }
    }

    async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      const album = this.albumsList[index];

      if (!album.searchedOnSpotify) {
        await this.searchAlbumOnSpotify(index);
      }

      // console.log('ALBUM : ' + JSON.stringify(album));

      // album has a spotify id, it has alredy be search and found previously
      if (album.searchedOnSpotify && album.spotify) {
        const spotifyAlbumId = this.albumsList[index].spotify.id;
        await this.spotifyApiService.addAlbumToPlaylist(
              spotifyAlbumId,
              this.userService.getSelectedPlaylistId()
        );

        const albumPlaylistToSave: AlbumPlaylistI = {
          idSpotify: this.userService.getSelectedPlaylistId(),
          name: this.userService.getSelectedPlaylistName(),
          userId: this.userService.getUserDbId(),
          albumId: this.albumsList[index]._id
        };
        this.albumsList[index].addedToPlaylist = albumPlaylistToSave;

        this.savePlaylist(this.albumsList[index].addedToPlaylist);
      }
    }

    savePlaylist(savePlaylist: AlbumPlaylistI) {
      this.albumsService.savePlaylistAlbum(savePlaylist)
        .subscribe(
          //  album => console.log('REPONSE : ' + JSON.stringify(album))
        );
    }

    searchPlaylistifiedAlbums() {
      // search if albums of the page have already been added to a playlist
      this.albumsService.searchPlaylistifiedAlbums(this.albumsList, this.userService.getUserDbId())
        .subscribe(
          (playlists: AlbumPlaylistI[])  => {
              if (playlists != null) {
                // const playlists = response['data'];
                playlists.forEach(playlist => {
                  this.albumsList.forEach( (album, index) => {
                    if (playlist.albumId === album._id) {
                      album.addedToPlaylist =  playlist;
                      this.updateAlbum(index, album);
                    }
                  });
                });
              }
            }
        );
    }

    searchAlbumOnSpotify(index: number): Promise<boolean> {
      return new Promise(
        resolve => {
        const album = this.albumsList[index];
        this.spotifyApiService
          .searchItem('album:' + album.albumName + ' artist:' + album.artistName , 'album')
            .subscribe(
              (foundAlbums: AlbumSpotify[]) => {

                  if (foundAlbums.length > 0) {
                    album.searchedOnSpotify = true;
                    if (foundAlbums.length === 1) {
                      // if only one result, save the spotify album id for later
                      // than add album to the selected playlist
                      album.spotify = foundAlbums[0];
                      this.albumsService.updateAlbumOnDB(album).then( (albumUpdated: Album) => {
                        albumUpdated.searchedOnSpotify = true;
                        albumUpdated.spotifySearchResults = [];
                        this.updateAlbum(index, albumUpdated);
                        // this.addToPlaylist(index);
                      });
                    } else {
                      album.spotifySearchResults = foundAlbums;
                    }
                    resolve(true);
                  } else {
                    // no result found for search with album+artist, search with only album
                    this.spotifyApiService.searchItem('artist:' + album.artistName, 'album').subscribe(
                      (foundAlbums2: AlbumSpotify[]) => {
                        if (foundAlbums2.length > 0) {
                          album.searchedOnSpotify = true;
                          if (foundAlbums2.length === 1) {
                            album.spotify = foundAlbums2[0];
                            this.albumsService.updateAlbumOnDB(album).then( (albumUpdated: Album) => {
                              albumUpdated.searchedOnSpotify = true;
                              albumUpdated.spotifySearchResults = [];
                              this.updateAlbum(index, albumUpdated);
                              // this.addToPlaylist(index);
                            });
                          } else {
                            album.spotifySearchResults = foundAlbums2;
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
      // this.albumsList[index] = newAlbum;
      this.albumsService.updateAlbum(index, newAlbum);
    }

}

