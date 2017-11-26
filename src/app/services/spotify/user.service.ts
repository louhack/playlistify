import { User } from '../../models/user.model';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {

    public authenticationTokenKey = 'authenticationTokenKey';
    public authenticationTokenTypeKey = 'authenticationTokenTypeKey';
    isLoggedIn = false;

    private user: User;
    userChanged = new Subject<User>();

    constructor(private http: Http,
        private spotifyEndPoints: SpotifyEndPoints) {}

    getUser() {
        return this.user;
    }

    getDisplayName() {
        return this.user.display_name;
    }

    getUserProfilFromSpotify() {
        this.http.get(this.spotifyEndPoints.currentUserProfileEndPoint, this.createRequestOptions()).subscribe(
            (response: any) => {
                const res = response.json();
                console.log('res' + JSON.stringify(res.display_name));
                this.user = new User(res.display_name, res.id, res.images);
                this.isLoggedIn = true;
                this.userChanged.next(this.user);
            });
    }

    public createRequestOptions(): RequestOptionsArgs {
        const authorizationHeaderName = 'Authorization';
        const headers = new Headers();
        const tokenType = window.sessionStorage.getItem(this.authenticationTokenTypeKey);
        const token = window.sessionStorage.getItem(this.authenticationTokenKey);
        headers.append(
            authorizationHeaderName,
            `${tokenType} ${token}`
        );
        return {headers};
    }


}
