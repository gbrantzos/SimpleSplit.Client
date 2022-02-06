import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'smp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
  }
}
