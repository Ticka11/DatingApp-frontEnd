import { AuthService } from 'src/app/_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Message } from '../_models/message';

@Injectable({
    providedIn: 'root'
})
export class MessagesResolver implements Resolve<Message> {
    pageNumber = 1;
    pageSize = 5;
    recipientId: number;

    constructor(private userService: UserService,
                private authService: AuthService,
                private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message> {
        return this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
            .pipe(
                catchError((error) => {
                    this.alertify.error('Problem retrieving messages');
                    this.router.navigate(['']);
                    return of(null);
                })
            );
    }


}