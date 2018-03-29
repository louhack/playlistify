import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';
import { AlbumService } from '../../../services/album.service';

@Component({
  selector: 'app-albums-modal',
  templateUrl: './albums-modal.component.html',
  styleUrls: ['./albums-modal.component.css']
})
export class AlbumsModalComponent implements OnInit {

  title: string;
  albumsFound: AlbumSpotify[] = [];
  albumIndex: number;
  albumRadio = false;
  @Output() onChosenAlbum = new EventEmitter<{index: number, spotifyId: string}>();

  constructor(public bsModalRef: BsModalRef, private albumService: AlbumService) {}

  ngOnInit() {
  }

  onSave(value: string) {
    console.log('Album chosen: ' + value);
    this.onChosenAlbum.emit({index: this.albumIndex, spotifyId: value});
    this.bsModalRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
