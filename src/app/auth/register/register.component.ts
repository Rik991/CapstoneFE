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
  avatarFile?: File;
  userType: string = 'user';
  @Output() close = new EventEmitter<void>();

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userType: ['user', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: [null],
      ragioneSociale: [''],
      partitaIva: [''],
      sitoWeb: [''],
    });

    this.form.get('userType')?.valueChanges.subscribe((value) => {
      this.userType = value;
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
    }
  }

  register(event: Event) {
    if (this.form.valid) {
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
      if (this.avatarFile) {
        formData.append('avatar', this.avatarFile);
      }

      if (this.userType === 'user') {
        this.authSvc
          .registerUser(formData)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.router.navigate(['/auth/login']);
              alert('Registrazione utente effettuata correttamente');
            },
            error: () => {
              alert('Errore durante la registrazione');
            },
          });
      } else if (this.userType === 'reseller') {
        formData.append('ragioneSociale', this.form.value.ragioneSociale);
        formData.append('partitaIva', this.form.value.partitaIva);
        formData.append('sitoWeb', this.form.value.sitoWeb);

        this.authSvc
          .registerReseller(formData)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.router.navigate(['/auth/login']);
              alert('Registrazione rivenditore effettuata correttamente');
            },
            error: () => {
              alert('Errore durante la registrazione');
            },
          });
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
