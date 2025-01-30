import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';
import { iAutopart } from '../interfaces/i-autopart';
import { AutopartsService } from '../services/autopart.service';

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrl: './reseller.component.scss',
})
export class ResellerComponent {
  reseller!: iReseller;
  autopartsByReseller: iAutopart[] = [];

  constructor(
    private authSvc: AuthService,
    private autopartSvc: AutopartsService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.reseller = user as iReseller;
    });
    if (this.reseller && this.reseller.id) {
      this.autopartSvc
        .getAutopartByResellerId(this.reseller.id)
        .subscribe((autoparts) => {
          this.autopartsByReseller = autoparts;
        });
    }
  }
}
