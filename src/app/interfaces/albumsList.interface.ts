import { Album } from '../models/album.model';

export interface AlbumsListI {
  albumsList: Album[];
  totalNumberOfPages: number;
  totalNumberOfAlbums: number;
  currentPage: number;

}
