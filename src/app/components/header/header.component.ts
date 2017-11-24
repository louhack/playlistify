import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: SpotifyAuthService) { }

  ngOnInit() {
  }

  onTest() {
    this.authService.authenticateUsingSpotify();
  }
}
