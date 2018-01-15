import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { UserService } from './user.service';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { AlbumSpotify } from '../../interfaces/albumSpotifyInterface';
import { AlbumSputnik } from '../../models/albumSputnik.model';
import { Track } from '../../interfaces/trackInterface';
import { MessageService } from '../message.service';


@Injectable()
export class SpotifyApiService {

    constructor(private http: Http,
        private userService: UserService,
        private spotifyAuthService: SpotifyAuthService,
        private spotifyEndPoints: SpotifyEndPoints,
        private messageService: MessageService) {}

    public searchItem(query: string, searchType: string): Observable<AlbumSpotify[]> {
       const searchReq = encodeURI(this.spotifyEndPoints.searchItemEndPoint + '?q=' + query + '&type=' + searchType);
        console.log(searchReq);
        return this.http.get(searchReq, this.spotifyEndPoints.createRequestOptions()).map(
            (response: Response) => {
                const albumList: AlbumSpotify[] = response.json().albums.items;
                return albumList;
            });
    }

    addAlbumToPlaylist(spotifyAlbumId: string, playlistId: string): any {
        console.log('adding album to playlist');
        this.getTracksFromSpotify(spotifyAlbumId)
            .subscribe(
                (tracks: Track[]) => {
                    console.log('tracks spotify: ', tracks);
                }

        );
    }

    getTracksFromSpotify(spotifyAlbumId: string): Observable<Track[]> {
        const req = encodeURI(this.spotifyEndPoints.getAlbumTracksEndPoint.replace('{id}', spotifyAlbumId));
        return this.http
            .get(req, this.spotifyEndPoints.createRequestOptions())
            .map(r => {
                console.log(r);
                return this.spotifyMap<Track[]>(r);
            });
    }


    private spotifyMap<T>(res: Response): T {
        console.log('spotMap: ', res.json());
        return res.json().items;
    }


    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add('SpotifyAPIService: ' + message);
      }
}
