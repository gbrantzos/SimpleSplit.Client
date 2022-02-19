import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService, User } from "@core/services/authentication.service";
import { AvatarService } from "@core/services/avatar.service";

@Component({
  selector: 'smp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Output() exitClicked = new EventEmitter();
  @Output() editClicked = new EventEmitter();
  public currentUser: User;
  public userAvatar: string;

  constructor(authenticationService: AuthenticationService,
              avatarService: AvatarService) {
    this.currentUser = authenticationService.currentUser;
    this.userAvatar = avatarService.getAvatarUrl(this.currentUser?.email);
  }

  ngOnInit(): void { }

  onExit = () => this.exitClicked.emit();
  onEdit = () => this.editClicked.emit();
}
