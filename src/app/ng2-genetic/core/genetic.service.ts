import { Injectable } from '@angular/core';
import { Observable, Scheduler } from 'rxjs';

@Injectable()
export class GeneticService {
  newGenome(size: number, fitness : any, seed : Specimen, crossover : number, selection : any, iterations : number, mutation : any){
    return new Genome(size, fitness, seed, crossover, selection, iterations, mutation);
  }
}

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
  survivors : number = 7;

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
      this.generation.population.push(this.clone(this.seed, true));
    }
  }

  nextGeneration(){
    this.calculateFitness();
    this.selectionFunction();
    this.mutateGeneration();
  }

  selectionFunction(){
    let survived = [];
    let lowest = 0;
    for(let specimen of this.generation.population){
      if(specimen.fitness > lowest || survived.length < this.survivors){
        if(survived.length < this.survivors){
          survived.push(specimen);
        }else{
          survived.forEach((survivor, i) => {
            if(survivor.fitness < specimen.fitness){
              survived.splice(i, 1);
              survived.push(specimen);
              lowest = specimen.fiteness;
            }
          });
        }
      }
    }
    this.generation = new Generation([]);
    for(let i = 0; i < this.size; i++){
      this.generation.population.push(this.clone(survived[Math.floor(Math.random() * this.survivors)], true));
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

  clone( originalObject , circular ){
  	var propertyIndex , descriptor , keys , current , nextSource , indexOf ,
  		copies = [ {
  			source: originalObject ,
  			target: Array.isArray( originalObject ) ? [] : Object.create( Object.getPrototypeOf( originalObject ) )
  		} ] ,
  		cloneObject = copies[ 0 ].target ,
  		sourceReferences = [ originalObject ] ,
  		targetReferences = [ cloneObject ] ;

  	// First in, first out
  	while ( current = copies.shift() )	// jshint ignore:line
  	{
  		keys = Object.getOwnPropertyNames( current.source ) ;

  		for ( propertyIndex = 0 ; propertyIndex < keys.length ; propertyIndex ++ )
  		{
  			// Save the source's descriptor
  			descriptor = Object.getOwnPropertyDescriptor( current.source , keys[ propertyIndex ] ) ;

  			if ( ! descriptor.value || typeof descriptor.value !== 'object' )
  			{
  				Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
  				continue ;
  			}

  			nextSource = descriptor.value ;
  			descriptor.value = Array.isArray( nextSource ) ? [] : Object.create( Object.getPrototypeOf( nextSource ) ) ;

  			if ( circular )
  			{
  				indexOf = sourceReferences.indexOf( nextSource ) ;

  				if ( indexOf !== -1 )
  				{
  					// The source is already referenced, just assign reference
  					descriptor.value = targetReferences[ indexOf ] ;
  					Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
  					continue ;
  				}

  				sourceReferences.push( nextSource ) ;
  				targetReferences.push( descriptor.value ) ;
  			}

  			Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;

  			copies.push( { source: nextSource , target: descriptor.value } ) ;
  		}
  	}

  	return cloneObject ;
  } ;
}
export class Generation{
  genNum: number = 0;
  population : any[];
  constructor(population : any[]) {
    this.population = population;
  }
}

export class Specimen{
  genes: Gene[];
  fitness: number;
  constructor(genes: Gene[], fitness = 1) {
    this.genes = genes;
    this.fitness = fitness;
  }
  calculateFitness(fitnessFunction){
    this.fitness = fitnessFunction(this.genes);
    return this.fitness;
  }
}

export class Gene{
  name : string;
  essential : boolean;
  mutationConstant : number;
  attributes : any[];

  constructor(name: string, attributes: any[], mutationConstant, essential = true) {
    this.name = name;
    this.attributes = attributes;
    this.mutationConstant = mutationConstant;
    this.essential = essential;
  }

  // Alters Genetic Attributes
  mutate(){
    this.attributes.forEach((attribute => {
      //mapping each gene attribute property to an array
      let premutationAr = Object.keys(attribute).map(key => attribute[key]);
      //mapping keys
      let keys = Object.keys(attribute);
      //mapping through values and mutating
      let mutationAr = premutationAr.map(value => {
        if(!isNaN(value)){
          //Add or Subtracts by the magnitude of the constant
          value = ((Math.random() - 0.5) * this.mutationConstant) + value;
        }
        return value;
      })
      //remapping values to the keys on the object
      keys.forEach(((key, i) => {attribute[key] = mutationAr[i]}));
    }))
  }
}
