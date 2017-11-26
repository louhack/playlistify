import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as QueryString from 'query-string';
import { UserService } from '../../services/spotify/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: SpotifyAuthService,
      private userService: UserService,
      private router: Router,
      private route: ActivatedRoute
    ) {
        const params = QueryString.parse(route.snapshot.fragment);

        if (params.access_token) {
          this.authService.storeAuthenticationDetails(params.access_token, params.token_type);
          this.userService.getUserProfilFromSpotify();
          this.router.navigate(['/']);

        } else {
          this.router.navigate(['/error']);
          console.log('Authentication impossible');
        }
        // console.log(params);
        // console.log(route);
   }

  ngOnInit() {
  }

}
