export class Gene{
  name : string;
  essential : boolean;
  mutationConstant : number;
  mutationRate : number;
  attributes : any[];

  constructor(name: string, attributes: any[], mutationConstant = 1, essential = true) {
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

  // Want to create a gene expression method
}
