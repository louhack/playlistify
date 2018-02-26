import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';


@Injectable()
export class AlbumService {

  private albumList: Album [] = [];
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
      const albums: Album[] = res.json().data.docs;
      return albums;
    })
    .subscribe((data: Album[]) => {
      this.loadAlbums(data);
    },
   (error) => console.log(error));

  }

  updateAlbum(album: Album): Promise<boolean> {
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

  getAlbums() {
    // console.log('La liste : ' + this.albumList);
    return this.albumList.slice();
  }

  loadAlbums(albums: Album[]) {
    this.albumList = albums;
    this.albumsChanged.next(this.albumList.slice());
  }
}
