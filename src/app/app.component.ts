import { Component, ViewChild } from '@angular/core';
import { GeneticService, Specimen, Gene } from './ng2-genetic';

@Component({
  selector: 'app-root',
  providers: [GeneticService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  livingArea = [
    {
      x : 450,
      y : 450,
      r : 50
    }
  ];
  positionGene = new Gene('position', [{x : 700}, {y : 700}], 65)
  circle = new Specimen([this.positionGene])

  fitness = (genes) => {
    let x = genes[0].attributes[0].x;
    let y = genes[0].attributes[1].y;
    let distAvg = 0;
    for(let culture of this.livingArea){
      //If in culture stop fitness
      distAvg =+ Math.hypot(culture.x - x, culture.y - y) - culture.r;
    }

    return -1 * ((distAvg/this.livingArea.length)/900);
  }
  context:CanvasRenderingContext2D;
  circleGenome : any;
  @ViewChild("myCanvas") myCanvas;
  constructor( public geneticService : GeneticService){
    this.circleGenome = this.geneticService.newGenome(40, this.fitness, this.circle, 20, 'selection', 50, 0.5);
    //this.circleGenome.seedPopulation();
    this.circleGenome.evolve().subscribe(
      gen => {this.circleGenome.nextGeneration()}
    );
  }

  ngAfterViewInit() {
    let canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
    this.tick();
  }

  over(event){
    let culture = {
      x : event.offsetX,
      y : event.offsetY,
      r : this.positionGene.mutationConstant
    }
    this.livingArea.push(culture);
    this.circleGenome.fitness = this.fitness;


  }

  stop(){

  }

  tick() {
    requestAnimationFrame(()=> {
      this.tick();
    });

    this.context.clearRect(0, 0, 900, 900);

    for(let culture of this.livingArea){
      this.context.fillStyle="rgba("+ culture.r +"," + culture.r +"," +culture.r + ", 0.3)";
      this.context.strokeStyle="rgba("+ culture.r +"," + culture.r +"," +culture.r + ", 0.6)";
      this.context.beginPath();
      this.context.arc(culture.x,culture.y, culture.r,0,Math.PI*2,true); // Outer circle
      this.context.stroke();
    }

    for(let circle of this.circleGenome.generation.population){
      let fit = circle.fitness;
      let x = circle.genes[0].attributes[0].x;
      let y = circle.genes[0].attributes[1].y;
      this.context.fillStyle="rgba("+ Math.floor(fit * 210) +"," + Math.floor(fit * 250) +"," + Math.floor(fit * 245) + ", 0.4)";
      this.context.strokeStyle="rgba("+ Math.floor(fit * 100) +"," + Math.floor(fit * 250) +"," + Math.floor(fit * 205) + ", 0.25)";

      this.context.beginPath();
      this.context.arc(x,y,2,0,Math.PI*2,true); // Outer circle
      this.context.stroke();
    }
  }
}
