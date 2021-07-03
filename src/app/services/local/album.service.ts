import { Injectable } from '@angular/core';
import { Album } from '../../models/album.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumsListI } from '../../interfaces/albumsList.interface';
import { AlbumPlaylistI } from '../../interfaces/albumAddedToPlaylist.interface';
import { LocalEndPoints } from './localAPIEndpoints';


@Injectable()
export class AlbumService {

  // albumUrl = `/api/albums`;
  albumChanged = new Subject<{index: number, album: Album}>();

  constructor(
      private http: HttpClient,
      private localEndPoints: LocalEndPoints) { }

  updateAlbumOnDB(album: Album): Promise<Album> {
    // console.log(JSON.stringify(Album));
    return new Promise(
      resolve => {
        this.http.put(this.localEndPoints.albumEndPoint, album).subscribe(
          response => {
            resolve(response['data']);
          },
          err => {
            return err;
          }
        );
      });
  }


  getAlbums(page: number, limit: number): Observable<AlbumsListI> {
    const httpParams = new HttpParams().set('page', page.toString());
    httpParams.append('limit', limit.toString());

    return this.http.get(this.localEndPoints.albumEndPoint, {params: httpParams})
      .pipe(map((res) => {
        return this.retrieveResponseData(res);
    }));

  }

  retrieveResponseData(res: Object): AlbumsListI{
    const albums = new Array<Album>();
    for (const album of res['data'].docs) {
      albums.push(new Album(album._id, album.artistName, album.albumName, album.sputnikMusic, album.heavyBIsH, album.hasOwnProperty('spotify') ? album.spotify : null, album.yourLastRites));
    }
    const albumsListI: AlbumsListI = {
      albumsList: albums,
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
    return this.http.post<Album>('/api/user/playlistifyAlbum', {params: {playlist: item}})
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

    return this.http.get('/api/user/playlistifiedAlbum', {params: { userId: userId, albumId: albumIds}})
      .pipe(map((resp: Response) => {
      // console.log(resp['data']);
        if (resp != null) {
          return resp['data'];
        } else {
          return null;
        }
      }));
  }

  searchAlbum(searchItem: string, scope: string, searchSources:string, page: number, limit: number): Observable<any> {
    console.log(searchItem);
    // if(searchItem != (null || "")){
      return this.http.get<Album[]>(this.localEndPoints.searchEndPoint, {
        params: {
          q: searchItem,
          scope: scope,
          sources: searchSources,
          page: page.toString(),
          limit: limit.toString()
        }
      }
      // return null;
      ).pipe(
        map(response => {
          console.log(response);
          if(response['data'] != null){
            return this.retrieveResponseData(response);
            // return response['data'];
          }
          else {
            return of({});
          }
        })
        );
    // }
    // return of({});
  }
}
