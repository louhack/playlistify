import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { UserService } from './user.service';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { AlbumSpotify } from '../../interfaces/albumSpotifyInterface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpotifyApiService {


    constructor(private http: Http,
        private userService: UserService,
        private spotifyAuthService: SpotifyAuthService,
        private spotifyEndPoints: SpotifyEndPoints) {}

    public searchItem(query: string, searchType: string): Observable<AlbumSpotify[]> {
       const searchReq = encodeURI(this.spotifyEndPoints.searchItemEndPoint + '?q=' + query + '&type=' + searchType);
        console.log(searchReq);
        return this.http.get(searchReq, this.spotifyEndPoints.createRequestOptions()).map(
            (response: Response) => {
                const albumList: AlbumSpotify[] = response.json().albums.items;
                return albumList;
            });
    }
}
