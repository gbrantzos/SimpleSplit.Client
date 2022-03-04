import {Component, OnInit} from '@angular/core';
import { GitVersion } from "@environments/versions";

export interface MenuItem {
  name: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'smp-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})

export class SideMenuComponent implements OnInit {
  menuItems: MenuItem[] = [{
    name: 'Αρχική',
    route: '/home',
    icon: 'fa-home'
  }, {
    name: 'Εξοδα',
    route: '/expenses',
    icon: 'fa-file-invoice-dollar'
  }]
  public gitVersion: any;

  constructor() {
    this.gitVersion = GitVersion;
  }

  ngOnInit(): void { }
}
