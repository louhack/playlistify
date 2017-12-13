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
        });

        const params = QueryString.parse(route.snapshot.fragment);

        if (params.access_token) {
          this.authService.storeToken(params.access_token, params.token_type);
          this.userService.getUserProfilFromSpotify().then(
            res => {
              this.userService.getUserPlaylistFromSpotify();
            }
          );
          this.router.navigate(['/']);

        } else {
         // this.router.navigate(['/error']);
          console.log('Authentication impossible');
        }
        // console.log(params);
        // console.log(route);
   }

  ngOnInit() {
  }

}
