import { AutopartsService } from './../../../services/autopart.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iAutopartResponse } from '../../../interfaces/i-autopart-response';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { iVehicle } from '../../../interfaces/i-vehicle';

@Component({
  selector: 'app-edit-autopart',
  templateUrl: './edit-autopart.component.html',
  styleUrl: './edit-autopart.component.scss',
})
export class EditAutopartComponent implements OnInit {
  form: FormGroup;
  autopart!: iAutopartResponse;
  selectedVehicles: number[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  filteredModels: iVehicle[] = [];
  brands: string[] = [];

  constructor(
    private fb: FormBuilder,
    private autopartSvc: AutopartsService,
    private router: Router,
    private vehicleSvc: VehicleService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      codiceOe: ['', Validators.required],
      descrizione: [''],
      categoria: [''],
      condizione: ['', Validators.required],
      immagine: [null], // Assicurati che 'immagine' sia il campo File
      prezzo: ['', [Validators.required, Validators.min(0)]],
      veicoliIds: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadAutopartsSelected(id);
    this.loadBrands();
  }

  loadAutopartsSelected(id: number): void {
    this.autopartSvc.getAutopartById(id).subscribe({
      next: (autopart) => {
        this.autopart = autopart;
        this.patchFormValues();
      },
      error: (err) => console.error('Errore nel caricamento del ricambio', err),
    });
  }

  private patchFormValues(): void {
    this.form.patchValue({
      //con patchValue valorizziamo il form con i campi del ricambio in canna
      nome: this.autopart.nome,
      codiceOe: this.autopart.codiceOe,
      descrizione: this.autopart.descrizione,
      categoria: this.autopart.categoria,
      condizione: this.autopart.condizione,
      prezzo: this.autopart.prezzi[0].importo,
      veicoliIds: this.autopart.veicoliCompatibili.map((v) => v.id),
    });

    //carichiamo i veicoli compatibili
    this.selectedVehicles = this.autopart.veicoliCompatibili
      .map((v) => v.id)
      .filter((id): id is number => id !== undefined); //aggiunto il filter per l'errore undefined dopo che il map mi restiuisce l'array di id dei veicoli compatibili
    //gestire le checkbox
  }

  //metodi per gestire il form

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
  onBrandSelected(event: any): void {
    const brand = event.target.value;
    this.vehicleSvc.getVehicleModelsByBrand(brand).subscribe({
      next: (models) => (this.filteredModels = models),
      error: (err) => console.error('Error loading models:', err),
    });
  }
  loadBrands(): void {
    this.vehicleSvc.getAllVehicleBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: (err) => console.error('Error loading brands:', err),
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

      // Aggiungi ogni veicolo id come parametro separato
      const veicoliIds: number[] = this.form.get('veicoliIds')?.value;
      veicoliIds.forEach((id) => {
        formData.append('veicoliIds', id.toString());
      });

      this.autopartSvc.updateAutopart(this.autopart.id, formData).subscribe({
        next: () => {
          alert('Ricambio aggiornato');
          this.router.navigate(['/reseller']);
        },
        error: (err) => console.error('Errore aggiornamento', err),
      });
    }
  }
  goBack() {
    this.router.navigate(['/reseller']);
  }
}
