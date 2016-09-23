//External Imports
import { Injectable } from '@angular/core';
//Internal Imports
import { Genome, Specimen } from './';

@Injectable()
export class GeneticService {
  newGenome(size: number, fitness : any, seed : Specimen, crossover : number, selection : any, iterations : number, mutation : any){
    return new Genome(size, fitness, seed, crossover, selection, iterations, mutation);
  }
}
