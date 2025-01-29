import { Component } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopart } from '../interfaces/i-autoparts';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: iUser | undefined;
  autoPartsArray: iAutopart[] = [];

  constructor(
    private authSvc: AuthService,
    private autoPartsSvc: AutopartsService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user;
    });

    this.autoPartsSvc.getAllAutoparts().subscribe((autoparts) => {
      this.autoPartsArray = autoparts;
    });
  }
}
