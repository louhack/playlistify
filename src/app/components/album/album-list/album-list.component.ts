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
import { switchMap, distinctUntilChanged, debounceTime, throwIfEmpty, map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlbumsListI } from '../../../interfaces/albumsList.interface';
import { AlbumEditComponent } from '../album-edit/album-edit.component';
import { Inject } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  // albumsList$: Observable<AlbumsListI>;
  albums$: Observable<Album[]>;

  // albumSubscription: Subscription;
  userSubscription: Subscription;

  public searchForm = new FormGroup(
    {
      search: new FormControl('', Validators.required),
      scope: new FormControl ('all', Validators.required),
      sources: new FormControl('allSources', Validators.required)
    }
    );

  private searchReq = new Subject<{searchData: string, searchScope: string, searchSources: string}>();

  totalNumberOfAlbums: number;
  totalNumberOfPages: number;
  currentPage = 1;
  maxSize = 5;
  numPages = 0;
  itemsPerPage = 20;

// Modal for playlist creation
bsModalRef: BsModalRef;

searchMode: boolean;

  constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, @Inject(BsModalService) private modalService: BsModalService) {
    // console.log('CONSTRUCTOR');
      // this.albumSubscription = albumsService.albumChanged.subscribe(
      //   albumChanged => {
      //     this.albumsList[albumChanged.index] = albumChanged.album;
      // });


    }

  //trigger when when user types in searchbar
  public searchEvent() {
    var searchRequestObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value,
      searchSources: this.searchForm.get('sources').value
    };

    // console.log(searchRequestObj);
    //see ngOnInit
    this.searchReq.next(searchRequestObj);
  }

  getUserService() {
    return this.userService;
  }

  ngOnInit() {
    // this.getAlbums(1, this.itemsPerPage);
    this.userService.userChanged.pipe(
      startWith(null),
      switchMap(() => this.getAlbums(this.currentPage, this.itemsPerPage)),
      switchMap((albums) => this.searchPlaylistifiedAlbums(albums))
    ).subscribe(albums => {
      this.albums$ = of(albums);
    });

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
        if (value.searchData === "") {
          this.searchMode = false;
          this.currentPage = 1;
          this.searchForm.setValue({search: '', scope: 'all', sources: 'allSources'});
          this.getAlbums(this.currentPage, this.itemsPerPage);
        }
        else {
          this.searchMode = true;
          this.currentPage=1;
          return this.sendSearchReq(value.searchData,value.searchScope, value.searchSources, this.currentPage, this.itemsPerPage)
        }
        return of(null);
      }),
      switchMap((albumsListI) => {
        if(albumsListI !== null){
          this.affectSearchResults(albumsListI);
          return this.searchPlaylistifiedAlbums(albumsListI.albumsList);
        } else {
          return this.searchPlaylistifiedAlbums(this.getAlbumsList());
        }
      })
    ).subscribe();
  }

  
  sendSearchReq(searchData: string, searchScope: string, searchSources:string,page: number, resultLimit: number): Observable<AlbumsListI> {
    return this.albumsService.searchAlbum(searchData,searchScope, searchSources, page, resultLimit);
  }

  searchPlaylistifiedAlbums(albums: Album[]): Observable<Album[]> {
    //if user is authenticated
    // search if albums of the page have already been added to a playlist
    if (this.userService.isAuthenticated()) {
      return this.albums$ = this.albumsService.searchPlaylistifiedAlbums(albums, this.userService.getUserDbId()).pipe(
        map((playlists: AlbumPlaylistI[])  => {
          if (playlists != null) {
            const playlistMap = new Map(playlists.map(playlist => [playlist.albumId, playlist]));
            albums.map((album, index) => {
              if (playlistMap.has(album._id)) {
                album.addedToPlaylist = playlistMap.get(album._id);
                // this.updateAlbum(index, album);
              }
            });
          }
          return albums;
        })
      );
    } else {
      return of(albums);
      //of(null);
      
    }
  }

  affectSearchResults(albumsListI: AlbumsListI){
    if (!this.isEmptyObject(albumsListI) && albumsListI.albumsList.length > 0) {
    this.totalNumberOfPages = albumsListI.totalNumberOfPages;
    this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
    this.albums$ = of(albumsListI.albumsList);
    }
    else {
      this.searchMode=false;
      this.currentPage = 1;
      this.totalNumberOfAlbums=0;
      this.totalNumberOfPages=0;
      this.albums$ = of(null);
    }
  }

  isEmptyObject(obj: Object): Boolean {
    return !Object.keys(obj).length;
  }

  getAlbums(_page: number, _itemsPerPage: number): Observable<Album[]> {
    return this.albums$ = this.albumsService.getAlbums(_page, _itemsPerPage).pipe(
      map((albumsList: AlbumsListI) => {
        // this.currentPage = albumsList.currentPage;
        this.totalNumberOfPages = albumsList.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsList.totalNumberOfAlbums;
        return albumsList.albumsList;
      })
    ); 
  }


  pageChanged(event: any): void {
    if (this.searchMode) {
    const _searchReqObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value,
      searchSources: this.searchForm.get('sources').value
    }
      this.sendSearchReq(_searchReqObj.searchData,_searchReqObj.searchScope, _searchReqObj.searchSources, event.page, event.itemsPerPage).subscribe(albumsListI => {
        this.affectSearchResults(albumsListI);
      });

    } else {
      console.log(event.page + " " + event.itemsPerPage);
      this.getAlbums(event.page, event.itemsPerPage).subscribe(albums => {
        this.searchPlaylistifiedAlbums(albums);
      });
    }
      window.scroll(0, 0);
  }

    // Function to select a specific index of the albums array
    selectAlbumAtIndex(index: number): Promise<Album> {
      return new Promise((resolve, reject) => {
        this.albums$.subscribe(albums => {
          if (albums.length > index && index >= 0) {
            resolve(albums[index]);
          } else {
            reject('Invalid index');
          }
        });
      });
    }

    // Get the album array
    getAlbumsList(): Album[] {
      this.albums$.subscribe(albums => {
        if (albums.length >= 1) {
          return albums;
        }
      });
      return null;
    }
  async openModalWithComponent(albumIndex: number) {
    // retrieve albumsFound and pass them to the modal
    const albumToUpdate = await this.selectAlbumAtIndex(albumIndex);
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
      this.albumsService.updateAlbumOnDB(albumToUpdate).subscribe( (albumUpdated: Album) => {
        albumUpdated.searchedOnSpotify = true;
        albumUpdated.spotifySearchResults = [];
        this.updateAlbum(albumIndex, albumUpdated);
        this.addToPlaylist(albumIndex);
      });
    });
  }

  async editReleaseModal(albumIndex: number){
    // retrieve albumsFound and pass them to the modal
    const albumToEdit = await this.selectAlbumAtIndex(albumIndex);
    // console.log('AlbumToUpdate: ' + JSON.stringify(albumToUpdate));
    const initialState = {
      album: albumToEdit,
      updated: false
    };
    this.bsModalRef = this.modalService.show(AlbumEditComponent, {initialState});
    this.bsModalRef.content.onUpdateAlbum.subscribe((album: {albumToUpdate: Album} ) => {
      this.albumsService.updateAlbumOnDB(album.albumToUpdate).subscribe( {
        next: (albumUpdated: Album) => {
        // albumUpdated.searchedOnSpotify = true;
        // albumUpdated.spotifySearchResults = [];
        this.updateAlbum(albumIndex, albumUpdated);
        // this.addToPlaylist(albumIndex);
        this.bsModalRef.content.updated = true;
        this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[0];
      },
        error: (e) => {
        this.bsModalRef.content.updated = true;
        this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[1];
        console.log(e);
      }});

// this.bsModalRef.content.albumIndex = albumIndex;
  });
}



  async getDate(i: number, s: number) {
      if (s === 0) {
        console.log((await this.selectAlbumAtIndex(i)).sputnikMusic.releaseDate.month); 
        return (MyCalendar.month[+ await (await this.selectAlbumAtIndex(i)).sputnikMusic.releaseDate.month - 1]) + ' ' + (await this.selectAlbumAtIndex(i)).sputnikMusic.releaseDate.year;
      } else if (s === 1) {
        console.log(await (await this.selectAlbumAtIndex(i)).heavyBIsH.releaseDate.month);
        return (MyCalendar.month[+(await this.selectAlbumAtIndex(i)).heavyBIsH.releaseDate.month - 1]) + ' ' + (await this.selectAlbumAtIndex(i)).heavyBIsH.releaseDate.year;
      }  else if (s === 2) {
        console.log((await this.selectAlbumAtIndex(i)).yourLastRites.releaseDate.month);
        return (MyCalendar.month[+(await this.selectAlbumAtIndex(i)).yourLastRites.releaseDate.month - 1]) + ' ' + (await this.selectAlbumAtIndex(i)).yourLastRites.releaseDate.year;
      }
  }

  async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      const album = await this.selectAlbumAtIndex(index);
      if (album) {
        if (!album.searchedOnSpotify) {
          //search the album
          await this.searchAlbumOnSpotify(index);
        }

        // album has a spotify id, it has alredy be search and found previously
        if (album.searchedOnSpotify && album.spotify) {
          // const spotifyAlbumId = (await this.selectAlbumAtIndex(index)).spotify.id;
          await this.spotifyApiService.addAlbumToPlaylist(
                album.spotify.id,
                this.userService.getSelectedPlaylistId()
          );

          const albumPlaylistToSave: AlbumPlaylistI = {
            idSpotify: this.userService.getSelectedPlaylistId(),
            name: this.userService.getSelectedPlaylistName(),
            userId: this.userService.getUserDbId(),
            albumId: album._id
          };
          album.addedToPlaylist = albumPlaylistToSave;

          this.savePlaylist(album.addedToPlaylist);
        }
    } else {
      console.error(`No album found at index ${index}`);
    }
  }

  savePlaylist(savePlaylist: AlbumPlaylistI) {
      this.albumsService.savePlaylistAlbum(savePlaylist)
        .subscribe(() => {
          // if (this.searchMode) {
          //   this.searchEvent();
          // }else{
          //   this.albums$=this.getAlbums(this.currentPage, this.itemsPerPage);
          // }
          //  album => console.log('REPONSE : ' + JSON.stringify(album))
        });
  }

  // searchPlaylistifiedAlbums() {
  //     //if user is authentified
  //     // search if albums of the page have already been added to a playlist
  //     if (this.userService.isAuthenticated()) {
  //       this.albumsService.searchPlaylistifiedAlbums(this.getAlbumsList(), this.userService.getUserDbId()).subscribe(
  //             (playlists: AlbumPlaylistI[])  => {
  //               if (playlists != null) {
  //                 playlists.forEach(playlist => {
  //                   this.getAlbumsList().forEach( (album, index) => {
  //                     if (playlist.albumId === album._id) {
  //                       album.addedToPlaylist =  playlist;
  //                       this.updateAlbum(index, album);
  //                     }
  //                   });
  //                 });
  //               }
  //             }
  //           );
  //     }
  // }



  searchAlbumOnSpotify(index: number): Promise < boolean > {
      return new Promise(
        async resolve => {
        const album = await this.selectAlbumAtIndex(index);
        this.spotifyApiService
          .searchItem('album:' + album.albumName + ' artist:' + album.artistName , 'album')
            .subscribe(
              (foundAlbums: AlbumSpotify[]) => {
                  console.log('foundAlbums: ' + foundAlbums.length);

                  if (foundAlbums.length > 0) {
                    album.searchedOnSpotify = true;
                    if (foundAlbums.length === 1) {
                      // if only one result, save the spotify album id for later
                      // than add album to the selected playlist
                      album.spotify = foundAlbums[0];
                      this.albumsService.updateAlbumOnDB(album).subscribe( (albumUpdated: Album) => {
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
                            this.albumsService.updateAlbumOnDB(album).subscribe( (albumUpdated: Album) => {
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

  changedSourceEvent(){
    // console.log("changedSource");
    this.searchEvent();
  }

}

function complete(complete: any, arg1: (albumUpdated: Album) => void, error: any, arg3: (e: any) => void) {
  throw new Error('Function not implemented.');
}

