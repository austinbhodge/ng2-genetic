//External Imports
import { Injectable } from '@angular/core';
//Internal Imports
import { Population, Specimen, Chromosome, Gene } from './';

@Injectable()
export class GeneticService {
  newPopulation(fitnessFunction : Function, maxMembers?, survivalRatio?, mutationRatio?, crossoverRatio?, optimizeMax?){
    return new Population(fitnessFunction, maxMembers, survivalRatio, mutationRatio, crossoverRatio, optimizeMax)
  }

  newSpecimen(dna: Chromosome[]){
    return new Specimen(dna);
  }

  newChromosome(genes : Gene[], label?: string | number){
    return new Chromosome(genes, label);
  }

  newGene(attributes : any[], label: any, mutation){
    return new Gene(attributes, label, mutation);
  }
}
