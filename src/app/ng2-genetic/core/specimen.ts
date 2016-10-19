import { Chromosome } from './';

export class Specimen{
  dna: Chromosome[];
  fitness: number;
  constructor(dna: Chromosome[], fitness = 0) {
    this.dna = dna;
    this.fitness = fitness;
  }

  randomize(): any {
    for(let i in this.dna){
      this.dna[i].randomize();
    }
  }
}
