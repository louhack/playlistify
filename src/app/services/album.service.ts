import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlbumService {

  private albumList: Album[] = [];
  albumsChanged = new Subject<Album[]>();


  constructor(private http: Http) {
    this.fetchData();
}

  fetchData() {
    return this.http.get('assets/data/data.1.json')
    .map((res: Response) => {
      const albums: Album[] = res.json();
      // for (let album of albums){
      //   console.log('Album name : ' + album.albumName);
      // }
      return albums;
    })
    .subscribe((data: Album[]) => {
      this.loadAlbums(data);
      // console.log('les data: ' + JSON.stringify(this.albumList));
    },
   (error) => console.log(error));

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
