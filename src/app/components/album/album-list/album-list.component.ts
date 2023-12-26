import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin, from, Observable, of, Subject, Subscription } from 'rxjs';

import { Album } from '../../../models/album.model';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/local/album.service';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';
import { AlbumsModalComponent } from '../albums-modal/albums-modal.component';
import { AlbumPlaylistI } from '../../../interfaces/albumAddedToPlaylist.interface';
import { switchMap, distinctUntilChanged, debounceTime, throwIfEmpty, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlbumsListI } from '../../../interfaces/albumsList.interface';
import { AlbumEditComponent } from '../album-edit/album-edit.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albums$: Observable<Album[]>;


  albumSubscription: Subscription;
  userSubscription: Subscription;

  public searchForm = new FormGroup(
    {
      search: new FormControl('', Validators.required),
      scope: new FormControl ('all', Validators.required),
      sources: new FormControl('allSources', Validators.required)
    }
    );

  private searchReq = new Subject<{searchData: string, searchScope: string, searchSources: string}>();

  pageParams = {
    totalNumberOfAlbums: 0,
    totalNumberOfPages: 0,
    currentPage: 1,
    maxSize: 5,
    numPages: 0,
    itemsPerPage: 20
  }



// Modal for playlist creation
bsModalRef: BsModalRef;

searchMode: boolean;


  // constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) {
  // // console.log('CONSTRUCTOR');
  //   // initPageParams();
  //   this.getAlbums(this.pageParams.currentPage, this.pageParams.itemsPerPage).then(
  //     (res) => {
  //       console.log("Got album");
  //       console.log(this.albumsListObs);
  //       if (res){
  //         console.log("return from promise " + res);
  //         this.userSubscription = this.userService.userChanged.subscribe(
  //           {next: () => {
  //               this.searchPlaylistifiedAlbums();
  //             }}
  //             );
  //       }
  //     }
  //   );


  //   this.albumSubscription = albumsService.albumChanged.subscribe(
  //     albumChanged => {
  //       this.albumsListObs.subscribe({next: observer => {
  //         observer[albumChanged.index] = albumChanged.album;
  //         this.albumsListObs = of(observer);
  //       }}
  //     )}
  //   );



  //   // setTimeout(() => {
  //     // this.userSubscription = userService.userChanged.subscribe( () => {
  //     //   this.searchPlaylistifiedAlbums();
  //     // });
  //   // },
  //   // 500);


  // }

  constructor(private albumsService: AlbumService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) {
    this.albums$ = this.albumsService.getAlbums(this.pageParams.currentPage, this.pageParams.itemsPerPage).pipe(
      map(albums => {
          return albums.albumsList;
        }
    ));

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
    // console.log('ON INIT');
    // initPageParams();


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
          this.pageParams.currentPage=1;
          return this.sendSearhReq(value.searchData,value.searchScope, value.searchSources, this.pageParams.currentPage, this.pageParams.itemsPerPage);
      }),
      // catchError(e => {
      //   console.log(e);
      //   // this.loading = false;
      //   return EMPTY;
      // }
      // )
    ).subscribe(albumsListI => {
      // console.log(albumsListI);
      if (!this.isEmptyObject(albumsListI)) {
        // console.log("found results");
        // this.responseToAlbumList(albumsListI);

        this.albums$ = of(albumsListI.albumsList);
        this.pageParams.currentPage = albumsListI.currentPage;
        this.pageParams.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
        this.pageParams.totalNumberOfPages = albumsListI.totalNumberOfPages;
      }
      else {
        // console.log("Display list");
        this.searchMode=false;
        this.pageParams.currentPage=1;
        this.getAlbums(this.pageParams.currentPage,this.pageParams.itemsPerPage);
      }

      });
  }
  sendSearhReq(searchData: string, searchScope: string, searchSources:string,page: number, resultLimit: number): Observable<any> {
    return this.albumsService.searchAlbum(searchData,searchScope, searchSources, page, resultLimit);
  }

  // responseToAlbumList(_albumsList: AlbumsListI){
  //   // console.log(_albumsList);
  //   this.albumsList = _albumsList.albumsList;
  //   this.currentPage = _albumsList.currentPage;
  //   this.totalNumberOfPages = _albumsList.totalNumberOfPages;
  //   this.totalNumberOfAlbums = _albumsList.totalNumberOfAlbums;
  //   this.searchPlaylistifiedAlbums();
  // }

  isEmptyObject(obj: Object): Boolean {
    return !Object.keys(obj).length;
  }

  async getAlbums(currentPage: number, itemsPerPage:number): Promise<boolean> {
    console.log("getting albums");
    return await this.getAlbumsAsync(currentPage, itemsPerPage);

  }
  async getAlbumsAsync(currentPage: number, itemsPerPage: number) {
    return new Promise<boolean>(
      (resolve,reject) => {
        this.albumsService.getAlbums(currentPage, itemsPerPage).subscribe({
          next: observer => {
            var albums:Album[] = observer.albumsList;
            this.albums$ = of(albums);
            this.pageParams.currentPage = observer.currentPage;
            this.pageParams.totalNumberOfAlbums = observer.totalNumberOfAlbums;
            this.pageParams.totalNumberOfPages = observer.totalNumberOfPages;
            // console.log(pageParams);
            console.log(this.albums$);

            if(this.albums$ != undefined){
              console.log("resolve with success")
              resolve(true);
            }
            else {
              reject(false);
            }
          }})
      });
      // return true;
      // .subscribe(albumsListI => {
      //   this.responseToAlbumList(albumsListI);
      // });  }
    }

  pageChanged(event: {page: number, itemsPerPage:number}): void {
    if (this.searchMode) {
    const _searchReqObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value,
      searchSources: this.searchForm.get('sources').value
    }
      this.sendSearhReq(_searchReqObj.searchData,_searchReqObj.searchScope, _searchReqObj.searchSources, event.page, event.itemsPerPage).subscribe((albumsListI: AlbumsListI) => {
        // console.log(albumsListI);
        if (!this.isEmptyObject(albumsListI)) {
          // console.log("found results");
          // this.responseToAlbumList(albumsListI);
          this.albums$ = of(albumsListI.albumsList);
          this.pageParams.currentPage = albumsListI.currentPage;
          this.pageParams.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
          this.pageParams.totalNumberOfPages = albumsListI.totalNumberOfPages;

        }
        else {
          // console.log("Display list");
          this.searchMode=false;
          this.pageParams.currentPage = 1;
          this.getAlbums(this.pageParams.currentPage, this.pageParams.itemsPerPage);
        }

        });

    } else {
      // console.log(event);
      this.getAlbums(event.page, event.itemsPerPage);
    }
      window.scroll(0, 0);
  }

  getAlbumFromID(index: string): Album {
    // Find the album with ID 123
    let album;
    this.albums$.subscribe((albums: Album[]) => {
      album = albums.find((album: Album) => album._id === index);
      if (album) {
        console.log(album);
        // return album;
      } else {
        console.log('Album not found');
        // return null;
      }
    });
    return album;
  }

  getAlbumFromObs(index: number): Album {
    let album: Album;
    this.albums$.subscribe({next: albums =>{
      album = albums[index];
    }});
    return album
  }

  openModalWithComponent(albumIndex: number) {
    // retrieve albumsFound and pass them to the modal
    let albumToUpdate = this.getAlbumFromObs(albumIndex);
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

  editReleaseModal(albumIndex: number){
    // retrieve albumsFound and pass them to the modal
    const albumToEdit = this.getAlbumFromObs(albumIndex);
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



  getDate(i: string, s: number) {
      let month: number;
      let year: number;

      console.log("i: " + i + " s: " +s);
      if (s === 0) {
        // month = +this.getAlbumFromObs(i).sputnikMusic.releaseDate.month - 1;
        // year = +this.getAlbumFromObs(i).sputnikMusic.releaseDate.year;

        return (MyCalendar.month[month]) + ' ' + year;

      } else if (s === 1) {
          // month = +this.getAlbumFromObs(i).heavyBIsH.releaseDate.month - 1;
          // year = +this.getAlbumFromObs(i).heavyBIsH.releaseDate.year;

          return (MyCalendar.month[month]) + ' ' + year;
      }  else if (s === 2) {
          console.log(this.getAlbumFromID(i));
          month = +this.getAlbumFromID(i).yourLastRites.releaseDate.month - 1;
          year = +this.getAlbumFromID(i).yourLastRites.releaseDate.year;

        return (MyCalendar.month[month]) + ' ' + year;
      }
  }

  async addToPlaylist(index: number) {
      // album not found or search on spotify preiously
      const album = this.getAlbumFromObs(index);

      if (!album.searchedOnSpotify) {
        //search the album
        await this.searchAlbumOnSpotify(index);
      }

      // album has a spotify id, it has alredy be search and found previously
      if (album.searchedOnSpotify && album.spotify) {
        const spotifyAlbumId = album.spotify.id;
        await this.spotifyApiService.addAlbumToPlaylist(
              spotifyAlbumId,
              this.userService.getSelectedPlaylistId()
        );

        const albumPlaylistToSave: AlbumPlaylistI = {
          idSpotify: this.userService.getSelectedPlaylistId(),
          name: this.userService.getSelectedPlaylistName(),
          userId: this.userService.getUserDbId(),
          albumId: this.getAlbumFromObs(index)._id
        };
        this.getAlbumFromObs(index).addedToPlaylist = albumPlaylistToSave;

        this.savePlaylist(this.getAlbumFromObs(index).addedToPlaylist);
      }
  }

  savePlaylist(savePlaylist: AlbumPlaylistI) {
      this.albumsService.savePlaylistAlbum(savePlaylist)
        .subscribe(
          //  album => console.log('REPONSE : ' + JSON.stringify(album))
        );
  }

  // loadPlaylistsForUserV0(AlbumsListI: albumsList) {
  //     //if user is authentified
  //     // search if albums of the page have already been added to a playlist

  //     console.log("search for playlistified albums");
  //     if (this.userService.isAuthenticated() && this.albums$ != undefined) {
  //        this.albums$.subscribe({next: albums => {
  //         albumsList = albums;
  //       }});
  //       // console.log(albumsList);
  //       this.albumsService.searchPlaylistifiedAlbums(albumsList, this.userService.getUserDbId()).subscribe(
  //             (playlists: AlbumPlaylistI[])  => {
  //               if (playlists != null) {
  //                 playlists.forEach(playlist => {
  //                   albumsList.
  //                   forEach( (album, index) => {
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

  loadPlaylistsForUser(albums$: Observable<Album[]>): Observable<Album[]> {
    if(this.userService.isAuthenticated() && this.albums$ != undefined){
    return albums$.pipe(
      switchMap((albums: Album[]) => {
        const observables = {};
        albums.forEach(album => {
          observables[album._id] = this.albumsService.searchPlaylistifiedAlbum(album, this.getUserService().getUserDbId());
        });
        return forkJoin(observables).pipe(
          map((results: any[]) => {
            results.forEach((result) => {
              const album = albums.find(a => a._id === result._id);
              if (album) {
                album.addedToPlaylist = result;
              }
            });
            return albums;
          })
        );
      })
    );
  }
  }

  searchAlbumOnSpotify(index: number): Promise < boolean > {
      return new Promise(
        resolve => {
        var album: Album;
        this.albums$.subscribe(
          {next: observer => {
            album = observer[index];
          }});
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

