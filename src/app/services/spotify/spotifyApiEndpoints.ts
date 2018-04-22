import { RequestOptionsArgs, Headers } from '@angular/http';

export class SpotifyEndPoints {
    public currentUserProfileEndPoint = 'https://api.spotify.com/v1/me';
    public currentUserPlaylistsEndPoint = 'https://api.spotify.com/v1/me/playlists';
    public addTrackToPlaylistEndPoint = 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks';
    public searchItemEndPoint = 'https://api.spotify.com/v1/search';
    public getAlbumTracksEndPoint = 'https://api.spotify.com/v1/albums/{id}/tracks';
    public createPlaylistEndPoint = 'https://api.spotify.com/v1/users/{user_id}/playlists';

    public authenticationTokenKey = 'authenticationTokenKey';
    public authenticationTokenTypeKey = 'authenticationTokenTypeKey';

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
