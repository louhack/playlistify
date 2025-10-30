// import { RequestOptionsArgs, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';


export class LocalEndPoints {
    public albumEndPoint = `/api/albums`;
    public albumRemoveEndPoint = `/api/albums/:id`;
    public playlistifiedAlbumsEndPoint = '/api/user/playlistifiedAlbum';
    public searchEndPoint = '/api/albums/search';
    public playlistifyEndPoint = '/api/user/playlistifyAlbum';
    public startTaskEndPoint = '/api/script/startTask/:taskName';
    public stopTaskEndPoint = '/api/script/stopTask/:taskName';
    public taskStatusEndPoint = '/api/script/taskStatus/:taskName';


}
