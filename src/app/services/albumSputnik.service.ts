import { Injectable } from '@angular/core';
import { AlbumSputnik } from '../models/albumSputnik.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlbumSputnikService {

  private albumList: AlbumSputnik[] = [];
  albumsChanged = new Subject<AlbumSputnik[]>();


  constructor(private http: Http) {
    this.fetchData();
}

  fetchData() {
    return this.http.get('assets/data/data.2.json')
    .map((res: Response) => {
      const albums: AlbumSputnik[] = res.json();
      return albums;
    })
    .subscribe((data: AlbumSputnik[]) => {
      this.loadAlbums(data);
      // console.log('les data: ' + JSON.stringify(this.albumList));
    },
   (error) => console.log(error));

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
