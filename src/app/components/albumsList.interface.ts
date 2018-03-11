import { Album } from '../models/album.model';

export interface AlbumsListI {
  albumsList: Album[];
  totalNumberOfPages: Number;
  totalNumberOfAlbums: Number;
  currentPage: Number;

}
