import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopartsService } from '../../services/autopart.service';
import { AuthService } from '../../auth/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { iVehicle } from '../../interfaces/i-vehicle';
import { Router } from '@angular/router';
import { iAutopart } from '../../interfaces/i-autopart';

@Component({
  selector: 'app-new-autopart',
  templateUrl: './new-autopart.component.html',
  styleUrls: ['./new-autopart.component.scss'],
})
export class NewAutopartComponent implements OnInit {
  form: FormGroup;
  brands: string[] = [];
  filteredModels: iVehicle[] = [];
  selectedVehicles: number[] = [];

  constructor(
    private fb: FormBuilder,
    private autopartsService: AutopartsService,
    private authService: AuthService,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      codiceOe: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z0-9]{6,10}$/)],
      ],
      descrizione: ['', [Validators.required, Validators.minLength(20)]],
      categoria: ['', Validators.required],
      condizione: ['NUOVO', Validators.required],
      immagine: [''],
      prezzo: ['', [Validators.required, Validators.min(0.01)]],
      veicoliIds: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  private loadBrands(): void {
    this.vehicleService.getAllVehicleBrands().subscribe({
      next: (marche: string[]) => (this.brands = marche),
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  onBrandSelected(event: any): void {
    const marca = event.target.value;
    this.vehicleService.getVehicleModelsByBrand(marca).subscribe({
      next: (models: iVehicle[]) => (this.filteredModels = models),
      error: (err) => console.error('Error loading models:', err),
    });
  }

  toggleVehicleSelection(vehicleId: number): void {
    const index = this.selectedVehicles.indexOf(vehicleId);
    if (index === -1) {
      this.selectedVehicles.push(vehicleId);
    } else {
      this.selectedVehicles.splice(index, 1);
    }
    this.form.get('veicoliIds')?.setValue(this.selectedVehicles); // Aggiorna il form control corretto
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newAutopart: iAutopart = {
        ...this.form.value,
        veicoliIds: this.selectedVehicles, // Campo corretto
        resellerId: this.authService.authSubject$.value?.user.id,
      };

      this.autopartsService.createAutopart(newAutopart).subscribe({
        next: () => {
          alert('Ricambio pubblicato con successo!');
          this.router.navigate(['/reseller']);
        },
        error: (err) => console.error('Errore nella creazione:', err),
      });
    }
  }
}
