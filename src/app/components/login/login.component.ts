import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: SpotifyAuthService,
    ) { }

  ngOnInit() {
    this.authService.retrieveTokenFromServer();
  }

}
