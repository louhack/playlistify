import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { UserService } from '../../services/spotify/user.service';
import { User } from '../../models/user.model';
import { SpotifyPlaylist } from '../../models/spotifyPlaylist.model';
import { SpotifyApiService } from '../../services/spotify/spotifyApi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // to fix collapse problem with bootstrap
  show = false;

  user: User;
  userSubscription: Subscription;

  playlists: SpotifyPlaylist[] = [];
  playlistsSubscription: Subscription;

  // Model to create a playlist
  modalRef: BsModalRef;

  constructor(private authService: SpotifyAuthService,
              private spotifyAPIService: SpotifyApiService,
              private userService: UserService,
              private http: HttpClient,
              private router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      });

      this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
        (playlists: SpotifyPlaylist[]) => {
          this.playlists = playlists;
          this.userService.setSelectedPlaylistById(this.playlists[0].id);
        });

        this.checkAuthentication();
      }


  toggleCollapse() {
    this.show = !this.show;
  }

  onLogin() {
    this.authService.authenticateUsingSpotify();
  }

  onPlaylistChange(id: any) {
    this.userService.setSelectedPlaylistById(id);

  }

  isLoggedIn() {
   return this.userService.isLoggedIn;
  }

  checkAuthentication() {
    this.authService.retrieveTokenFromServer();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  createPlaylist(playlistName: string) {
    this.spotifyAPIService.createPlaylistSpotify(playlistName)
      .subscribe(response => {
        this.userService.getUserPlaylistFromSpotify();
        this.modalRef.hide();
      });
  }

}
