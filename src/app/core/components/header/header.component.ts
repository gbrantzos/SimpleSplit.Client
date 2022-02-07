import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, mergeMap } from "rxjs";
import { SubSink } from "subsink";
import { AvatarService } from "@core/services/avatar.service";

@Component({
  selector: 'smp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public title: string;
  public userDisplayName: string;
  public userAvatar: string;

  constructor(private authenticationService: AuthenticationService,
              avatarService: AvatarService,
              activatedRoute: ActivatedRoute,
              router: Router) {
    this.subs.sink = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(e => {
      // console.log(e);
      this.title = e.description || 'NO DESCRIPTION';
    });

    const currentUser = this.authenticationService.currentUser;
    this.userDisplayName = currentUser.displayName;
    this.userAvatar = avatarService.getAvatarUrl(currentUser.email);
  }

  ngOnInit(): void { }

  logout() {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
