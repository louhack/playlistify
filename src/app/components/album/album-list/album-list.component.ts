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
import { switchMap, distinctUntilChanged, debounceTime, throwIfEmpty, map, startWith, tap } from 'rxjs/operators';
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

  albums$: Observable<Album[]>;

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
    }

  //trigger when when user types in searchbar
  public searchEvent() {
    var searchRequestObj = {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value,
      searchSources: this.searchForm.get('sources').value
    };
    
    this.searchReq.next(searchRequestObj);
  }

  getUserService() {
    return this.userService;
  }

  ngOnInit() {
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
  // search(){
  //   this.searchReq.pipe(
  //     // wait 300ms after each keystroke before considering the term
  //     debounceTime(300),

  //     // ignore new term if same as previous term
  //     distinctUntilChanged(),

  //     // switch to new search observable each time the term changes
  //     switchMap((value) => {
  //       console.log(value);
  //       if (value.searchData === "" && value.searchSources === "allSources") {
  //         this.searchMode = false;
  //         this.currentPage = 1;
  //         return this.getAlbums(this.currentPage, this.itemsPerPage);
  //       }
  //       else {
  //         this.searchMode = true;
  //         this.currentPage=1;
  //         return this.sendSearchReq(value.searchData,value.searchScope, value.searchSources, this.currentPage, this.itemsPerPage)
  //       }
  //       return of(null);
  //     }),
  //     switchMap((albumsListI) => {
  //       if(albumsListI !== null && Array.isArray(albumsListI) && albumsListI.every(item => item instanceof Album)){
  //         return this.searchPlaylistifiedAlbums(albumsListI as Album[]);
  //       } else {
  //         this.affectSearchResults(albumsListI as AlbumsListI); // Cast the argument to AlbumsListI
  //         return this.searchPlaylistifiedAlbums((albumsListI as AlbumsListI).albumsList);
  //       }
  //     })
  //   ).subscribe();
  // }

  search() {
    this.searchReq.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.getSearchObservable(value)),
      switchMap((albumsListI) => this.getAlbumsObservable(albumsListI))
    ).subscribe();
  }
  
  getSearchObservable(value: any): Observable<AlbumsListI | Album[]> {
    if (value.searchData === "" && value.searchSources === "allSources") {
      this.searchMode = false;
      this.currentPage = 1;
      return this.getAlbums(this.currentPage, this.itemsPerPage);
    } else {
      this.searchMode = true;
      this.currentPage = 1;
      return this.sendSearchReq(value.searchData, value.searchScope, value.searchSources, this.currentPage, this.itemsPerPage);
    }
  }

  getAlbumsObservable(albumsListI: AlbumsListI | Album[]): Observable<Album[]> {
    if (albumsListI !== null && Array.isArray(albumsListI) && albumsListI.every(item => item instanceof Album)) {
      return this.searchPlaylistifiedAlbums(albumsListI as Album[]);
    } else {
      this.affectSearchResults(albumsListI as AlbumsListI);
      return this.searchPlaylistifiedAlbums((albumsListI as AlbumsListI).albumsList);
    }
  }

  sendSearchReq(searchData: string, searchScope: string, searchSources:string,page: number, resultLimit: number): Observable<AlbumsListI> {
    return this.albumsService.searchAlbum(searchData,searchScope, searchSources, page, resultLimit);
  }

  searchPlaylistifiedAlbums(albums: Album[]): Observable<Album[]> {
    if (this.userService.isAuthenticated()) {
      return this.albums$ = this.albumsService.searchPlaylistifiedAlbums(albums, this.userService.getUserDbId()).pipe(
        map((playlists: AlbumPlaylistI[]) => this.mapPlaylistsToAlbums(playlists, albums))
      );
    } else {
      return of(albums);
    }
  }

  mapPlaylistsToAlbums(playlists: AlbumPlaylistI[], albums: Album[]): Album[] {
    if (playlists != null) {
      const playlistMap = new Map(playlists.map(playlist => [playlist.albumId, playlist]));
      return albums.map((album) => {
        return playlistMap.has(album._id) ? { ...album, addedToPlaylist: playlistMap.get(album._id) } : album;
      });
    }
    return albums;
  }

  // searchPlaylistifiedAlbums(albums: Album[]): Observable<Album[]> {
  //   //if user is authenticated
  //   // search if albums of the page have already been added to a playlist
  //   if (this.userService.isAuthenticated()) {
  //     return this.albums$ = this.albumsService.searchPlaylistifiedAlbums(albums, this.userService.getUserDbId()).pipe(
  //       map((playlists: AlbumPlaylistI[])  => {
  //         if (playlists != null) {
  //           const playlistMap = new Map(playlists.map(playlist => [playlist.albumId, playlist]));
  //           albums.map((album, index) => {
  //             if (playlistMap.has(album._id)) {
  //               album.addedToPlaylist = playlistMap.get(album._id);
  //             }
  //           });
  //         }
  //         return albums;
  //       })
  //     );
  //   } else {
  //     return of(albums);      
  //   }
  // }


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
    return this.albumsService.getAlbums(_page, _itemsPerPage).pipe(
      tap((albumsList: AlbumsListI) => {
        this.totalNumberOfPages = albumsList.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsList.totalNumberOfAlbums;
      }),
      map((albumsList: AlbumsListI) => albumsList.albumsList)
    );
  }
  // getAlbums(_page: number, _itemsPerPage: number): Observable<Album[]> {
  //   return this.albums$ = this.albumsService.getAlbums(_page, _itemsPerPage).pipe(
  //     map((albumsList: AlbumsListI) => {
  //       this.totalNumberOfPages = albumsList.totalNumberOfPages;
  //       this.totalNumberOfAlbums = albumsList.totalNumberOfAlbums;
  //       return albumsList.albumsList;
  //     })
  //   ); 
  // }


  pageChanged(event: any): void {
    const page = event.page;
    const itemsPerPage = event.itemsPerPage;

    if (this.searchMode) {
      const searchReqObj = this.createSearchRequestObject();
      this.sendSearchReq(searchReqObj.searchData,searchReqObj.searchScope, searchReqObj.searchSources, page, itemsPerPage)
          .subscribe(albumsListI =>  this.affectSearchResults(albumsListI));
    } else {
      // console.log(event.page + " " + event.itemsPerPage);
      this.getAlbums(page, itemsPerPage)
        .subscribe(albums => this.albums$=this.searchPlaylistifiedAlbums(albums));
    }
      window.scroll(0, 0);
  }

  createSearchRequestObject() {
    return {
      searchData: this.searchForm.get('search').value,
      searchScope: this.searchForm.get('scope').value,
      searchSources: this.searchForm.get('sources').value
    };
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

    // // Get the album array
    // getAlbumsList(): Album[] {
    //   this.albums$.subscribe(albums => {
    //     if (albums.length >= 1) {
    //       return albums;
    //     }
    //   });
    //   return null;
    // }
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
        this.updateAlbum(albumIndex, albumUpdated);
        this.bsModalRef.content.updated = true;
        this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[0];
      },
        error: (e) => {
        this.bsModalRef.content.updated = true;
        this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[1];
        console.log(e);
      }});
  });
}



  getDate({month: monthNumber, year: yearNumber}) {
        return (MyCalendar.month[monthNumber - 1]) + ' ' + yearNumber;
  }

  // async addToPlaylist(index: number) {
  //     // album not found or search on spotify preiously
  //     const album = await this.selectAlbumAtIndex(index);
  //     if (album) {
  //       if (!album.searchedOnSpotify) {
  //         //search the album
  //         await this.searchAlbumOnSpotify(index);
  //       }

  //       // album has a spotify id, it has alredy be search and found previously
  //       if (album.searchedOnSpotify && album.spotify) {
  //         await this.spotifyApiService.addAlbumToPlaylist(
  //               album.spotify.id,
  //               this.userService.getSelectedPlaylistId()
  //         );

  //         const albumPlaylistToSave: AlbumPlaylistI = {
  //           idSpotify: this.userService.getSelectedPlaylistId(),
  //           name: this.userService.getSelectedPlaylistName(),
  //           userId: this.userService.getUserDbId(),
  //           albumId: album._id
  //         };
  //         album.addedToPlaylist = albumPlaylistToSave;

  //         this.savePlaylist(album.addedToPlaylist);
  //       }
  //   } else {
  //     console.error(`No album found at index ${index}`);
  //   }
  // }

  // savePlaylist(savePlaylist: AlbumPlaylistI) {
  //     this.albumsService.savePlaylistAlbum(savePlaylist)
  //       .subscribe(() => { });
  // }

  async addToPlaylist(index: number) {
    const album = await this.selectAlbumAtIndex(index);
    if (!album) {
      console.error(`No album found at index ${index}`);
      return;
    }
  
    if (!album.searchedOnSpotify) {
      await this.searchAlbumOnSpotify(index);
    }
  
    if (!album.searchedOnSpotify || !album.spotify) {
      return;
    }
  
    await this.spotifyApiService.addAlbumToPlaylist(
      album.spotify.id,
      this.userService.getSelectedPlaylistId()
    );
  
    const albumPlaylistToSave: AlbumPlaylistI = this.createAlbumPlaylist(album);
    album.addedToPlaylist = albumPlaylistToSave;
  
    this.savePlaylist(album.addedToPlaylist);
  }
  
  createAlbumPlaylist(album: Album): AlbumPlaylistI {
    return {
      idSpotify: this.userService.getSelectedPlaylistId(),
      name: this.userService.getSelectedPlaylistName(),
      userId: this.userService.getUserDbId(),
      albumId: album._id
    };
  }
  
  savePlaylist(savePlaylist: AlbumPlaylistI) {
    this.albumsService.savePlaylistAlbum(savePlaylist).subscribe();
  }

  /**
   * Searches for an album on Spotify based on the given index.
   * @param index - The index of the album to search.
   * @returns A promise that resolves to a boolean indicating whether the search was successful.
   */
  async searchAlbumOnSpotify(index: number): Promise<boolean> {
    const album = await this.selectAlbumAtIndex(index);
    const searchQueries = [
      `album:${album.albumName} artist:${album.artistName}`,
      `artist:${album.artistName}`
    ];
  
    for (const query of searchQueries) {
      const foundAlbums: AlbumSpotify[] = await this.spotifyApiService.searchItem(query, 'album').toPromise();
  
      console.log('foundAlbums: ' + foundAlbums.length);
  
      if (foundAlbums.length > 0) {
        album.searchedOnSpotify = true;
  
        if (foundAlbums.length === 1) {
          album.spotify = foundAlbums[0];
          const albumUpdated: Album = await this.albumsService.updateAlbumOnDB(album).toPromise();
          albumUpdated.searchedOnSpotify = true;
          albumUpdated.spotifySearchResults = [];
          this.updateAlbum(index, albumUpdated);
        } else {
          album.spotifySearchResults = foundAlbums;
        }
  
        return true;
      }
    }
  
    album.searchedOnSpotify = true;
    return false;
  }
  // searchAlbumOnSpotify(index: number): Promise < boolean > {
  //     return new Promise(
  //       async resolve => {
  //       const album = await this.selectAlbumAtIndex(index);
  //       this.spotifyApiService
  //         .searchItem('album:' + album.albumName + ' artist:' + album.artistName , 'album')
  //           .subscribe(
  //             (foundAlbums: AlbumSpotify[]) => {
  //                 console.log('foundAlbums: ' + foundAlbums.length);

  //                 if (foundAlbums.length > 0) {
  //                   album.searchedOnSpotify = true;
  //                   if (foundAlbums.length === 1) {
  //                     // if only one result, save the spotify album id for later
  //                     // than add album to the selected playlist
  //                     album.spotify = foundAlbums[0];
  //                     this.albumsService.updateAlbumOnDB(album).subscribe( (albumUpdated: Album) => {
  //                       albumUpdated.searchedOnSpotify = true;
  //                       albumUpdated.spotifySearchResults = [];
  //                       this.updateAlbum(index, albumUpdated);
  //                       // this.addToPlaylist(index);
  //                     });
  //                   } else {
  //                     album.spotifySearchResults = foundAlbums;
  //                   }
  //                   resolve(true);
  //                 } else {
  //                   // no result found for search with album+artist, search with only album
  //                   this.spotifyApiService.searchItem('artist:' + album.artistName, 'album').subscribe(
  //                     (foundAlbums2: AlbumSpotify[]) => {
  //                       if (foundAlbums2.length > 0) {
  //                         album.searchedOnSpotify = true;
  //                         if (foundAlbums2.length === 1) {
  //                           album.spotify = foundAlbums2[0];
  //                           this.albumsService.updateAlbumOnDB(album).subscribe( (albumUpdated: Album) => {
  //                             albumUpdated.searchedOnSpotify = true;
  //                             albumUpdated.spotifySearchResults = [];
  //                             this.updateAlbum(index, albumUpdated);
  //                             // this.addToPlaylist(index);
  //                           });
  //                         } else {
  //                           album.spotifySearchResults = foundAlbums2;
  //                         }
  //                         resolve(true);
  //                         } else {
  //                           album.searchedOnSpotify = true;
  //                           resolve(false);
  //                         }
  //                       });
  //                 }
  //             },
  //           err => console.log(err));
  //       });
  // }

  updateAlbum(index: number, newAlbum: Album) {
      this.albumsService.updateAlbum(index, newAlbum);
  }

  changedSourceEvent(){
    this.searchEvent();
  }

}

function complete(complete: any, arg1: (albumUpdated: Album) => void, error: any, arg3: (e: any) => void) {
  throw new Error('Function not implemented.');
}

