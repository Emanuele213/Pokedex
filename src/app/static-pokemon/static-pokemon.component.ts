import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'; // Importa il tuo servizio di autenticazione
import { GetPokemonService } from '../services/get-pokemon.service'; // Importa il tuo servizio per ottenere i dettagli del Pokémon
import { forkJoin } from 'rxjs';
// import anime from 'animejs/lib/anime.es.js';
@Component({
  selector: 'app-static-pokemon',
  templateUrl: './static-pokemon.component.html',
  styleUrls: ['./static-pokemon.component.css']
})
export class StaticPokemonComponent implements OnInit {
  movePokemon: any;
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

  constructor(private authService: AuthService, private getPokemonService: GetPokemonService,) {
    // this.movePokemon = () => {
    //   anime({
    //     targets: '.animation-keyframes-demo .el',
    //     keyframes: [
    //       {translateY: -40},
    //       {translateX: 250},
    //       {translateY: 40},
    //       {translateX: 0},
    //       {translateY: 0}
    //     ],
    //     duration: 4000,
    //     easing: 'easeOutElastic(1, .8)',
    //     loop: true
    //   });
    // };
   }

  ngOnInit() {
    const urlParts = window.location.href.split('/');
    this.id = +urlParts[urlParts.length - 1];

    if (this.authService.isAuthenticated()) {
      this.fetchPokemonDetails(this.id);
    } else {
      // Gestisci l'autenticazione fallita, ad esempio visualizzando un messaggio di errore
      console.error('Utente non autenticato');
    }
    // this.movePokemon();
  }

  fetchPokemonDetails(pokemonId: number) {
    this.getPokemonService.fetchPokemonDetails(pokemonId).subscribe(
      (response) => {
        this.name = response.name;
        this.abilities = response.abilities.map(ability => ability.ability.name);
        this.updateDynamicSrc(pokemonId);

        const typeUrl = response.types[0].type.url;
        this.getPokemonService.fetchPokemonType(typeUrl).subscribe(
          (typeResponse) => {
            this.pokemonType = typeResponse.name;
          },
          (typeError) => {
            console.error('Si è verificato un errore:', typeError);
          }
        );

        const movesRequests = response.moves.map(move => this.getPokemonService.fetchMoveDetails(move.move.url));
        forkJoin(movesRequests).subscribe(
          (movesResponses: any[]) => {
            const moves = movesResponses.map(moveResponse => moveResponse.name);
            this.moves = moves;
          },
          (movesError) => {
            console.error('Si è verificato un errore:', movesError);
          }
        );

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      (error) => {
        console.error('Si è verificato un errore:', error);
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
