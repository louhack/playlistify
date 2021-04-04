import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Album } from '../../../models/album.model';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {

  album: Album;
  updated = false;

  @Output() onUpdateAlbum = new EventEmitter<{albumToUpdate: Album}>();

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    if(this.album.spotify == null){
      this.album.spotify = {
      }
    }
    // this.album = new Album();
    // console.log(JSON.stringify(this.album));
  }

  onSave() {
    this.onUpdateAlbum.emit({albumToUpdate: this.album});
    // console.log("Album is updated: " + this.updated);
    // this.bsModalRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
