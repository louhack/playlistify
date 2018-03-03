import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
      private http: Http,
    ) { }

  ngOnInit() {
    this.authService.retrieveTokenFromServer();
    // this.http.get('/auth/spotify/token')
    // .map(token => token.json())
    // .subscribe(token => {
    //   console.log(token);
    //   if (token) {
    //     this.authService.storeToken(token, 'Bearer');
    //     this.userService.getUserProfilFromSpotify().then(
    //       resp => {
    //         this.userService.getUserPlaylistFromSpotify();
    //         this.router.navigate(['/']);
    //       }
    //     );
    //   }
    // }, err => {
    //   console.log('Authentification impossible');
    //   this.router.navigate(['/error']);
    // });
  }

}
