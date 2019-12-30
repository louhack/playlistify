import { Component, OnInit } from '@angular/core';
import { Subject, throwError, Observable, empty } from 'rxjs';
import { SearchService } from '../../services/local/search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { MyCalendar } from '../../shared/myCalendar';
import { UserService } from '../../services/spotify/user.service';
import { SpotifyApiService } from '../../services/spotify/spotifyApi.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

public loading: boolean;
public searchTerm = new Subject<string>();
public searchResults: any;
// public paginationElements: any;
public errorMessage: any;
// public searchScope = 'all';

totalNumberOfAlbums = 0;
totalNumberOfPages = 0;
currentPage = 1;
maxSize = 5;
numPages = 1;
itemsPerPage = 20;


  constructor(private searchService: SearchService, private userService: UserService, private spotifyApiService: SpotifyApiService, private modalService: BsModalService) { }

  public searchForm = new FormGroup(
    {
      search: new FormControl('', Validators.required),
      scope: new FormControl ('all', Validators.required)
    }
  );

  public search() {
    this.searchTerm.pipe(
      map((e: any) => {
        // console.log(e);
        return e;
        // if (e.target.value !== undefined) {
        //   return e;
        // }
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(() => {
        if (this.searchForm.get('search').value !== '') {
          this.loading = true;
          return this.searchService.searchAlbum(this.searchForm.get('search').value, this.searchForm.get('scope').value, this.currentPage.toString(), this.itemsPerPage.toString());
        } else {
          this.searchResults = null;
          // this.paginationElements = null;
          this.currentPage = 1;
          this.totalNumberOfAlbums = 0;
          return empty();
        }
        }),
      catchError(e => {
        console.log(e);
        this.loading = false;
        return throwError(e);
      })
    ).subscribe(v => {
      this.loading = true;
      if (v) {
        this.searchResults = v.foundAlbums;
        // this.paginationElements = this.searchResults;
        this.currentPage = v.page;
        this.totalNumberOfAlbums = v.count;
      } else {
        this.searchResults = null;
        // this.paginationElements = null;
        this.currentPage = 1;
        this.totalNumberOfAlbums = 0;
      }
    });
  }

  updateScope(e: any) {
    // console.log(e.target.value);
    this.currentPage = 1;
    // this.searchScope = e.target.value;
    this.searchTerm.next(e);
  }

  ngOnInit() {
    // this.searchScope = 'all';
    this.search();
  }

  searchTermChanged(e: any) {
    this.currentPage = 1;
    this.searchTerm.next(e);
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    // console.log(this.currentPage);
    // event.itemsPerPage
    this.searchTerm.next(event);
  }

  getDate(i: number, s: number) {
    if (s === 0) {
      return (MyCalendar.month[+this.searchResults[i].sputnikMusic.releaseDate.month - 1]) + ' ' + this.searchResults[i].sputnikMusic.releaseDate.year;
    } else if (s === 1) {
      return (MyCalendar.month[+this.searchResults[i].heavyBIsH.releaseDate.month - 1]) + ' ' + this.searchResults[i].heavyBIsH.releaseDate.year;
    }  else if (s === 2) {
      return (MyCalendar.month[+this.searchResults[i].yourLastRites.releaseDate.month - 1]) + ' ' + this.searchResults[i].yourLastRites.releaseDate.year;
    }
  }

}
