import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';
import { AlbumsListI } from '../interfaces/albumsList.interface';
import { AlbumPlaylistI } from '../interfaces/albumAddedToPlaylist.interface';


@Injectable()
export class AlbumService {

  albumUrl = `/api/albums`;
  albumChanged = new Subject<{index: number, album: Album}>();

  constructor(private http: HttpClient) { }

  updateAlbumOnDB(album: Album): Promise<boolean> {
    return new Promise(
      resolve => {
        this.http.put(this.albumUrl, album).subscribe(
          data => {
            resolve(true);
          }
        );
      });
  }


  getAlbums(page: number, limit: number) {
    const httpParams = new HttpParams().set('page', page.toString());
    httpParams.append('limit', limit.toString());

    return this.http.get(this.albumUrl, {params: httpParams})
      .pipe(map((res) => {
        const albums = new Array<Album>();
        for (const album of res['data'].docs) {
          albums.push(new Album(album._id, album.artistName, album.albumName, album.sputnikMusic, album.hasOwnProperty('spotify') ? album.spotify : null));
        }
        const albumsListI: AlbumsListI = {
          albumsList: albums,
          totalNumberOfAlbums: res['data'].total,
          currentPage: res['data'].page,
          totalNumberOfPages: res['data'].pages
        };
        return albumsListI;
    }));

  }

  updateAlbum(index: number, album: Album) {
    this.albumChanged.next({index: index, album: album});
  }

  savePlaylistAlbum (item: AlbumPlaylistI): Observable<Object> {
    return this.http.post('/api/user/playlistifyAlbum', {params: {playlist: item}});
      // .map( response => {});
  }

  searchPlaylistifiedAlbums (albums: Album[], userId: string): Observable<any> {
    const albumIds: string[] = [];
    albums.forEach( album => {
      albumIds.push(album._id);
    });

    return this.http.get('/api/user/playlistifiedAlbum', {params: { userId: userId, albumId: albumIds}})
      .pipe(map((resp: Response) => {
        return resp;
      }));
  }
}
