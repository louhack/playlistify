import { Injectable } from '@angular/core';
import { Album } from '../../models/album.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AlbumsListI } from '../../interfaces/albumsList.interface';
import { AlbumPlaylistI } from '../../interfaces/albumAddedToPlaylist.interface';
import { LocalEndPoints } from './localAPIEndpoints';

@Injectable()
export class AlbumService {

  albumChanged = new Subject<{ index: number, album: Album }>();
  messageService: any;

  constructor(
    private http: HttpClient,
    private localEndPoints: LocalEndPoints) { }

  updateAlbumOnDB(album: Album): Observable<Album> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<Album>(this.localEndPoints.albumEndPoint, album, httpOptions).pipe(
      tap(_ => console.log('update album')),
      catchError(this.handleError<any>('updateAlbum')),
      map(res => res['data'])
    );
  }

  getAlbums(page: number, limit: number): Observable<AlbumsListI> {
    const httpParams = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<AlbumsListI>(this.localEndPoints.albumEndPoint, { params: httpParams })
      .pipe(
        map(res => this.retrieveResponseData(res)),
        catchError(this.handleError<AlbumsListI>('getAlbums', {
          albumsList: [],
          totalNumberOfPages: 0,
          totalNumberOfAlbums: 0,
          currentPage: 1
        }))
      );
  }

  retrieveResponseData(res: any): AlbumsListI {
    if (!res || !res['data'] || !Array.isArray(res['data'].docs)) {
      return {
        albumsList: [],
        totalNumberOfAlbums: 0,
        currentPage: 1,
        totalNumberOfPages: 0
      };
    }

    const albums: Album[] = res['data'].docs.map(album => new Album(
      album._id,
      album.artistName,
      album.albumName,
      album.sputnikMusic,
      album.heavyBIsH,
      album.hasOwnProperty('spotify') ? album.spotify : null,
      album.yourLastRites
    ));

    return {
      albumsList: albums,
      totalNumberOfAlbums: res['data'].totalDocs,
      currentPage: res['data'].page,
      totalNumberOfPages: res['data'].totalPages
    };
  }

  updateAlbum(index: number, album: Album) {
    this.albumChanged.next({ index: index, album: album });
  }

  savePlaylistAlbum(item: AlbumPlaylistI): Observable<Object> {
    return this.http.post<Album>(this.localEndPoints.playlistifyEndPoint, { params: { playlist: item } })
      .pipe(
        map(resp => resp['data']),
        catchError(this.handleError<any>('savePlaylistAlbum', null))
      );
  }

  searchPlaylistifiedAlbums(albums: Album[], userId: string): Observable<any> {
    const albumIds: string[] = albums.map(album => album._id);

    return this.http.get(this.localEndPoints.playlistifiedAlbumsEndPoint, { params: { userId: userId, albumId: albumIds } })
      .pipe(
        map((resp: Response) => resp != null ? resp['data'] : null),
        catchError(this.handleError<any>('searchPlaylistifiedAlbums', []))
      );
  }

  searchAlbum(searchItem: string, scope: string, searchSources: string, page: number, limit: number): Observable<AlbumsListI> {
    let params = new HttpParams()
      .set('q', searchItem)
      .set('scope', scope)
      .set('sources', searchSources)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<AlbumsListI>(this.localEndPoints.searchEndPoint, { params })
      .pipe(
        map(res => {
          const responseData = this.retrieveResponseData(res);
          if (!responseData.albumsList.length) {
            responseData.totalNumberOfPages = 0;
            responseData.totalNumberOfAlbums = 0;
            responseData.currentPage = 1;
          }
          return responseData;
        }),
        catchError(this.handleError<AlbumsListI>('searchAlbum', {
          albumsList: [],
          totalNumberOfPages: 0,
          totalNumberOfAlbums: 0,
          currentPage: 1
        }))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    if (this.messageService && typeof this.messageService.add === 'function') {
      this.messageService.add(`Album update: ${message}`);
    } else {
      console.warn(`MessageService not available: ${message}`);
    }
  }
}
