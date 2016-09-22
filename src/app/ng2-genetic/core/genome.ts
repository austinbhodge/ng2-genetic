import { Observable, Scheduler } from 'rxjs';

//Internal Imports
import { Clone, Specimen, Generation } from './';

export class Genome{
  size : number;
  seed : Specimen;
  crossover : any;
  fitness : any;
  selection : any;
  generation : Generation;
  mutation : any;
  iterations : number;
  fittestAlwaysSurvives : boolean;
  elite : Specimen;
  newGeneration : any;
  survivors : number = 3;

  constructor(size: number, fitness : any, seed : Specimen, crossover : number, selection : any, iterations : number, mutation : any) {
    this.size = size;
    this.fitness = fitness;
    this.seed = seed;
    this.crossover = crossover;
    this.selection = selection;
    this.mutation = mutation;
    this.iterations = iterations;
    this.newGeneration = [];
  }

  seedPopulation(){
    this.generation = new Generation([]);
    for(let i = 0; i < this.size; i++){
      this.generation.population.push(Clone(this.seed, true));
    }
  }

  nextGeneration(){
    this.calculateFitness();
    this.selectionFunction();
    this.mutateGeneration();
  }

  selectionFunction(){
    let survived = [];
    for(let specimen of this.generation.population){
      if(survived.length < this.survivors){
        survived.push(specimen);
      }else{
        survived.forEach((survivor, i) => {
          if(survivor.fitness < specimen.fitness){
            survived.splice(i, 1);
            survived.push(specimen);
          }
        });
      }
    }
    this.generation = new Generation([]);
    for(let i = 0; i < this.size; i++){
      this.generation.population.push(Clone(survived[Math.floor(Math.random() * this.survivors)], true));
    }
  }

  // Iterates through the generation to alter genes
  mutateGeneration(){
    this.generation.population.forEach((specimen => {
      if(Math.random() < this.mutation){
        specimen.genes.forEach(( gene => {
          gene.mutate();
        }))
      }
    }))
    this.generation.genNum += 1;
  }

  calculateFitness(){
    for(let specimen of this.generation.population){
      let specimenFitness = specimen.calculateFitness(this.fitness);
    }
  }

  evolve(){
    this.seedPopulation();
    let evolution = Observable.interval(30);
    return evolution;
  }
}
