import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { UserService } from '../../services/spotify/user.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  userSubscription: Subscription;


  constructor(private authService: SpotifyAuthService,
    private userService: UserService) { }

  ngOnInit() {

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        // console.log(this.user);
      });
    }

  onLogin() {
    this.authService.authenticateUsingSpotify();
  }
}
