import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iUser } from '../../interfaces/i-user';
import { iReseller } from '../../interfaces/i-reseller';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  avatarFile?: File;
  userType: string = 'user';

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: [null],
      ragioneSociale: [''],
      partitaIva: [''],
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
    }
  }

  register(event: Event) {
    event.preventDefault(); // Prevenire il comportamento predefinito del form

    if (this.form.valid) {
      const formData: Partial<iUser> = {
        username: this.form.value.username,
        name: this.form.value.name,
        surname: this.form.value.surname,
        email: this.form.value.email,
        password: this.form.value.password,
        avatar: this.avatarFile ? this.avatarFile.name : '',
      };

      if (this.userType === 'user') {
        this.authSvc.registerUser(formData).subscribe((res) => {
          this.router.navigate(['/auth/login']);
          alert('Registrazione utente effettuata correttamente');
        });
      } else if (this.userType === 'reseller') {
        const resellerFormData: iReseller = {
          ...formData,
          ragioneSociale: this.form.value.ragioneSociale,
          partitaIva: this.form.value.partitaIva,
        };

        this.authSvc.registerReseller(resellerFormData).subscribe((res) => {
          this.router.navigate(['/auth/login']);
          alert('Registrazione rivenditore effettuata correttamente');
        });
      }
    }
  }
}
