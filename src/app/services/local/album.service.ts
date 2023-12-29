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

  // albumUrl = `/api/albums`;
  albumChanged = new Subject<{index: number, album: Album}>();
  messageService: any;

  constructor(
      private http: HttpClient,
      private localEndPoints: LocalEndPoints) { }

  updateAlbumOnDB(album: Album): Observable<Album> {
    // console.log(JSON.stringify(Album));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    }
    return this.http.put<Album>(this.localEndPoints.albumEndPoint, album, httpOptions).pipe(
      tap( _ => console.log('update album')),
      catchError(this.handleError<any>('updateAlbum')),
      map(res => {
        return res['data'];
      })
    );
  }


  getAlbums(page: number, limit: number): Observable<AlbumsListI> {
    const httpParams = new HttpParams().set('page', page.toString());
    httpParams.append('limit', limit.toString());
    // console.log(httpParams);
    return this.http.get<AlbumPlaylistI>(this.localEndPoints.albumEndPoint, {params: httpParams})
      .pipe(map((res) => {
        // console.log(JSON.stringify(res));
        return this.retrieveResponseData(res);
    }));

  }

  retrieveResponseData(res: Object): AlbumsListI{
    const albums:Album[] = [];
    
    for (const album of res['data'].docs) {
      albums.push(new Album(album._id, album.artistName, album.albumName, album.sputnikMusic, album.heavyBIsH, album.hasOwnProperty('spotify') ? album.spotify : null, album.yourLastRites));
    }
    const albumsListI: AlbumsListI = {
      albumsList: albums,//res['data'].docs as Album[],
      totalNumberOfAlbums: res['data'].totalDocs,
      currentPage: res['data'].page,
      totalNumberOfPages: res['data'].totalPages
    };
    return albumsListI;
  }


  updateAlbum(index: number, album: Album) {
    this.albumChanged.next({index: index, album: album});
  }

  savePlaylistAlbum (item: AlbumPlaylistI): Observable<Object> {
    return this.http.post<Album>(this.localEndPoints.playlistifyEndPoint, {params: {playlist: item}})
      .pipe(map (resp => {
        return resp['data'];
      }));
      // .map( response => {});
  }

  searchPlaylistifiedAlbums (albums: Album[], userId: string): Observable<any> {
    const albumIds: string[] = [];
    albums.forEach( album => {
      albumIds.push(album._id);
    });

    return this.http.get(this.localEndPoints.playlistifiedAlbumsEndPoint, {params: { userId: userId, albumId: albumIds}})
      .pipe(map((resp: Response) => {
      // console.log(resp['data']);
        if (resp != null) {
          return resp['data'];
        } else {
          return null;
        }
      }));
  }

  searchAlbum(searchItem: string, scope: string, searchSources:string, page: number, limit: number): Observable<AlbumsListI> {
    console.log(searchItem);
    // if(searchItem != (null || "")){
      return this.http.get<AlbumPlaylistI>(this.localEndPoints.searchEndPoint, {
        params: {
          q: searchItem,
          scope: scope,
          sources: searchSources,
          page: page.toString(),
          limit: limit.toString()
        }
      }
      // return null;
      ).pipe(map((res) => {
        return this.retrieveResponseData(res);
    }));
      // .pipe(
      //   map(response => {
      //     console.log(response);
      //     if(response['data'] != null){
      //       return this.retrieveResponseData(response);
      //       // return response['data'];
      //     }
      //     else {
      //       return of({});
      //     }
      //   })
      //   );
    // }
    // return of({});
  }

/**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
 private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Album update: ${message}`);
  }
}

