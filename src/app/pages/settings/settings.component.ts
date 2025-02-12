import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iUser, Role } from '../../interfaces/i-user';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { iReseller } from '../../interfaces/i-reseller';
import { ResellerService } from '../../services/reseller.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  // La variabile account conterrà i dati dell'utente, oppure se è un reseller, i dati estesi
  imgUrl: string = environment.imgUrl;
  account!: iUser | iReseller;
  isReseller: boolean = false;
  settingsForm!: FormGroup;
  selectedAvatar?: File;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private userSvc: UserService,
    private resellerSvc: ResellerService
  ) {}

  ngOnInit(): void {
    // Recupera l'utente loggato
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        // Se l'utente ha il ruolo reseller, aggiorna isReseller a true
        this.isReseller = user.roles.includes(Role.ROLE_RESELLER);
        if (this.isReseller) {
          // Se è un reseller, carica i dati completi tramite ResellerService
          this.resellerSvc
            .getResellerById(user.id)
            .subscribe((resellerData) => {
              this.account = resellerData;
              this.buildForm();
            });
        } else {
          // Se è un utente normale, usa direttamente i dati ottenuti
          this.account = user;
          this.buildForm();
        }
      }
    });
  }

  private buildForm(): void {
    // Crea il form con i campi comuni
    const formConfig: any = {
      username: [{ value: this.account.username, disabled: true }], // username non modificabile
      email: [this.account.email, [Validators.required, Validators.email]],
      name: [this.account.name, Validators.required],
      surname: [this.account.surname, Validators.required],
      phoneNumber: [this.account.phoneNumber, Validators.required],
    };

    // Se l'utente è un reseller, aggiungi i campi extra
    if (this.isReseller) {
      // Dato che iReseller estende Partial<iUser>, possiamo fare un cast
      const resellerData = this.account as iReseller;
      formConfig.ragioneSociale = [
        resellerData.ragioneSociale || '',
        Validators.required,
      ];
      formConfig.partitaIva = [
        resellerData.partitaIva || '',
        Validators.required,
      ];
      formConfig.sitoWeb = [resellerData.sitoWeb || ''];
    }

    this.settingsForm = this.fb.group(formConfig);
  }

  onAvatarSelected(event: any): void {
    if (event.target.files?.length) {
      this.selectedAvatar = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      const updatedData = this.settingsForm.getRawValue();
      if (this.isReseller) {
        // Per i reseller, chiama ResellerService
        this.resellerSvc
          .updateReseller(this.account.id!, updatedData, this.selectedAvatar)
          .subscribe({
            next: (updatedAccount) => {
              this.account = updatedAccount;
              alert('Dati aggiornati con successo');
            },
            error: (err) => {
              console.error('Errore nell’aggiornamento dei dati', err);
              alert('Errore durante l’aggiornamento');
            },
          });
      } else {
        // Per gli utenti normali, chiama UserService
        this.userSvc
          .updateUser(this.account.id!, updatedData, this.selectedAvatar)
          .subscribe({
            next: (updatedAccount) => {
              this.account = updatedAccount;
              alert('Dati aggiornati con successo');
            },
            error: (err) => {
              console.error('Errore nell’aggiornamento dei dati', err);
              alert('Errore durante l’aggiornamento');
            },
          });
      }
    }
  }
}
