import { Gene } from './';
import * as _ from 'lodash';
export class Chromosome{
  label: string | number;
  recombination : boolean;
  genes: Gene[];
  id: string = this.createUniqueId();

  constructor(genes : Gene[], label?: string | number, recombination = true) {
    this.label = label;
    this.genes = genes;
    this.recombination = recombination;
  }

  recombine(chromatid : Chromosome){
    if(this.recombination){
      let babyGenes = [];
      for(let i in chromatid.genes){
        if(0 < (Math.random() - .5)){
          babyGenes.push(_.cloneDeep(chromatid.genes[i]));
        }else{
          babyGenes.push(_.cloneDeep(this.genes[i]));
        }
      }
      return new Chromosome(babyGenes, (this.label))
    }else {
      return this;
    }
  }

  randomize(){
    for(let i in this.genes){
      this.genes[i].mutate();
    }
  }

  createUniqueId(){
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }
}
