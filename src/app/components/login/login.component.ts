import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as QueryString from 'query-string';
import { UserService } from '../../services/spotify/user.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: SpotifyAuthService,
    private userService: UserService,
      private router: Router,
      private route: ActivatedRoute,
      private http: Http,
    ) {

      http.get('/auth/spotify/token')
        .map(res => res.json())
        .subscribe(res => {
          console.log(res);
          if (res.authToken) {
            this.authService.storeToken(res.authToken, 'Bearer');
            this.userService.getUserProfilFromSpotify().then(
              resp => {
                this.userService.getUserPlaylistFromSpotify();
                this.router.navigate(['/']);
              }
            );
          }
        }, err => {
          console.log('Authentification impossible');
          this.router.navigate(['/error']);
        });

        // const params = QueryString.parse(route.snapshot.fragment);


        //  this.router.navigate(['/']);

        // } else {
        //  // this.router.navigate(['/error']);
        //   console.log('Authentication impossible');
        // }
        // console.log(params);
        // console.log(route);
   }

  ngOnInit() {
  }

}
