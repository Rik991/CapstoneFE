import { Component } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopart } from '../interfaces/i-autopart';
import { iVehicle } from '../interfaces/i-vehicle';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: iUser | undefined;
  autoPartsArray: iAutopart[] = [];
  vehicles: iVehicle[] = [];

  constructor(
    private authSvc: AuthService,
    private autoPartsSvc: AutopartsService,
    private vehicleSvc: VehicleService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user;
    });

    this.autoPartsSvc.getAllAutoparts().subscribe((autoparts) => {
      this.autoPartsArray = autoparts;
    });

    this.vehicleSvc.getAllVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }
}
