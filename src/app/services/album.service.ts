import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';
import { AlbumsListI } from '../interfaces/albumsList.interface';


@Injectable()
export class AlbumService {

  albumUrl = `/api/albums`;
  albumChanged = new Subject<{index: number, album: Album}>();

  constructor(private http: Http) { }

  updateAlbumonDB(album: Album): Promise<boolean> {
    return new Promise(
      resolve => {
        this.http.put(this.albumUrl, album).subscribe(
          data => {
            resolve(true);
          }
        );
      });
  }


  getAlbums(page: number, limit: number): Observable<AlbumsListI> {
    return this.http.get(this.albumUrl, {params: {page: page, limit: limit}})
    .map((res: Response) => {
      const albums = new Array<Album>();
      for (const album of res.json().data.docs) {
        albums.push(new Album(album._id, album.artistName, album.albumName, album.sputnikMusic, album.hasOwnProperty('spotify') ? album.spotify : null));
      }
      const albumsListI: AlbumsListI = {
        albumsList: albums,
        totalNumberOfAlbums: res.json().data.total,
        currentPage: res.json().data.page,
        totalNumberOfPages: res.json().data.pages
      };
      return albumsListI;
    });

  }

  updateAlbum(index: number, album: Album) {
    this.albumChanged.next({index: index, album: album});
  }
}
