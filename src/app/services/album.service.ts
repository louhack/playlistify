import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';


@Injectable()
export class AlbumService {

  private albumList: Album [] = <Album[]>[];
  albumsChanged = new Subject<Album[]>();

  api_url = 'http://localhost:3000';
  albumUrl = `/api/albums`;
  // upDateAlbumUrl = `/api/album`;

  constructor(private http: Http) {
    this.fetchData();
}

  fetchData() {
    return this.http.get(this.albumUrl)
    .map((res: Response) => {
      // console.log(res.json().data.docs);
      const albums = new Array<Album>();
      for (const album of res.json().data.docs) {
        // console.log(album.hasOwnProperty('spotify') ? album.spotify : null);
        albums.push(new Album(album._id, album.artistName, album.albumName, album.sputnikMusic, album.hasOwnProperty('spotify') ? album.spotify : null));
      }

      return albums;
    })
    .subscribe((data: Album[]) => {
      this.loadAlbums(data);
    },
   (error) => console.log(error));

  }

  updateAlbumonDB(album: Album): Promise<boolean> {
    return new Promise(
      resolve => {
        this.http.put(this.albumUrl, album).subscribe(
          data => {
            console.log(data);
            resolve(true);
          }
        );
      });
  }

  updateAlbum(index: number, newAlbum: Album) {
    this.albumList[index] = newAlbum;
    this.albumsChanged.next(this.albumList.slice());
  }

  getAlbums() {
    // console.log('La liste : ' + this.albumList);
    return this.albumList.slice();
  }

  loadAlbums(albums: Album[]) {
    this.albumList = albums;
    this.albumsChanged.next(this.albumList.slice());
  }
}
