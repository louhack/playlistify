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

  dismissible = true;
  defaultAlerts: any[] = [
    {
      type: 'success',
      msg: `Album was updated successfully`
    },
    {
      type: 'danger',
      msg: `Oops ! Something went wrong`
    }
  ];

  _alert = {
    type: '',
    msg: ''
  };

  onClosed(dismissedAlert: any): void {
    this._alert = null;
    this.updated = false;
  }


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
    // if (this.updated) {
    //   this._alert = this.defaultAlerts[0];
    // }
  }

  onClose() {
    this.bsModalRef.hide();
  }

  hideAlert(){

  }

}
