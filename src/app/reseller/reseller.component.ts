import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { AutopartsService } from '../services/autopart.service';
import { environment } from '../../environments/environment.development';
import { Subscription, take } from 'rxjs';
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

  // Aggiungiamo la proprietà per verificare se l'utente è proprietario
  isOwner: boolean = false;

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
    // Sottoscrizione per ottenere l'utente autenticato e impostare userRole e newRating.userId
    this.subscriptions.add(
      this.authSvc.user$.subscribe((user) => {
        if (user) {
          this.newRating.userId = user.id;
          this.userRole = this.authSvc.getUserRole();
        }
      })
    );

    // Carica i dati del reseller: se nella route c'è un id, usalo, altrimenti usa l'utente loggato
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const resellerId = Number(idParam);
        this.loadResellerData(resellerId);
      } else {
        const user = this.authSvc.getCurrentUser();
        if (user) {
          this.loadResellerData(user.id!);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Carica i dati del reseller dal back-end
  private loadResellerData(resellerId: number): void {
    this.resellerSvc.getResellerById(resellerId).subscribe({
      next: (reseller) => {
        this.reseller = reseller;
        this.newRating.resellerId = reseller.id!;
        // Imposta isOwner confrontando l'id dell'utente loggato con quello del reseller
        const currentUser = this.authSvc.getCurrentUser();
        this.isOwner = currentUser ? currentUser.id === reseller.id : false;
        // Aggiorna il rating medio
        this.ratingSvc.getAverageRating(reseller.id!).subscribe({
          next: (avg) => (this.reseller.ratingMedio = avg),
          error: (err) =>
            console.error('Errore nel caricamento del rating medio:', err),
        });
        this.loadAutoparts();
      },
      error: (err) => console.error('Error loading reseller:', err),
    });
  }

  // Carica gli articoli (autoparts) associati
  private loadAutoparts(): void {
    if (!this.reseller?.id) {
      console.error('Reseller ID not available');
      return;
    }
    this.autopartSvc.getByReseller(this.reseller.id).subscribe({
      next: (page) => (this.autoparts = page.content),
      error: (err) => console.error('Error loading autoparts:', err),
    });
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
