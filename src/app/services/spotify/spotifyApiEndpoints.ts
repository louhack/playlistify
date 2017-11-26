export class SpotifyEndPoints {
    public currentUserProfileEndPoint = 'https://api.spotify.com/v1/me';
    public currentUserPlaylistsEndPoint = 'https://api.spotify.com/v1/me/playlists';
    public addTrackToPlaylistEndPoint = 'https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks';

}
