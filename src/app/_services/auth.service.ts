import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  recipientId = new BehaviorSubject<number>(-1);
  photoUrl = new BehaviorSubject<string>('../../assets/tijana.png');

  //default image that we use if img is not provided
  currentPhotoUrl = this.photoUrl.asObservable();
  currentRecipientId = this.recipientId.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  sendRecipientId(recipientId: number) {
    this.recipientId.next(recipientId);
  }
  //when we call this method, value will be passed to this.photoUrl, and updated,
  //instead default photo

  login(model: any) {
    //third parameter is header, opt
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);

            localStorage.setItem('user', JSON.stringify(user.user));
            this.currentUser = user.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
            //we send current user hotoUrl, when we log in
            //we can access this value after we subscribe on currentPhotoUrl, that is type Observable
          }
        })
      );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
    //nemamo response, pipe je nepotreban
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
