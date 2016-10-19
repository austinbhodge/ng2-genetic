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


  fitness = (specimen) => {
    let x = specimen.dna[0].genes[0].attributes[0].x;
    let y = specimen.dna[0].genes[0].attributes[1].y;
    let distAvg = 0;
    distAvg = Math.abs((1/Math.hypot(450 - x, 450 - y)));
    console.log(distAvg);
    return distAvg;
  }
  positionGene : Gene;
  positionChromosome : any;
  circle : any;
  context:CanvasRenderingContext2D;
  circles : any;
  @ViewChild("myCanvas") myCanvas;
  constructor( public geneticService : GeneticService){
    this.positionGene = this.geneticService.newGene([{x : (Math.random() * 900)}, {y : (Math.random() * 900)}], 'position', 100)
    this.positionChromosome =  this.geneticService.newChromosome([this.positionGene])
    this.circle = this.geneticService.newSpecimen([this.positionChromosome])
    this.circles = this.geneticService.newPopulation(this.fitness);
    this.circles.seed(this.circle);
  }

  ngAfterViewInit() {
    let canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
    this.tick();
    console.log(this.circles);
  }

  over(event){
    let culture = {
      x : event.offsetX,
      y : event.offsetY,
      r : 50
    }
    this.livingArea.push(culture);
  }

  stop(){

  }

  tick() {
    requestAnimationFrame(()=> {
      this.tick();
      this.circles.populationFitness();
      this.circles.selection();
      this.circles.populationCrossover();
    });

    this.context.clearRect(0, 0, 900, 900);

    for(let culture of this.livingArea){
      this.context.fillStyle="rgba("+ culture.r +"," + culture.r +"," +culture.r + ", 0.3)";
      this.context.strokeStyle="rgba("+ culture.r +"," + culture.r +"," +culture.r + ", 0.6)";
      this.context.beginPath();
      this.context.arc(culture.x, culture.y, culture.r, 0, Math.PI*2, true); // Outer circle
      this.context.stroke();
    }

    for(let circle of this.circles.members){
      if(circle != undefined){
        let fit = circle.fitness;
        let x = circle.dna[0].genes[0].attributes[0].x;
        let y = circle.dna[0].genes[0].attributes[1].y;
        this.context.fillStyle="rgba("+ Math.floor(fit * 210) +"," + Math.floor(fit * 250) +"," + Math.floor(fit * 245) + ", 0.4)";
        this.context.strokeStyle="rgba("+ Math.floor(fit * 100) +"," + Math.floor(fit * 250) +"," + Math.floor(fit * 205) + ", 0.25)";

        this.context.beginPath();
        this.context.arc(x,y,2,0,Math.PI*2,true); // Outer circle
        this.context.stroke();
      }
    }
  }
}
