import { Image } from './spotifyImage.interface';
import { ArtistSpotify } from './ArtistSpotifyInterface';
import { Track } from './trackInterface';

export interface AlbumSpotify {
    artists: ArtistSpotify[];
    id: string;
    images: Image[];
    name: string;
    tracks: Track[];
    album_type: string;
    uri: string;
    total_tracks: number;
    release_date: string;
    release_date_precision: string;
    cover: string;
    releaseDate: string;
}
