import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPokemonService {
  constructor(private http: HttpClient) { }

  fetchPokemonDetails(pokemonId: number) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return this.http.get<any>(url);
  }

  fetchPokemonType(url: string) {
    return this.http.get<any>(url);
  }

  fetchMoveDetails(url: string) {
    return this.http.get<any>(url);
  }
}
