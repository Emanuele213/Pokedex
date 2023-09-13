import { Component } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';

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
    'F': [],
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
          this.movePokemonToTier(pokemon, 'F'); // Tiene i pokemon nella tier F
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

  //estrae l'ID numerico di un Pokémon da una URL specifica. Prende in input una stringa url che rappresenta l'URL del Pokémon, 
  //ad esempio "https://pokeapi.co/api/v2/pokemon/25/". La funzione utilizza una espressione regolare (/\/pokemon\/(\d+)\//) 
  //per cercare una corrispondenza nella stringa url che corrisponda al formato "/pokemon/numero/".

  extractPokemonId(url: string): number {
    const regex = /\/pokemon\/(\d+)\//;
    const matches = url.match(regex);
    if (matches && matches.length === 2) {
      return Number(matches[1]);
    }
    return null;
  }

  //Serve per il trascinamento
  onDragStart(event: DragEvent, pokemon: any): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(pokemon));
  }

  //togli il comportamento di default del browser che non permette il rilascio 
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }
  
  //Viene richiamata quando un pokemon viene rilasciato nell'area di rilascio. 
  //Impedisce il comportamento predefinito del browser (che sarebbe quello di aprire l'immagine) utilizzando il metodo preventDefault dell'evento.
  
  onDrop(event: DragEvent, tier: string): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const droppedPokemon: any = JSON.parse(data);
      this.movePokemonToTier(droppedPokemon, tier);
    }
  }

  //sposta un Pokémon da una tier all'altra. Prendo in input l'oggetto Pokémon da spostare e la tier di destinazione. Prima di spostare il Pokémon, 
  //verifico in quale tier si trova attualmente utilizzando la funzione getTierByPokemon. Successivamente, cerca l'indice del Pokémon nella tier di origine utilizzando 
  //il metodo findIndex. Se l'indice viene trovato (index !== -1), viene rimosso dalla tier di origine utilizzando il metodo splice. Infine, il Pokémon viene aggiunto 
  //alla tier di destinazione utilizzando il metodo push.

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

  //restituisce la tier in cui si trova attualmente un Pokémon. Prende in input l'oggetto Pokémon e utilizza un ciclo for...in per 
  //iterare attraverso tutte le tier nella variabile tierList. Per ogni tier, controlla se il Pokémon è presente nella tier utilizzando il metodo some. 
  //Se il Pokémon viene trovato, restituisce la tier corrente. Se il Pokémon non viene trovato in nessuna tier, restituisce undefined.

  getTierByPokemon(pokemon: any): string | undefined {
    for (const tier in this.tierList) {
      if (this.tierList[tier].some((p: any) => p.name === pokemon.name)) {
        return tier;
      }
    }
    return undefined;
  }
}
