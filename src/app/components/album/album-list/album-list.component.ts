import { Component, OnInit, ChangeDetectionStrategy, Inject, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Album } from '../../../models/album.model';
import { UserService } from '../../../services/spotify/user.service';
import { AlbumService } from '../../../services/local/album.service';
import { SpotifyApiService } from '../../../services/spotify/spotifyApi.service';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { MyCalendar } from '../../../shared/myCalendar';
import { AlbumsModalComponent } from '../albums-modal/albums-modal.component';
import { AlbumPlaylistI } from '../../../interfaces/albumAddedToPlaylist.interface';
import { AlbumsListI } from '../../../interfaces/albumsList.interface';
import { AlbumEditComponent } from '../album-edit/album-edit.component';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumListComponent implements OnInit, OnDestroy {
  albums$: Observable<Album[]> = of([]);
  private userSubscription: Subscription;
  private bsModalRef: BsModalRef;
  private searchReq = new Subject<{ searchData: string, searchScope: string, searchSources: string }>();

  searchMode: boolean;
  noResultsFound: boolean = false;

  public searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
    scope: new FormControl('all', Validators.required),
    sources: new FormControl('allSources', Validators.required)
  });

  totalNumberOfAlbums: number;
  totalNumberOfPages: number;
  currentPage = 1;
  maxSize = 5;
  itemsPerPage = 20;

  constructor(
    private albumsService: AlbumService,
    private userService: UserService,
    private spotifyApiService: SpotifyApiService,
    @Inject(BsModalService) private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeAlbums();
    this.initializeSearch();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private initializeAlbums(): void {
    this.userSubscription = this.userService.userChanged.pipe(
      startWith(null),
      switchMap(() => this.getAlbums(this.currentPage, this.itemsPerPage)),
      switchMap(albums => this.searchPlaylistifiedAlbums(albums))
    ).subscribe(albums => {
      console.log('Albums loaded on init:', albums);
      this.albums$ = of(albums);
      this.noResultsFound = albums.length === 0;
      this.cdr.markForCheck();
    });
  }

  private initializeSearch(): void {
    this.searchReq.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.getSearchObservable(value)),
      switchMap(albumsList => this.getAlbumsObservable(albumsList))
    ).subscribe(albums => {
      console.log('Albums updated after search:', albums);
      this.albums$ = of(albums);
      this.noResultsFound = albums.length === 0;
      this.cdr.markForCheck();
    });
  }

  public onSearchEvent(): void {
    const searchRequest = {
      searchData: this.searchForm.get('search')?.value,
      searchScope: this.searchForm.get('scope')?.value,
      searchSources: this.searchForm.get('sources')?.value
    };
    this.searchReq.next(searchRequest);
  }

  private createSearchRequestObject() {
    return {
      searchData: this.searchForm.get('search')?.value,
      searchScope: this.searchForm.get('scope')?.value,
      searchSources: this.searchForm.get('sources')?.value
    };
  }

  private getSearchObservable(value: any): Observable<AlbumsListI | Album[]> {
    if (value.searchData === "" && value.searchSources === "allSources") {
      this.searchMode = false;
      this.currentPage = 1;
      return this.getAlbums(this.currentPage, this.itemsPerPage);
    } else {
      this.searchMode = true;
      this.currentPage = 1;
      return this.sendSearchRequest(value.searchData, value.searchScope, value.searchSources, this.currentPage, this.itemsPerPage);
    }
  }

  private getAlbumsObservable(albumsListI: AlbumsListI | Album[]): Observable<Album[]> {
    if (Array.isArray(albumsListI) && albumsListI.every(item => item instanceof Album)) {
      return this.searchPlaylistifiedAlbums(albumsListI as Album[]);
    } else {
      this.updateSearchResults(albumsListI as AlbumsListI);
      return this.searchPlaylistifiedAlbums((albumsListI as AlbumsListI).albumsList);
    }
  }

  private sendSearchRequest(searchData: string, searchScope: string, searchSources: string, page: number, resultLimit: number): Observable<AlbumsListI> {
    return this.albumsService.searchAlbum(searchData, searchScope, searchSources, page, resultLimit);
  }

  private searchPlaylistifiedAlbums(albums: Album[]): Observable<Album[]> {
    if (this.userService.isAuthenticated()) {
      return this.albumsService.searchPlaylistifiedAlbums(albums, this.userService.getUserDbId()).pipe(
        map(playlists => this.mapPlaylistsToAlbums(playlists, albums))
      );
    } else {
      return of(albums);
    }
  }

  private mapPlaylistsToAlbums(playlists: AlbumPlaylistI[], albums: Album[]): Album[] {
    if (playlists != null) {
      const playlistMap = new Map(playlists.map(playlist => [playlist.albumId, playlist]));
      return albums.map(album => playlistMap.has(album._id) ? { ...album, addedToPlaylist: playlistMap.get(album._id) } : album);
    }
    return albums;
  }

  private updateSearchResults(albumsListI: AlbumsListI): void {
    if (albumsListI && albumsListI.albumsList.length > 0) {
      this.totalNumberOfPages = albumsListI.totalNumberOfPages;
      this.totalNumberOfAlbums = albumsListI.totalNumberOfAlbums;
      console.log('Search results:', albumsListI.albumsList);
      this.albums$ = of(albumsListI.albumsList);
      this.noResultsFound = false;
      this.cdr.markForCheck();
    } else {
      this.resetSearchResults();
    }
  }

  private resetSearchResults(): void {
    this.searchMode = false;
    this.currentPage = 1;
    this.totalNumberOfAlbums = 0;
    this.totalNumberOfPages = 0;
    this.albums$ = of([]);
    this.noResultsFound = true;
    this.cdr.markForCheck();
  }

  private getAlbums(page: number, itemsPerPage: number): Observable<Album[]> {
    return this.albumsService.getAlbums(page, itemsPerPage).pipe(
      tap(albumsList => {
        this.totalNumberOfPages = albumsList.totalNumberOfPages;
        this.totalNumberOfAlbums = albumsList.totalNumberOfAlbums;
      }),
      map(albumsList => albumsList.albumsList)
    );
  }

  public onPageChanged(event: any): void {
    const { page, itemsPerPage } = event;

    if (this.searchMode) {
      const searchReqObj = this.createSearchRequestObject();
      this.sendSearchRequest(searchReqObj.searchData, searchReqObj.searchScope, searchReqObj.searchSources, page, itemsPerPage)
        .subscribe(albumsListI => {
          this.updateSearchResults(albumsListI);
          this.cdr.markForCheck();
        });
    } else {
      this.getAlbums(page, itemsPerPage)
        .subscribe(albums => {
          console.log('Page changed albums:', albums);
          this.albums$ = of(albums);
          this.noResultsFound = albums.length === 0;
          this.cdr.markForCheck();
        });
    }
    window.scroll(0, 0);
  }

  public async openEditModal(albumIndex: number): Promise<void> {
    const albumToEdit = await this.selectAlbumAtIndex(albumIndex);
    const initialState = {
      album: albumToEdit,
      updated: false
    };
    this.bsModalRef = this.modalService.show(AlbumEditComponent, { initialState });
    this.bsModalRef.content.onUpdateAlbum.subscribe(({ albumToUpdate }) => {
      this.albumsService.updateAlbumOnDB(albumToUpdate).subscribe({
        next: (albumUpdated: Album) => {
          this.updateAlbum(albumIndex, albumUpdated);
          this.bsModalRef.content.updated = true;
          this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[0];
          this.cdr.markForCheck();
        },
        error: (e) => {
          this.bsModalRef.content.updated = true;
          this.bsModalRef.content._alert = this.bsModalRef.content.defaultAlerts[1];
          console.error(e);
        }
      });
    });
  }

  private selectAlbumAtIndex(index: number): Promise<Album> {
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

  public async openModalWithComponent(albumIndex: number): Promise<void> {
    const albumToUpdate = await this.selectAlbumAtIndex(albumIndex);
    const initialState = this.createInitialState(albumToUpdate);

    this.bsModalRef = this.modalService.show(AlbumsModalComponent, { initialState });
    this.bsModalRef.content.albumIndex = albumIndex;

    this.bsModalRef.content.onChosenAlbum.subscribe(({ resultIndex }) => {
      this.updateAlbumAndAddToPlaylist(albumToUpdate, resultIndex, albumIndex);
    });
  }

  private createInitialState(albumToUpdate: Album) {
    return {
      albumsFound: albumToUpdate.spotifySearchResults,
      title: albumToUpdate.albumName,
      artist: albumToUpdate.artistName
    };
  }

  private updateAlbumAndAddToPlaylist(albumToUpdate: Album, resultIndex: number, albumIndex: number): void {
    albumToUpdate.spotify = albumToUpdate.spotifySearchResults[resultIndex];
    albumToUpdate.searchedOnSpotify = true;
    albumToUpdate.spotifySearchResults = [];

    this.albumsService.updateAlbumOnDB(albumToUpdate).subscribe((albumUpdated: Album) => {
      albumUpdated.searchedOnSpotify = true;
      albumUpdated.spotifySearchResults = [];
      this.updateAlbum(albumIndex, albumUpdated);
      this.addToPlaylist(albumIndex);
      this.cdr.markForCheck();
    });
  }

  public async addToPlaylist(index: number): Promise<void> {
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

    // Update the observable and trigger change detection
    this.albums$.pipe(
      map(albums => {
        const updatedAlbums = albums.map((a, i) => i === index ? album : a);
        return updatedAlbums;
      })
    ).subscribe(updatedAlbums => {
      this.albums$ = of(updatedAlbums);
      this.cdr.markForCheck();
    });
  }

  private createAlbumPlaylist(album: Album): AlbumPlaylistI {
    return {
      idSpotify: this.userService.getSelectedPlaylistId(),
      name: this.userService.getSelectedPlaylistName(),
      userId: this.userService.getUserDbId(),
      albumId: album._id
    };
  }

  private savePlaylist(playlistAlbum: AlbumPlaylistI): void {
    this.albumsService.savePlaylistAlbum(playlistAlbum).subscribe();
  }

  private async searchAlbumOnSpotify(index: number): Promise<boolean> {
    const album = await this.selectAlbumAtIndex(index);
    const searchQueries = [
      `album:${album.albumName} artist:${album.artistName}`,
      `artist:${album.artistName}`
    ];

    for (const query of searchQueries) {
      const foundAlbums: AlbumSpotify[] = await this.spotifyApiService.searchItem(query, 'album').toPromise();

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

  private updateAlbum(index: number, newAlbum: Album): void {
    this.albumsService.updateAlbum(index, newAlbum);
    this.albums$.pipe(
      map(albums => {
        const updatedAlbums = albums.map((a, i) => i === index ? newAlbum : a);
        return updatedAlbums;
      })
    ).subscribe(updatedAlbums => {
      this.albums$ = of(updatedAlbums);
      this.cdr.markForCheck();
    });
  }

  public onSourceChanged(): void {
    this.onSearchEvent();
  }

  public getDate({ month, year }: { month: string | number, year: string | number }): string {
    const monthNumber = typeof month === 'string' ? parseInt(month, 10) : month;
    const yearNumber = typeof year === 'string' ? parseInt(year, 10) : year;
    return `${MyCalendar.month[monthNumber - 1]} ${yearNumber}`;
  }

  public get isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }
}
