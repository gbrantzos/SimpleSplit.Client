import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, mergeMap, take, takeWhile } from "rxjs";
import { SubSink } from "subsink";
import { AvatarService } from "@core/services/avatar.service";
import { ConnectionPositionPair, Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { UserProfileComponent } from "@core/components/user-profile/user-profile.component";
import { MatDialog } from "@angular/material/dialog";
import { UserProfileEditorComponent } from "@core/components/user-profile-editor/user-profile-editor.component";

@Component({
  selector: 'smp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userImage') label: ElementRef;
  private subs = new SubSink();
  public title: string;
  public userDisplayName: string;
  public userAvatar: string;

  constructor(private authenticationService: AuthenticationService,
              private overlay: Overlay,
              private matDialog: MatDialog,
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

    this.subs.sink = this.authenticationService
      .user$
      .subscribe(user => {
        this.userDisplayName = user?.displayName;
        this.userAvatar = avatarService.getAvatarUrl(user?.email);
      })
    ;
  }

  ngOnInit(): void { }

  logout() {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onUserClick = () => {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.label)
      .withPositions([
        new ConnectionPositionPair(
          {originX: 'end', originY: 'bottom'},
          {overlayX: 'end', overlayY: 'top'},
          30,
          20
        ),
        new ConnectionPositionPair(
          {originX: 'start', originY: 'top'},
          {overlayX: 'start', overlayY: 'bottom'},
        ),
      ])
      .withPush(false);
    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    const overlayRef = this.overlay.create({
      width: '280px',
      height: '340px',
      disposeOnNavigation: true,
      hasBackdrop: true,
      panelClass: 'mat-elevation-z8',
      positionStrategy,
      scrollStrategy
    });

    const userProfilePortal = new ComponentPortal(UserProfileComponent);
    const ref = overlayRef.attach(userProfilePortal);
    overlayRef.backdropClick()
      .pipe(take(1))
      .subscribe(_ => overlayRef.detach());
    ref.instance.exitClicked.subscribe(_ => {
      overlayRef.detach();
      this.authenticationService.logout();
    })
    ref.instance.editClicked.subscribe((_ => {
      overlayRef.detach();
      this.matDialog
        .open(UserProfileEditorComponent, {
          width: '650px',
          hasBackdrop: true,
          disableClose: true,
          //data: { names },
        })
        .afterClosed()
        .subscribe((r) => {
          if (r) {
            //this.store.addDefaultQuery(r);
          }
        });

    }))
  }
}
