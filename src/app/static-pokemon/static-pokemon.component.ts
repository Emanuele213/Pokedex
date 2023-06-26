import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { GetPokemonService } from '../services/get-pokemon.service';
import { map, switchMap } from 'rxjs/operators';

// switchMap viene utilizzato quando si desidera eseguire una nuova operazione asincrona basata sui valori emessi da un osservabile sorgente,
// ma si vuole assicurarsi che solo il risultato dell'operazione più recente venga considerato, ignorando i risultati precedenti 
// se ancora non sono stati completati.

import { forkJoin, Observable } from 'rxjs';

// forkJoin attende fino a quando tutti gli osservabili passati come argomento hanno completato la loro emissione di valori. 
// Solo allora emette un unico valore che contiene tutti i valori emessi dagli osservabili sottostanti.

@Component({
  selector: 'app-static-pokemon',
  templateUrl: './static-pokemon.component.html',
  styleUrls: ['./static-pokemon.component.css']
})
export class StaticPokemonComponent implements OnInit {
  id: number;
  name: string;
  abilities: string[] = [];
  type: string[] = [];
  dynamicSrc: string = '';
  loading: boolean = true;
  pokemonType: string;
  moves: string[] = [];
  typeColors = {
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    // Aggiungi altri tipi qui
  };

  constructor(private authService: AuthService, private getPokemonService: GetPokemonService) { }

  ngOnInit() {
    const urlParts = window.location.href.split('/');
    this.id = +urlParts[urlParts.length - 1];

    if (this.authService.isAuthenticated()) {
      this.fetchPokemonDetails(this.id);
    } else {
      console.error('Utente non autenticato');
    }
  }

  fetchPokemonDetails(pokemonId: number) {
    this.getPokemonService.fetchPokemonDetails(pokemonId).pipe(
      switchMap((response) => {
        this.name = response.name;
        this.abilities = response.abilities.map(ability => ability.ability.name);
        this.updateDynamicSrc(pokemonId);
  
        const typeUrl = response.types[0].type.url;
        return this.getPokemonService.fetchPokemonType(typeUrl).pipe(
          switchMap((typeResponse) => {
            this.pokemonType = typeResponse.name;
            const movesRequests = response.moves.map(move => this.getPokemonService.fetchMoveDetails(move.move.url));
            return forkJoin(movesRequests);
          })
        );
      })
    ).subscribe(
      (movesResponses: any[]) => {
        const moves = movesResponses.map(moveResponse => moveResponse.name);
        this.moves = moves;
      },
      (error) => {
        console.error('Si è verificato un errore:', error);
      },
      () => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    );
  }

  getFormattedImagePath(id: number): string {
    if (id !== undefined && id !== null) {
      const formattedId = this.formatID(id);
      return `assets/img/${formattedId}.png`;
    }
    return '';
  }

  formatID(id: number): string {
    let formattedId = id.toString();
    while (formattedId.length < 3) {
      formattedId = '0' + formattedId;
    }
    return formattedId;
  }

  updateDynamicSrc(id: number) {
    this.dynamicSrc = this.getFormattedImagePath(id);
  }
}
