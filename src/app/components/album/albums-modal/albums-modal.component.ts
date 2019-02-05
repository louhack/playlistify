import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlbumSpotify } from '../../../interfaces/albumSpotifyInterface';

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
  @Output() onChosenAlbum = new EventEmitter<{resultIndex: number}>();
  chosenAlbum: string;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

  onSave(value: string) {
    this.onChosenAlbum.emit({resultIndex: +value});
    this.bsModalRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
