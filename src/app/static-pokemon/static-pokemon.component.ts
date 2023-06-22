import { Component, OnInit } from '@angular/core';
import { GetPokemonService  } from '../services/get-pokemon.service'; // Aggiorna il percorso al tuo service
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-static-pokemon',
  templateUrl: './static-pokemon.component.html',
  styleUrls: ['./static-pokemon.component.css']
})
export class StaticPokemonComponent implements OnInit {
  pokemonStatus: string = 'uncaptured';
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

  constructor(private getPokemonService: GetPokemonService) { }

  ngOnInit() {
    const urlParts = window.location.href.split('/');
    this.id = +urlParts[urlParts.length - 1];
    this.fetchPokemonDetails(this.id);
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
            const pokemonType = typeResponse.name;
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