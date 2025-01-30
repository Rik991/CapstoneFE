import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopartsService } from '../../services/autopart.service';
import { AuthService } from '../../auth/auth.service';
import { iReseller } from '../../interfaces/i-reseller';
import { VehicleService } from '../../services/vehicle.service';
import { iVehicle } from '../../interfaces/i-vehicle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-autopart',
  templateUrl: './new-autopart.component.html',
  styleUrl: './new-autopart.component.scss',
})
export class NewAutopartComponent {
  form!: FormGroup;
  reseller!: iReseller;
  marche: string[] = [];
  modelliFiltrati: iVehicle[] = [];
  selectedMarca: string = '';

  constructor(
    private fb: FormBuilder,
    private autopartSvc: AutopartsService,
    private authSvc: AuthService,
    private vehicleSvc: VehicleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.reseller = user as iReseller;
    });

    this.vehicleSvc.getAllVehicleBrands().subscribe((marche) => {
      this.marche = marche;
    });

    this.form = this.fb.group({
      nome: ['', Validators.required],
      codiceOe: ['', Validators.required],
      descrizione: ['', Validators.required],
      categoria: ['', Validators.required],
      condizione: ['', Validators.required],
      immagine: [''],
      prezzo: ['', Validators.required],
      veicoliCompatibiliIds: [[], Validators.required],
    });
  }

  onMarcaChange(event: any) {
    this.selectedMarca = event.target.value;
    this.vehicleSvc
      .getVehicleModelsByBrand(this.selectedMarca)
      .subscribe((models) => {
        this.modelliFiltrati = models;
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const newAutopart = {
        ...this.form.value,
        venditoreId: this.reseller.id,
      };

      this.autopartSvc.createAutopart(newAutopart).subscribe((res) => {
        alert('Ricambio pubblicato!');
        this.form.reset();
        this.modelliFiltrati = [];
      });
    }
  }

  goResellerHome() {
    this.router.navigate(['/reseller']);
  }
}
