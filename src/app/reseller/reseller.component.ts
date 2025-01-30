import { Component } from '@angular/core';
import { ResellerService } from '../services/reseller.service';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrl: './reseller.component.scss',
})
export class ResellerComponent {
  reseller: iReseller | undefined;

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.reseller = user as iReseller;
    });
  }
}
