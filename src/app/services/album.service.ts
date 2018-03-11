import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';
import { AlbumsListI } from '../components/albumsList.interface';


@Injectable()
export class AlbumService {

  albumUrl = `/api/albums`;


  constructor(private http: Http) { }

  updateAlbumonDB(album: Album): Promise<boolean> {
    return new Promise(
      resolve => {
        this.http.put(this.albumUrl, album).subscribe(
          data => {
            // console.log(data);
            resolve(true);
          }
        );
      });
  }


  getAlbums(page: Number, limit: Number): Observable<AlbumsListI> {
    return this.http.get(this.albumUrl, {params: {page: page, limit: limit}})
    .map((res: Response) => {
      // console.log(res.json());
      const albums = new Array<Album>();
      for (const album of res.json().data.docs) {
        // console.log(album.hasOwnProperty('spotify') ? album.spotify : null);
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

  loadAlbums(albums: Album[]) {
    // this.albumsList = albums;
    // this.albumsChanged.next(this.albumsList.slice());
  }
}
