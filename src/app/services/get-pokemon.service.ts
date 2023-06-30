import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPokemonService {
  constructor(private http: HttpClient) {}

  getPokemonList(): Observable<any> {
    const pokemonListUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    return this.http.get<any>(pokemonListUrl);
  }

  fetchPokemonDetails(pokemonId: number): Observable<any> {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return this.http.get<any>(url);
  }

  fetchPokemonType(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  fetchMoveDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
