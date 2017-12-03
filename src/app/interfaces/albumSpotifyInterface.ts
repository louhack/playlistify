import { Image } from './spotifyImage.interface';
import { ArtistSpotify } from './ArtistSpotifyInterface';

export interface AlbumSpotify {
    artists: ArtistSpotify[];
    id: string;
    images: Image[];
    name: string;
}
