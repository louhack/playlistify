import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription } from 'rxjs';

import { Album } from '../../../models/album.model';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/local/album.service';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';
import { AlbumsModalComponent } from '../albums-modal/albums-modal.component';
import { AlbumPlaylistI } from '../../../interfaces/albumAddedToPlaylist.interface';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlbumsListI } from '../../../interfaces/albumsList.interface';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: Album[];

  albumSubscription: Subscription;
  userSubscription: Subscription;

  public searchForm = new FormGroup(
    {
      search: new FormControl('', Validators.required),
      scope: new FormControl ('all', Validators.required)
    }
    );

  private searchReq = new Subject<{searchData: string, searchScope: string}>();

  totalNumberOfAlbums: number;
  totalNumberOfPages: number;
  currentPage: number;
  maxSize = 5;
  numPages = 0;
  itemsPerPage = 20;

// Modal for playlist creation
bsModalRef: BsModalRef;

searchMode: boolean;

  constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) {
  // console.log('CONSTRUCTOR');
    this.albumSubscription = albumsService.albumChanged.subscribe(
      albumChanged => {
        this.albumsList[albumChanged.index] = albumChanged.album;
    });

    this.userSubscription = userService.userChanged.subscribe( () => {
         this.searchPlaylistifiedAlbums();
    });
  }

  //trigger when when user types in searchbar
  public searchEvent() {
    var searchRequestObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value
    };

    console.log(searchRequestObj);
    //see ngOnInit
    this.searchReq.next(searchRequestObj);
  }

  getUserService() {
    return this.userService;
  }

  ngOnInit() {
    // console.log('ON INIT');
      this.getAlbums(1, this.itemsPerPage);

      //search logic
      this.search();
  }

  //search each time the content of the search bar has changed
  search(){
    this.searchReq.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((value) => {
          this.searchMode = true;
          this.currentPage=1;
          return this.sendSearhReq(value.searchData,value.searchScope, this.currentPage, this.itemsPerPage);
      }),
      // catchError(e => {
      //   console.log(e);
      //   // this.loading = false;
      //   return EMPTY;
      // }
      // )
    ).subscribe(albumsListI => {
      console.log(albumsListI);
      if (!this.isEmptyObject(albumsListI)) {
        console.log("found results");
        this.responseToAlbumList(albumsListI);
      }
      else {
        console.log("Display list");
        this.searchMode=false;
        this.currentPage=1;
        this.getAlbums(this.currentPage, this.itemsPerPage);
      }

      });
  }
  sendSearhReq(searchData: string, searchScope: string, page: number, resultLimit: number): Observable<any> {
    return this.albumsService.searchAlbum(searchData,searchScope, page, resultLimit);
  }

  responseToAlbumList(_albumsList: AlbumsListI){
    console.log(_albumsList);
    this.albumsList = _albumsList.albumsList;
    this.currentPage = _albumsList.currentPage;
    this.totalNumberOfPages = _albumsList.totalNumberOfPages;
    this.totalNumberOfAlbums = _albumsList.totalNumberOfAlbums;
    this.searchPlaylistifiedAlbums();
  }

  isEmptyObject(obj: Object): Boolean {
    return !Object.keys(obj).length;
  }

  getAlbums(_page: number, _itemsPerPage: number){
    this.albumsService.getAlbums(_page, _itemsPerPage)
      .subscribe(albumsListI => {
        this.responseToAlbumList(albumsListI);
      });
  }


  pageChanged(event: any): void {
    if (this.searchMode) {
    const _searchReqObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value
    }
      this.sendSearhReq(_searchReqObj.searchData,_searchReqObj.searchScope, event.page, event.itemsPerPage).subscribe(albumsListI => {
        console.log(albumsListI);
        if (!this.isEmptyObject(albumsListI)) {
          console.log("found results");
          this.responseToAlbumList(albumsListI);
        }
        else {
          console.log("Display list");
          this.searchMode=false;
          this.currentPage = 1;
          this.getAlbums(this.currentPage, this.itemsPerPage);
        }

        });

    } else {
      this.getAlbums(event.page, event.itemsPerPage);
    }
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
      //if user is authentified
      // search if albums of the page have already been added to a playlist
      if (this.userService.isAuthenticated()) {
        this.albumsService.searchPlaylistifiedAlbums(this.albumsList, this.userService.getUserDbId()).subscribe(
              (playlists: AlbumPlaylistI[])  => {
                if (playlists != null) {
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
  }

  searchAlbumOnSpotify(index: number): Promise < boolean > {
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

