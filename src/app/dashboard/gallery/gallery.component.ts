import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Subscription, switchMap, take } from 'rxjs';
import { RouteService, UserService } from 'src/app/services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  userObs!: Subscription;
  images: GalleryItem[] = [];
  imagesAux: GalleryItem[] = [];
  isLoading: boolean = true;
  constructor(
    private userService: UserService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        switchMap((user) => this.routeService.getRoutesByUser(user.idUser)),
        take(1)
      )
      .subscribe((routes) => {
        routes.forEach((route) => {
          console.log(route.idRoute);
          route.photos?.forEach((photo) => {
            const image = new ImageItem({
              src: photo.photoUrl,
              thumb: photo.photoUrl,
            });
            this.imagesAux.push(image);
          });
        });
        this.images = this.imagesAux;
        this.isLoading = false;
      });
  }
}
