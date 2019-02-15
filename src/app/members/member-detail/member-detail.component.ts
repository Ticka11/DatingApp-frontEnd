import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  currentUserId: number;

  @ViewChild('memberTabs') memberTabs: TabsetComponent;


  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = +this.authService.decodedToken.nameid;
    this.route.data.subscribe( data => {
      this.user = data['user'];
    });
    this.hideMessageTab(this.currentUserId, this.user.id);

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      if (selectedTab) {
        this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
      }
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  hideMessageTab(currentId: number, userId: number) {
    if (currentId === userId) {
      document.getElementById('messageTab').innerText = 'You cannot send messages to yourself !!!';
    }
  }

  getImages() {
    const imageUrls = [];
    for (let index = 0; index < this.user.photos.length; index++) {
      imageUrls.push({
        small: this.user.photos[index].url,
        medium: this.user.photos[index].url,
        big: this.user.photos[index].url,
        description: this.user.photos[index].description
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
      this.memberTabs.tabs[tabId].active = true;
    }

  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe((data) => {
      this.alertify.success('You have liked ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }


  // loadUser() {
    //+ added to forse id to be a number
    //it will be retrieved as a string , but then converted into a num
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

}
