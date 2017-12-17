import { Injectable } from '@angular/core';
import { AlbumSputnik } from '../models/albumSputnik.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';


@Injectable()
export class AlbumSputnikService {

  private albumList: AlbumSputnik[] = [];
  albumsChanged = new Subject<AlbumSputnik[]>();

  api_url = 'http://localhost:3000';
  albumUrl = `/api/albums`;

  constructor(private http: Http) {
    this.fetchData();
}

  fetchData() {
    return this.http.get(this.albumUrl)
    .map((res: Response) => {
      const albums: AlbumSputnik[] = res.json().data.docs;
      return albums;
    })
    .subscribe((data: AlbumSputnik[]) => {
      this.loadAlbums(data);
      // console.log('les data: ' + JSON.stringify(this.albumList));
    },
   (error) => console.log(error));

  }

  updateAlbum(album: AlbumSputnik): Promise<boolean> {
    return new Promise(
      resolve => {
        resolve(true);
      }
     );
  }

  getAlbums() {
    // console.log('La liste : ' + this.albumList);
    return this.albumList.slice();
  }

  loadAlbums(albums: AlbumSputnik[]) {
    this.albumList = albums;
    this.albumsChanged.next(this.albumList.slice());
  }
}
