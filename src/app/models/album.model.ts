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

    // this.spotify.id = '';

    public spotifySearchResults: AlbumSpotify[] = [];
    public searchedOnSpotify = false;
    public addedToPlaylist: string;

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
        // console.log('constructeur album ', this.albumName),
        if (spotify != null) {
          // console.log(spotify);
          this.spotify = spotify;
          this.searchedOnSpotify = true;
        } else {
          this.spotify = {
            id: ''
          };
        }

    }


}
