import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { UserService } from '../../services/spotify/user.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs/Subscription';
import { SpotifyPlaylist } from '../../models/spotifyPlaylist.model';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  userSubscription: Subscription;

  playlists: SpotifyPlaylist[] = [];
  playlistsSubscription: Subscription;


  constructor(private authService: SpotifyAuthService,
              private userService: UserService,
              private http: Http,
              private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        // console.log(this.user);
      });

      this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
        (playlists: SpotifyPlaylist[]) => {
          this.playlists = playlists;
          this.userService.setSelectedPlaylistId(this.playlists[0].id);
        });

        this.checkAuthentication();
      }

  onLogin() {
    this.authService.authenticateUsingSpotify();
  }

  onPlaylistChange(id: string) {
    console.log(JSON.stringify(id));
    this.userService.setSelectedPlaylistId(id);

  }

  checkAuthentication() {
    if (this.authService.getToken()) {
      this.http.get('/auth/spotify/token')
        .map(res => res.json())
        .subscribe(res => {
          if (res.authToken) {
            this.authService.storeToken(res.authToken, 'Bearer');
            this.userService.getUserProfilFromSpotify().then(
              resp => {
                this.userService.getUserPlaylistFromSpotify();
                this.router.navigate(['/']);
              }
            );
      }
    }, err => {
    });

    }
  }

}
