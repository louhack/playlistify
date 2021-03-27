import { AlbumSpotify } from '../interfaces/albumSpotifyInterface';
import { AlbumPlaylistI } from '../interfaces/albumAddedToPlaylist.interface';
import { Image } from '../interfaces/spotifyImage.interface';

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
      id: string,
    //   numberOfTracks: number,
    //   totalLength: number,
    //   genres: string[],
       release_date: string,
       total_tracks: number,
       cover: string,
       release_date_precision: string
       images: Image[];
    };

    public heavyBIsH: {
        id: string,
        imagePath: string,
        releaseDate: {
          month: string,
          year: string
        },
        reviewLink: string,
        sources: string
    };

    public yourLastRites: {
      id: string,
      imagePath: string,
      releaseDate: {
        month: string,
        year: string
      }
      reviewLink: string
  };

    // this.spotify.id = '';

    public spotifySearchResults: AlbumSpotify[] = [];
    public searchedOnSpotify = false;
    public addedToPlaylist: AlbumPlaylistI;

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
              heavyBlogInfo: {
                id: string,
                imagePath: string,
                releaseDate: {
                  month: string,
                  year: string
                },
                reviewLink: string,
                sources: string
            },
                spotify: {
                  id: string
                  total_tracks: number,
                  totalLength: number,
                  genres: string[],
                  release_date: string,
                  release_date_precision: string,
                  cover: string,
                  images: Image[]
                },
                yourLastRites: {
                  id: string,
                  imagePath: string,
                  releaseDate: {
                    month: string,
                    year: string
                  }
                  reviewLink: string
              }
              ) {

        this._id = _id;
        this.artistName = artistName;
        this.albumName = albumName;
        this.sputnikMusic = sputnikInfo;
        this.heavyBIsH = heavyBlogInfo;
        this.yourLastRites = yourLastRites;
        if (spotify != null) {
          this.spotify = spotify;
          this.searchedOnSpotify = true;
        }
        // else {
        //   this.spotify = {
        //     id: '',
        //     // numberOfTracks: 0,
        //     // totalLength: 0,
        //     // genres: [],
        //     // releaseDate: '',
        //     // releaseDatePrecision: ''
        //   };
        // }

    }


}
