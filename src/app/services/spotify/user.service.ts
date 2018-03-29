import { User } from '../../models/user.model';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { SpotifyPlaylist } from '../../models/spotifyPlaylist.model';

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

    constructor(private http: Http,
        private spotifyEndPoints: SpotifyEndPoints) {}

    updateAlbumAddedToPlaylist (albumId: string, playlistName: string) {
      return new Promise(
        resolve => {
          this.http.put('', '', '').subscribe(
            data => {
              // console.log(data);
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
        this.user = usr;
        this.isLoggedIn = true;
    }

    getPlaylists() {
        return this.playlists;
    }

    getUserProfilFromSpotify(): Promise<boolean> {
        return new Promise(
            resolve => {
                this.http.get(this.spotifyEndPoints.currentUserProfileEndPoint, this.spotifyEndPoints.createRequestOptions()).subscribe(
                    (response: any) => {
                                const res = response.json();
                                this.setUser(new User(res.display_name, res.id, res.images));
                                this.userChanged.next(this.getUser());
                                resolve(true);
                    }
                );
            }
        );
    }

    getUserPlaylistFromSpotify() {
        this.http.get(this.spotifyEndPoints.currentUserPlaylistsEndPoint, this.spotifyEndPoints.createRequestOptions()).subscribe(
            (response: any) => {
                const res = response.json();
                this.setPlaylists(res.items);

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

    getUserId() {
      return this.user.id;
    }
}
