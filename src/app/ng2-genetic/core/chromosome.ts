import { Gene } from './';

export class Chromosome{
  label: string | number;
  recombination : boolean;
  genes: Gene[];
  id: string = this.createUniqueId();

  constructor(label?: string | number, recombination = true) {
    this.label = label;
    this.recombination = recombination;
  }

  recombine(){
    console.log('recombine');
  }

  createUniqueId(){
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }
}
