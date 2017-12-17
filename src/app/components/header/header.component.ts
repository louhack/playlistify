import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { UserService } from '../../services/spotify/user.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs/Subscription';
import { SpotifyPlaylist } from '../../models/spotifyPlaylist.model';

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
    private userService: UserService) { }

  ngOnInit() {

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        // console.log(this.user);
      });

      // this.playlists = this.userService.getPlaylists();

      this.playlistsSubscription = this.userService.playlistsChanged.subscribe(
        (playlists: SpotifyPlaylist[]) => {
          this.playlists = playlists;
          this.userService.setSelectedPlaylistId(this.playlists[0].id);
        });

    }

  onLogin() {
    this.authService.authenticateUsingSpotify();
  }

  onPlaylistChange(id: string) {
    console.log(JSON.stringify(id));
    this.userService.setSelectedPlaylistId(id);

  }
}
