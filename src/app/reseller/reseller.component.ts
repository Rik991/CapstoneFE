import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { AutopartsService } from '../services/autopart.service';
import { environment } from '../../environments/environment.development';
import { Subscription } from 'rxjs';
import { ResellerService } from '../services/reseller.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { iRating } from '../interfaces/i-rating';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss'],
})
export class ResellerComponent implements OnInit, OnDestroy {
  reseller!: iReseller;
  autoparts: iAutopartResponse[] = [];
  imgUrl: string = environment.imgUrl;
  userRole: string | null = null;

  // Reactive form per la modifica dei dati
  resellerForm!: FormGroup;
  editMode: boolean = false;
  selectedAvatar?: File;

  // Proprietà per gestire il nuovo rating da inviare
  newRating: iRating = {
    rating: 5,
    comment: '',
    resellerId: 0,
    userId: 0,
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private autopartSvc: AutopartsService,
    private resellerSvc: ResellerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ratingSvc: RatingService
  ) {}

  ngOnInit(): void {
    // 1. Subscribe all'utente autenticato per impostare userId e userRole sempre
    this.subscriptions.add(
      this.authSvc.user$.subscribe((user) => {
        if (user) {
          this.newRating.userId = user.id;
          this.userRole = this.authSvc.getUserRole();
        }
      })
    );

    // 2. Ora controlla il parametro "id" nella route per caricare i dati del reseller
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');
        if (idParam) {
          // Se è presente l'id nella route, lo usiamo per caricare il reseller corrispondente
          const resellerId = Number(idParam);
          this.loadResellerData(resellerId);
        } else {
          // Nessun parametro id: usiamo i dati dell'utente loggato
          this.subscriptions.add(
            this.authSvc.user$.subscribe((user) => {
              if (user) {
                this.reseller = user as iReseller;
                if (this.reseller.id) {
                  this.loadResellerData(this.reseller.id);
                }
              }
            })
          );
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Recupera i dati aggiornati del reseller dal backend e inizializza il form
  private loadResellerData(resellerId: number): void {
    this.resellerSvc.getResellerById(resellerId).subscribe({
      next: (reseller) => {
        this.reseller = reseller;
        this.newRating.resellerId = reseller.id!;
        // Chiamata per aggiornare il rating medio
        this.ratingSvc.getAverageRating(reseller.id!).subscribe({
          next: (avg) => {
            this.reseller.ratingMedio = avg;
          },
          error: (err) =>
            console.error('Errore nel caricamento del rating medio:', err),
        });
        this.initForm();
        this.loadAutoparts();
      },
      error: (err) => console.error('Error loading reseller:', err),
    });
  }

  // Inizializza il reactive form con i dati attuali del reseller
  private initForm(): void {
    this.resellerForm = this.fb.group({
      username: [{ value: this.reseller.username, disabled: true }],
      email: [this.reseller.email, [Validators.required, Validators.email]],
      name: [this.reseller.name, Validators.required],
      surname: [this.reseller.surname, Validators.required],
      phoneNumber: [this.reseller.phoneNumber, Validators.required],
      ragioneSociale: [this.reseller.ragioneSociale, Validators.required],
      partitaIva: [this.reseller.partitaIva, Validators.required],
      sitoWeb: [this.reseller.sitoWeb],
    });
    // Il form parte in modalità sola lettura
    this.resellerForm.disable();
  }

  // Carica gli articoli (autoparts) associati al reseller
  private loadAutoparts(): void {
    if (!this.reseller?.id) {
      console.error('Reseller ID not available');
      return;
    }
    this.autopartSvc.getByReseller(this.reseller.id).subscribe({
      next: (page) => {
        this.autoparts = page.content;
      },
      error: (err) => console.error('Error loading autoparts:', err),
    });
  }

  // Attiva/disattiva la modalità modifica (solo se il ruolo è reseller)
  toggleEdit(): void {
    if (this.userRole === 'ROLE_RESELLER') {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.resellerForm.enable();
        // Manteniamo il campo username sempre in sola lettura
        this.resellerForm.get('username')?.disable();
      } else {
        this.resellerForm.disable();
      }
    }
  }

  // Gestisce l'invio del form per aggiornare i dati
  onSubmit(): void {
    if (this.resellerForm.valid && this.reseller.id) {
      const updatedData = this.resellerForm.getRawValue();
      this.resellerSvc
        .updateReseller(this.reseller.id, updatedData, this.selectedAvatar)
        .subscribe({
          next: (updatedReseller) => {
            this.reseller = updatedReseller;
            this.editMode = false;
            this.resellerForm.disable();
          },
          error: (err) => console.error('Error updating reseller:', err),
        });
    }
  }

  // Se l'utente seleziona un nuovo avatar, lo salva in una proprietà
  onAvatarSelected(event: any): void {
    if (event.target.files?.length) {
      this.selectedAvatar = event.target.files[0];
    }
  }

  // Permette di eliminare un articolo (autopart)
  deleteAutopart(autopartId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.autopartSvc.deleteAutopart(autopartId).subscribe({
        next: () => {
          this.autoparts = this.autoparts.filter((a) => a.id !== autopartId);
          alert('Autopart deleted');
        },
        error: (err) => console.error('Error deleting autopart:', err),
      });
    }
  }

  submitRating(): void {
    if (this.newRating.rating < 1 || this.newRating.rating > 5) {
      alert('Il voto deve essere compreso tra 1 e 5');
      return;
    }
    this.ratingSvc.submitRating(this.newRating).subscribe({
      next: (response) => {
        alert('Valutazione inviata con successo!');
        // Dopo l'invio, aggiorniamo il rating medio
        this.ratingSvc.getAverageRating(this.newRating.resellerId).subscribe({
          next: (avg) => (this.reseller.ratingMedio = avg),
          error: (err) =>
            console.error('Errore nel caricamento del rating medio:', err),
        });
      },
      error: (err) => {
        console.error("Errore durante l'invio della valutazione:", err);
        alert("Errore durante l'invio della valutazione");
      },
    });
  }
}
