import { Injectable } from '@angular/core';
import { TokenInterface } from './tokenInterface';

@Injectable()
export class SpotifyAuthService {
    public authenticationTokenKey = 'authenticationTokenKey';
    public authenticationTokenTypeKey = 'authenticationTokenTypeKey';

    authentication = {
        spotify: {
          authenticationUrl: 'https://accounts.spotify.com/authorize',
          clientId: '3ec89e264ee040a1af30921007fbc1c4',
          responseType: 'token',
          redirectUri: '/login',
          scopes: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-top-read user-read-email user-read-private'
        }
      };

    private createRedirectUri(redirectUri: string): string {
        return window.location.origin + redirectUri;
    }
    private createSpotifyAuthenticationUrl(): string {
        const spotifyConfig = this.authentication.spotify;
        return `${spotifyConfig.authenticationUrl}?client_id=${spotifyConfig.clientId}&redirect_uri=${this.createRedirectUri(spotifyConfig.redirectUri)}&response_type=${spotifyConfig.responseType}&scope=${encodeURIComponent(spotifyConfig.scopes)}`;
    }

    public authenticateUsingSpotify() {
        window.location.href = this.createSpotifyAuthenticationUrl();
    }

    public onAuthenticationSuccess({expires_in, access_token, token_type}: TokenInterface) {
        this.storeAuthenticationDetails(access_token, token_type);
    }

    public storeAuthenticationDetails(accessToken: string, tokenType: string) {
        window.sessionStorage.setItem(this.authenticationTokenKey, accessToken);
        window.sessionStorage.setItem(this.authenticationTokenTypeKey, tokenType);
    }

    public clearAuthenticationDetails() {
        window.sessionStorage.removeItem(this.authenticationTokenKey);
        window.sessionStorage.removeItem(this.authenticationTokenTypeKey);
    }

}




// http://localhost:4200/login#

// access_token=BQDF_jLJz8Vl4ZcM-vZTpTkOKTR6woHj6yr3LELCtsW1NLsx9MsHTvWttOQG6M0gLkH_gmEiAvL_A_Vbm-lZEN38BWNcsbuvjd6EQBNsX4_ONF_eiy-MbZ1SJT5JFeGEgY8qyJkP9_4wiRuJ4_P5b1HkiDpODDPq7BO3wAHktfVirApshmEQmdQiZGeVE1vYME4zkEMzp5-FThtpnXiQumDuaXAlU_hN2j9YzcaXZ5pXy7eCbg

// &token_type=Bearer

// &expires_in=3600