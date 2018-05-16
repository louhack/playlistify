import { Injectable } from '@angular/core';
import { TokenInterface } from '../../interfaces/tokenInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { map } from 'rxjs/operators';


@Injectable()
export class SpotifyAuthService {

    // authentication = {
    //     spotify: {
    //       authenticationUrl: 'https://accounts.spotify.com/authorize',
    //       clientId: '3ec89e264ee040a1af30921007fbc1c4',
    //       responseType: 'token',
    //       redirectUri: '/login',
    //       scopes: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-top-read user-read-email user-read-private'
    //     }
    //   };

      constructor(private userService: UserService, private spotifyEndPoints: SpotifyEndPoints, private http: HttpClient, private router: Router) {
      }

    // private createRedirectUri(redirectUri: string): string {
    //     return window.location.origin + redirectUri;
    // }
    // private createSpotifyAuthenticationUrl(): string {
    //     const spotifyConfig = this.authentication.spotify;
    //     // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    //     return `${spotifyConfig.authenticationUrl}?client_id=${spotifyConfig.clientId}&redirect_uri=${this.createRedirectUri(spotifyConfig.redirectUri)}&response_type=${spotifyConfig.responseType}&scope=${encodeURIComponent(spotifyConfig.scopes)}`;
    // }

    public authenticateUsingSpotify() {
    //    window.location.href = this.createSpotifyAuthenticationUrl();
        this.router.navigate(['/auth/spotify']);
    }

    public onAuthenticationSuccess({expires_in, access_token, token_type}: TokenInterface) {
        this.storeToken(access_token, token_type);
    }

    public storeToken(accessToken: string, tokenType: string) {
        window.sessionStorage.setItem(this.spotifyEndPoints.authenticationTokenKey, accessToken);
        window.sessionStorage.setItem(this.spotifyEndPoints.authenticationTokenTypeKey, tokenType);
    }

    public clearToken() {
        window.sessionStorage.removeItem(this.spotifyEndPoints.authenticationTokenKey);
        window.sessionStorage.removeItem(this.spotifyEndPoints.authenticationTokenTypeKey);
        this.userService.isLoggedIn = false;
    }

    public getToken(): TokenInterface {
        const access_token = window.sessionStorage.getItem(this.spotifyEndPoints.authenticationTokenKey);
        const token_type = window.sessionStorage.getItem(this.spotifyEndPoints.authenticationTokenTypeKey);
        const expires_in = '';

        return {access_token, token_type, expires_in};
    }

    retrieveTokenFromServer() {
      this.http.get('/auth/spotify/token')
      // .pipe(map((token: string) => token))
      .subscribe( (token: string) => {
        if (token) {
          this.storeToken(token, 'Bearer');
          this.userService.getUserProfilFromBackEnd().then(
            resp => {
              this.userService.getUserPlaylistFromSpotify();
              this.router.navigate(['/']);
            }
          );
        }
      }, err => {
        this.router.navigate(['/']);
      });
    }

}
