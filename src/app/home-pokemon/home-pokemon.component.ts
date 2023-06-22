import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-pokemon',
  templateUrl: './home-pokemon.component.html',
  styleUrls: ['./home-pokemon.component.css']
})
export class HomePokemonComponent implements OnInit {
  pokemons: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPagesCount: number = 0;
  dynamicSrc: string = '';
  isLoading: boolean = true;

  constructor(private router: Router, private http: HttpClient) { }//--> property

  ngOnInit() {
    this.fetchPokemons();
  }

  fetchPokemons() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=151';
    this.http.get<any>(url).subscribe(
      (response) => {
        this.pokemons = response.results;
        this.totalPagesCount = Math.ceil(this.pokemons.length / this.pageSize);
        this.paginateData();
        this.isLoading = false; // Rimuovi la schermata di caricamento
      },
      (error) => {
        console.error('Si è verificato un errore:', error);
        this.isLoading = false; // Rimuovi la schermata di caricamento anche in caso di errore
      }
    );
  }

  // estrarre la posizione degli array
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.pokemons.slice(startIndex, endIndex);
  }

  // indietro con la pagina
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  // avanti con la pagina 
  goToNextPage() {
    if (this.currentPage < this.totalPagesCount) {
      this.currentPage++;
      this.paginateData();
    }
  }

  navigateToStats(pokemon: any) {
    if (pokemon && pokemon.name) {
      const pokemonId = this.extractPokemonIdFromUrl(pokemon.url);
      this.updateDynamicSrc(pokemonId); // Aggiungi questa riga per aggiornare la sorgente dinamica
      this.router.navigate(['/static', pokemonId]);
    }
  }

  // estrae l'id del pokemon il risultato è un numero intero
  extractPokemonIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
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
