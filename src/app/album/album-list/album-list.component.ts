import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albumsList: Album[] = [];
  albumsSubcription: Subscription;


  constructor(private albumsService: AlbumService) { }

  ngOnInit() {
    this.albumsList = this.albumsService.getAlbums();

     this.albumsSubcription = this.albumsService.albumsChanged.subscribe(
      (albums: Album[]) => {
        this.albumsList = albums;
        console.log(JSON.stringify(this.albumsList));
     });

    }
}

