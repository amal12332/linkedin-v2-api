import { Component, OnInit } from '@angular/core';
import { Me } from './Models/Models';

import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

// import * as OAuth from 'OAuth';
function _window(): any {
  // return the global native browser window object
  return window;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title = 'Walden incubator app';
  public me: Me;
  public profileImage: string;
  public isLoggedIn: boolean;
  constructor(private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    const oauthScript = document.createElement('script');
    oauthScript.src = 'https://cdn.rawgit.com/oauth-io/oauth-js/c5af4519/dist/oauth.js';

    document.body.appendChild(oauthScript);
  }

  auth() {
    // this.ngxService.start();
    this.ngxService.startBackground();
    // Initialize with your OAuth.io app public key
    _window().OAuth.initialize('F1wAOAqubBtWOVPPwdHcIx4idn8');
    // Use popup for oauth
    _window().OAuth.popup('linkedin2').then(linkedin => {
      console.log('linkedin:', linkedin);
      // Prompts 'welcome' message with User's email on successful login
      // #me() is a convenient method to retrieve user data without requiring you
      // to know which OAuth provider url to call
      linkedin.me().then(data => {
        console.log('me data:', data);
        // alert(data.email);
        this.me = data;
        this.isLoggedIn = true;
      });
      // Retrieves user data from OAuth provider by using #get() and
      // OAuth provider url

      const projectionUrl = '/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))';
      // linkedin.get('/v2/me?projection=(id,firstName,lastName,public-profile-url,location)').then(data => {
      // linkedin.get('/v2/me').then(data => {
      linkedin.get(projectionUrl).then(data => {
        console.log('self data:', data);
        this.profileImage = data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;
        this.ngxService.stopBackground();
      });
      linkedin.get('/v2/emailAddress?q=members&projection=(elements*(handle~))').then(data => {
        console.log('email data:', data);
      });
      // linkedin.get('/v2/liteProfile').then(data => {
      //   console.log('liteProfile data:', data);
      // })


    });
  }
  logout() {
    const auth2 = _window().OAuth;
    auth2.signOut().then(su => {
      alert('User signed out.');
    });
    this.isLoggedIn = false;
  }
}


