import { Component, ViewChild } from '@angular/core';
import { GeneticService, Specimen, Gene } from './ng2-genetic';

@Component({
  selector: 'app-root',
  providers: [GeneticService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  positionGene = new Gene('position', [{x : 100}, {y : 100}])
  circle = new Specimen([this.positionGene])
  mouseX = 200;
  mouseY = 200;
  fitness = (genes) => {
    let x = genes[0].attributes[0].x;
    let y = genes[0].attributes[1].y;
    let distance = Math.hypot(this.mouseX - x, this.mouseY - y);
    return Math.abs(1/distance);
  }
  context:CanvasRenderingContext2D;
  circleGenome : any;
  @ViewChild("myCanvas") myCanvas;
  constructor( public geneticService : GeneticService){
    this.circleGenome = this.geneticService.newGenome(110, this.fitness, this.circle, 20, 'selection', 50, 0.3);
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
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  }

  tick() {
    requestAnimationFrame(()=> {
      this.tick();
    });

    this.context.clearRect(0, 0, 900, 700);;
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
