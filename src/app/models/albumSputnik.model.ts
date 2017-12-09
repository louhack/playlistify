import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';

export class AlbumSputnik {
    public artistName: string;
    public albumName: string;
    public idAlbumSputnik: string;
    public imagePath: string;
    public note: number;
    public releaseMonth: string;

    public spotifySearchResults: AlbumSpotify[];
    public searchedOnSpotify = false;

    // "album_id_sputnik_music": "259560",
    // "artiste": "Gang of Youths",
    // "album": "Go Farther In Lightness",
    // "note": "4.4",
    // "release_month": "August 2017"


    constructor(artistName: string, albumName: string, idAlbumSputnik: string,                     imagePath: string, note: number, releaseMonth: string ) {
        this.artistName = artistName;
        this.albumName = albumName;
        this.idAlbumSputnik = idAlbumSputnik;
        this.imagePath = imagePath;
        this.note = note;
        this.releaseMonth = releaseMonth;
    }
}
