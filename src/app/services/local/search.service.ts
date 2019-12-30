import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalEndPoints } from './localAPIEndpoints';
import { Observable, empty } from 'rxjs';
import { Album } from '../../models/album.model';
import { map } from 'rxjs/internal/operators/map';


@Injectable()
export class SearchService {

  public searchResults: any;

  constructor(private http: HttpClient,
    private localApi: LocalEndPoints) {

  }

  searchAlbum(searchItem: string, scope: string, page: string, limit: string): Observable<any> {
      return this.http.get<Album[]>(this.localApi.searchEndPoint, {
        params: {
          q: searchItem,
          scope: scope,
          page: page,
          limit: limit
        }
      }
      ).pipe(
         map(response => {
          // console.log(response);
          return this.searchResults = response['data'];
        })
      );
  }

  // returns the response
  public _searchAlbum() {

  }
}

