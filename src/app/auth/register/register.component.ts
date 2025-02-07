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
  currentStep: number = 1; // Gestisce lo step corrente

  @Output() close = new EventEmitter<void>();

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userType: ['user', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Campi opzionali per il rivenditore
      ragioneSociale: [''],
      partitaIva: [''],
      sitoWeb: [''],
      avatar: [null],
    });

    // Aggiusta le validazioni in base al tipo di utente
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

  // Passa da uno step all'altro
  goToStep(step: number): void {
    this.currentStep = step;
  }

  // Verifica se i campi dello step 1 sono validi
  stepOneValid(): boolean {
    return (
      this.form.get('userType')!.valid &&
      this.form.get('name')!.valid &&
      this.form.get('surname')!.valid &&
      this.form.get('username')!.valid &&
      this.form.get('email')!.valid &&
      this.form.get('password')!.valid
    );
  }

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      // Puoi utilizzare FormData se devi gestire il file dell'avatar
      const formData = new FormData();
      formData.append(
        'appUser',
        JSON.stringify({
          username: this.form.value.username,
          name: this.form.value.name,
          surname: this.form.value.surname,
          email: this.form.value.email,
          password: this.form.value.password,
        })
      );
      if (this.form.value.avatar) {
        formData.append('avatar', this.form.value.avatar);
      }
      if (this.form.value.userType === 'reseller') {
        formData.append('ragioneSociale', this.form.value.ragioneSociale);
        formData.append('partitaIva', this.form.value.partitaIva);
        formData.append('sitoWeb', this.form.value.sitoWeb);
      }

      // Esegui la registrazione (ad esempio, tramite AuthService)
      this.authSvc
        .registerUser(formData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
            alert('Registrazione effettuata correttamente');
          },
          error: () => {
            alert('Errore durante la registrazione');
          },
        });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({ avatar: file });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
