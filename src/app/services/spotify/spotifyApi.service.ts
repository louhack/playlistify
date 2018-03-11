import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { UserService } from './user.service';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyEndPoints } from './spotifyApiEndpoints';
import { AlbumSpotify } from '../../interfaces/albumSpotifyInterface';
import { Album } from '../../models/album.model';
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
        // console.log(searchReq);
        return this.http.get(searchReq, this.spotifyEndPoints.createRequestOptions()).map(
            (response: Response) => {
              // console.log(response);
                const albumList: AlbumSpotify[] = response.json().albums.items;
                return albumList;
            });
    }

    addAlbumToPlaylist(spotifyAlbumId: string, playlistId: string): Promise<boolean> {
      return new Promise(
        resolve => {
        // console.log('adding album to playlist');
        this.getTracksFromSpotify(spotifyAlbumId)
        .subscribe(
          (tracks: Track[]) => {
            // console.log('tracks spotify: ', tracks);
            this.addTracksToPlaylist(tracks, this.userService.getSelectedPlaylistId())
              .subscribe( value => {
                // console.log(value);
              });
          }
        );
        resolve(true);
      });
    }

    getTracksFromSpotify(spotifyAlbumId: string): Observable<Track[]> {
        const req = encodeURI(this.spotifyEndPoints.getAlbumTracksEndPoint.replace('{id}', spotifyAlbumId));
        return this.http
            .get(req, this.spotifyEndPoints.createRequestOptions())
            .map(r => {
                // console.log(r);
                return this.spotifyMap<Track[]>(r);
            });
    }

    addTracksToPlaylist(tracks: Track[], playlistId: string) {
      const tracksList = [];
      for (const track of tracks) {
        // tracksList += ',' + track.uri;
        tracksList.push(track.uri);
      }
      // console.log('tracksList ', tracksList);
      const apiEndPoint = this.spotifyEndPoints.addTrackToPlaylistEndPoint.replace('{playlist_id}', playlistId).replace('{user_id}', this.userService.getUserId());
      const request = encodeURI(apiEndPoint);
      const body = { 'uris': tracksList};
      // console.log('BODY ', JSON.stringify(body));
      return this.http.post(request, JSON.stringify(body), this.spotifyEndPoints.createRequestOptions())
          .map((response: Response) => {
            // console.log(response);
            return response;
            // const albumList: AlbumSpotify[] = response.json().albums.items;
            // return albumList;
          });

    }


    private spotifyMap<T>(res: Response): T {
        // console.log('spotMap: ', res.json());
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

    /** Log a spotifyAPIService message with the MessageService */
    private log(message: string) {
        this.messageService.add('SpotifyAPIService: ' + message);
      }
}
