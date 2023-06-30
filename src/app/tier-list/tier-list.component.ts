import { Component, OnInit } from '@angular/core';
import { GetPokemonService } from '../services/get-pokemon.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tier-list',
  templateUrl: './tier-list.component.html',
  styleUrls: ['./tier-list.component.css']
})
export class TierListComponent implements OnInit {
  pokemonList: any[];
  tierList: { [key: string]: any[] } = {
    'S': [],
    'A': [],
    'B': [],
    'C': [],
    'D': [],
    'F': []
  };

  constructor(private getPokemonService: GetPokemonService) {}

  ngOnInit(): void {
    this.getPokemonService.getPokemonList().pipe(
      switchMap((response: any) => {
        this.pokemonList = response.results;
        const pokemonDetailsRequests = this.pokemonList.map(pokemon => {
          const pokemonId = this.extractPokemonId(pokemon.url);
          return this.getPokemonService.fetchPokemonDetails(pokemonId);
        });
        return forkJoin(pokemonDetailsRequests);
      })
    ).subscribe(
      (pokemonDetails: any[]) => {
        this.pokemonList.forEach((pokemon, index) => {
          pokemon.image = this.getFormattedImagePath(this.extractPokemonId(pokemon.url));
          pokemon.name = pokemonDetails[index].name;
          pokemon.abilities = pokemonDetails[index].abilities.map(ability => ability.ability.name);
          pokemon.moves = pokemonDetails[index].moves.map(move => move.move.name);
          pokemon.type = pokemonDetails[index].types[0].type.name;
          this.movePokemonToTier(pokemon, 'F'); // Move all Pokémon to Tier F by default
        });
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

  extractPokemonId(url: string): number {
    const regex = /\/pokemon\/(\d+)\//;
    const matches = url.match(regex);
    if (matches && matches.length === 2) {
      return Number(matches[1]);
    }
    return null;
  }

  onDragStart(event: DragEvent, pokemon: any): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(pokemon));
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, tier: string): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const droppedPokemon: any = JSON.parse(data);
      this.movePokemonToTier(droppedPokemon, tier);
    }
  }

  movePokemonToTier(pokemon: any, tier: string): void {
    const sourceTier = this.getTierByPokemon(pokemon);
    if (sourceTier) {
      const index = this.tierList[sourceTier].findIndex((p: any) => p.name === pokemon.name);
      if (index !== -1) {
        this.tierList[sourceTier].splice(index, 1);
      }
    }
    this.tierList[tier].push(pokemon);
  }

  getTierByPokemon(pokemon: any): string | undefined {
    for (const tier in this.tierList) {
      if (this.tierList[tier].some((p: any) => p.name === pokemon.name)) {
        return tier;
      }
    }
    return undefined;
  }
}
