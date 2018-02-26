import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';

export class Album {
    public _id: string;
    public artistName: string;
    public albumName: string;
    public sputnikMusic: {
      id: string,
      imagePath: string,
      note: number,
      releaseDate: {
        month: string,
        year: string
      }
    };
    public spotify: {
      id: string;
    };

    public spotifySearchResults: AlbumSpotify[];
    public searchedOnSpotify = false;

    // "album_id_sputnik_music": "259560",
    // "artiste": "Gang of Youths",
    // "album": "Go Farther In Lightness",
    // "note": "4.4",
    // "release_month": "August 2017"


    constructor(_id: string, artistName: string, albumName: string,
                sputnikInfo: {
                  id: string,
                  imagePath: string,
                  note: number,
                  releaseDate: {
                    month: string,
                    year: string
                  }
              },
                spotify: {id: string}
              ) {

        this._id = _id;
        this.artistName = artistName;
        this.albumName = albumName;
        this.sputnikMusic = sputnikInfo;
        this.spotify = spotify;
        if (this.spotify.id) {
          this.searchedOnSpotify = true;
        }
    }


}
