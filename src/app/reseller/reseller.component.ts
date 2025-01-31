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
  autoparts: iAutopart[] = [];
  reseller!: iReseller;

  constructor(
    private authSvc: AuthService,
    private autopartSvc: AutopartsService
  ) {}

  ngOnInit() {
    const resellerId = this.authSvc.authSubject$.value?.user.id;
    if (resellerId) {
      this.autopartSvc.getAutopartByResellerId(resellerId).subscribe({
        next: (autoparts) => (this.autoparts = autoparts),
        error: (err) => console.error('Error loading autoparts:', err),
      });
    }
  }
}
