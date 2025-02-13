import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iVehicle } from '../../../interfaces/i-vehicle';
import { AutopartsService } from '../../../services/autopart.service';
import { VehicleService } from '../../../services/vehicle.service';

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
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private autopartSvc: AutopartsService,
    private vehicleSvc: VehicleService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      codiceOe: ['', Validators.required],
      descrizione: [''],
      categoria: [''],
      condizione: ['', Validators.required],
      immagine: [null], // Assicurati che 'immagine' sia il campo File
      prezzo: ['', [Validators.required, Validators.min(0)]],
      veicoliIds: [[1]], // Default: id 1 (modello "Generico")
      brand: ['Universale', Validators.required], // Default brand "Universale"
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.vehicleSvc.getAllVehicleBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  onBrandSelected(event: any): void {
    const brand = event.target.value;
    this.form.get('brand')?.setValue(brand);
    if (brand === 'Universale') {
      // Se la marca è "Universale", non vengono richiesti modelli:
      // Imposta il modello di default (id 1)
      this.filteredModels = [];
      this.selectedVehicles = [1];
      this.form.get('veicoliIds')?.setValue([1]);
    } else {
      // Se viene scelta una marca specifica, carica i modelli e resetta la selezione
      this.vehicleSvc.getVehicleModelsByBrand(brand).subscribe({
        next: (models) => {
          this.filteredModels = models;
          this.selectedVehicles = [];
          this.form.get('veicoliIds')?.setValue([]);
        },
        error: (err) => console.error('Error loading models:', err),
      });
    }
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.form.patchValue({
      immagine: file,
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(resetOnly: boolean = false): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nome', this.form.get('nome')?.value);
      formData.append('codiceOe', this.form.get('codiceOe')?.value);
      formData.append('descrizione', this.form.get('descrizione')?.value);
      formData.append('categoria', this.form.get('categoria')?.value);
      formData.append('condizione', this.form.get('condizione')?.value);

      const file: File = this.form.get('immagine')?.value;
      if (file) {
        formData.append('immagine', file, file.name);
      }

      formData.append('prezzo', this.form.get('prezzo')?.value);

      const veicoliIds: number[] = this.form.get('veicoliIds')?.value;
      veicoliIds.forEach((id) => {
        formData.append('veicoliIds', id.toString());
      });

      this.autopartSvc.createAutopart(formData).subscribe({
        next: () => {
          alert('Ricambio pubblicato con successo!');
          if (resetOnly) {
            // Reset del form per inserimenti consecutivi
            this.form.reset({
              nome: '',
              codiceOe: '',
              descrizione: '',
              categoria: '',
              condizione: '',
              immagine: null,
              prezzo: '',
              veicoliIds: [1],
              brand: 'Universale',
            });
            this.selectedVehicles = [1];
            this.imagePreview = null;
          } else {
            this.router.navigate(['/reseller']);
          }
        },
        error: (err) => console.error('Errore nella creazione:', err),
      });
    }
  }

  goBack() {
    this.router.navigate(['/reseller']);
  }
}
