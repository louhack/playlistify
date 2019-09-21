import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { SpotifyPlaylist } from '../../models/spotifyPlaylist.model';
// import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {

    public authenticationTokenKey = 'authenticationTokenKey';
    public authenticationTokenTypeKey = 'authenticationTokenTypeKey';
    isLoggedIn = false;

    private user: User;
    userChanged = new Subject<User>();

    private playlists: SpotifyPlaylist[];
    playlistsChanged = new Subject<SpotifyPlaylist[]>();
    private selectedPlaylistId: string;
    private selectedPlaylistName: string;

    constructor(private http: HttpClient,
        private spotifyEndPoints: SpotifyEndPoints) {}

    updateAlbumAddedToPlaylist (albumId: string, playlistName: string) {
      return new Promise(
        resolve => {
          this.http.put('', '').subscribe(
            data => {
              resolve(true);
            }
          );
        });

    }

    getUser() {
        return this.user;
    }

    getDisplayName() {
        return this.user.display_name;
    }

    setUser(usr: User) {
      this.isLoggedIn = true;
      this.user = usr;
    }

    getPlaylists() {
        return this.playlists;
    }

    // getUserProfilFromSpotify(): Promise<boolean> {
    //     return new Promise(
    //         resolve => {
    //             this.http.get(this.spotifyEndPoints.currentUserProfileEndPoint, { headers: this.spotifyEndPoints.createRequestOptions()}).subscribe(
    //                 (response: any) => {
    //                             const res = response.json();
    //                             // console.log(res);
    //                             this.setUser(new User('', res.display_name, res.id, res.images));
    //                             this.userChanged.next(this.getUser());
    //                             resolve(true);
    //                 }
    //             );
    //         }
    //     );
    // }

    getUserProfilFromBackEnd(): Promise<boolean> {
      return new Promise(
          resolve => {
              this.http.get('/api/user/profile').subscribe(
                  (response: any) => {
                              const res = response['data'];
                              this.setUser(new User(res._id, res.profile.displayName, res.spotify.id, res.spotify.picture));
                              this.userChanged.next(this.getUser());
                              resolve(true);
                  }
              );
          }
      );
  }

    getUserPlaylistFromSpotify() {
        this.http.get(this.spotifyEndPoints.currentUserPlaylistsEndPoint, { headers: this.spotifyEndPoints.createRequestOptions()}).subscribe(
            (response: any) => {
                this.setPlaylists(response['items']);

            });
    }


    setPlaylists(playlistsResponse: SpotifyPlaylist[]) {
        this.playlists = playlistsResponse;
        this.playlistsChanged.next(this.playlists);
    }

    setSelectedPlaylistById(playlistId: string) {
        this.selectedPlaylistId = playlistId;
        const playlistIndex = this.playlists.findIndex(playlist => playlist.id === playlistId);
        this.selectedPlaylistName = this.playlists[playlistIndex].name;
    }

    getSelectedPlaylistId() {
        return this.selectedPlaylistId;
    }

    getSelectedPlaylistName() {
      return this.selectedPlaylistName;
    }

    setSelectedPlaylistName(playlistName: string) {
      this.selectedPlaylistName = playlistName;
    }

    getUserSpotifyId() {
      return this.user.id;
    }

    getUserDbId() {
      return this.user._id;
    }

    isAuthenticated(): boolean {
      return this.isLoggedIn;
    }
}
