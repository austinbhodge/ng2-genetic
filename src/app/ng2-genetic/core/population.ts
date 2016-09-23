import { Specimen } from './';

export class Population{
  generation: number = 0;
  maxMembers : number;
  members : Specimen[];
  fitnessFunction : Function;
  survivalRatio : number;
  crossoverRatio : number;
  mutationRatio : number;
  optimizeMax : boolean;

  constructor(members : Specimen[], fitnessFunction : Function, maxMembers = 100, survivalRatio = 0.5, mutationRatio = 0.2, crossoverRatio = 0.5, optimizeMax = true){
    this.members = members;
    this.fitnessFunction = fitnessFunction;
    this.survivalRatio = survivalRatio;
    this.optimizeMax = optimizeMax;
  }

  selection(){
    let amtLived = Math.floor(this.survivalRatio * this.members.length);
    let survivors = JSON.parse(JSON.stringify(this.members.splice(amtLived, (this.members.length - 1))));
    delete this.members;
    this.members = survivors;
  }

  // Calculates & Sorts each members' fitness
  populationFitness(){
    for(let i in this.members){
      this.memberFitness(this.members[i]);
    };
    this.members.sort(((memberA, memberB) => {
      if(this.optimizeMax){
        return memberA.fitness - memberB.fitness;
      }else{
        return memberB.fitness - memberA.fitness;
      }
    }));
  }

  populationCrossover(){
    let topSpecimen = Math.floor(this.crossoverRatio * this.members.length);
    while(this.members.length < this.maxMembers){
      for(let i = 0; i < topSpecimen; i++){
        this.members.push(this.memberCrossover(this.members[i], this.members[0]));
      }
    }
  }

  // Calculates a member's fitness
  memberFitness(member : Specimen){
    member.fitness = this.fitnessFunction(member);
    return member.fitness;
  }

  memberCrossover(mother : Specimen, father : Specimen){
    let offspringDNA = [];
    for(let i in father.dna){
      offspringDNA.push(father.dna[i].recombine(mother.dna[i]));
    }
    return new Specimen(offspringDNA);
  }

  // Exports Generation
  export(){
    this.populationFitness();
    let info = {
      "Generation Number" : this.generation,
      "Total Population" : this.members,
      "Maximum Fitness" : this.members[0],
      "Minimum Fitness" : this.members[-1],
      "Population" : this.members
    };
    return JSON.stringify(info);
  }
}
