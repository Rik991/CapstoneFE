import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  currentStep: number = 1; // Gestione degli step del form (se necessario)
  @Output() registrationComplete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userType: ['user', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Campi opzionali per il reseller
      ragioneSociale: [''],
      partitaIva: [''],
      sitoWeb: [''],
      avatar: [null],
    });

    // Quando cambia il tipo di utente, aggiusta le validazioni
    this.form.get('userType')?.valueChanges.subscribe((value) => {
      const ragioneSocialeControl = this.form.get('ragioneSociale');
      const partitaIvaControl = this.form.get('partitaIva');
      const sitoWebControl = this.form.get('sitoWeb');

      if (value === 'reseller') {
        ragioneSocialeControl?.setValidators(Validators.required);
        partitaIvaControl?.setValidators(Validators.required);
        sitoWebControl?.setValidators(Validators.required);
      } else {
        ragioneSocialeControl?.clearValidators();
        partitaIvaControl?.clearValidators();
        sitoWebControl?.clearValidators();
      }
      ragioneSocialeControl?.updateValueAndValidity();
      partitaIvaControl?.updateValueAndValidity();
      sitoWebControl?.updateValueAndValidity();
    });
  }

  // Passa da uno step all'altro (se il form è a step)
  goToStep(step: number): void {
    this.currentStep = step;
  }

  // Invia il form per la registrazione
  register(event: Event): void {
    event.preventDefault();
    if (this.form.invalid) return;

    const formData = new FormData();
    const userData = {
      username: this.form.value.username,
      name: this.form.value.name,
      surname: this.form.value.surname,
      phoneNumber: this.form.value.phoneNumber,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    formData.append('appUser', JSON.stringify(userData));

    if (this.form.value.avatar) {
      formData.append('avatar', this.form.value.avatar);
    }

    if (this.form.value.userType === 'reseller') {
      formData.append('ragioneSociale', this.form.value.ragioneSociale);
      formData.append('partitaIva', this.form.value.partitaIva);
      formData.append('sitoWeb', this.form.value.sitoWeb);

      this.authSvc
        .registerReseller(formData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.registrationComplete.emit();
            this.router.navigate(['']);
            alert('Reseller registration successful');
          },
          error: () => alert('Error during reseller registration'),
        });
    } else {
      this.authSvc
        .registerUser(formData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.registrationComplete.emit();
            this.router.navigate(['']);
            alert('User registration successful');
          },
          error: () => alert('Error during registration'),
        });
    }
  }

  // Gestisce il cambio del file (avatar)
  onFileChange(event: any): void {
    if (event.target.files?.length > 0) {
      const file = event.target.files[0];

      // Formati immagine consentiti
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
        'image/gif',
        'image/tiff',
      ];

      // Dimensione massima consentita: 2MB
      const maxSizeInBytes = 2 * 1024 * 1024;

      // Controllo del tipo di file
      if (!allowedTypes.includes(file.type)) {
        alert(
          'Formato non supportato. I formati ammessi sono: JPEG, PNG, WEBP, HEIC/HEIF, GIF, TIFF.'
        );
        return;
      }

      // Controllo della dimensione del file
      if (file.size > maxSizeInBytes) {
        alert(
          'Il file è troppo grande. La dimensione massima consentita è 2MB.'
        );
        return;
      }

      // Assegno il file (avatar) al form
      this.form.patchValue({ avatar: file });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
