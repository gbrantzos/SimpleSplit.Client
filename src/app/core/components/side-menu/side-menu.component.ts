import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { GitVersion } from "@environments/buildInfo";
import { filter, map, mergeMap } from "rxjs";
import { SubSink } from "subsink";

export interface MenuNode {
  name: string;
  route: string;
  module: string;
  icon: string;
  children: MenuItem[]
}

export interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'smp-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})

export class SideMenuComponent implements OnInit, OnDestroy {
  menuNodes: MenuNode[] = [{
    name: 'Αρχική',
    route: '/home',
    module: 'home',
    icon: 'fas fa-home',
    children: [{
      name: 'Αρχικη',
      route: '/home'
    }]
  }, {
    name: 'Εξοδα',
    route: '/expenses',
    module: 'expenses',
    icon: 'fas fa-file-invoice-dollar',
    children: [{
      name: 'Λίστα',
      route: '/expenses/list',
    }, {
      name: 'Κατηγορίες',
      route: '/expenses/categories',
    }, {
      name: 'Λίστα V2 (Generic)',
      route: '/expenses/list_v2',
    },]
  }]

  public buildInfo: string;
  public selectedNode: string = 'home';
  private subs = new SubSink();

  constructor(activatedRoute: ActivatedRoute, router: Router) {
    this.buildInfo = `v0.0.1 - #${GitVersion.revision}, ${GitVersion.buildDate}`;
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
      this.selectedNode = e.module || alert('NO MODULE DEFINED');
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  classes2Array = (classes: string): string[] => classes.split(' ')

  stop(event) { event.stopPropagation() }
}
