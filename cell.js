class Cell {
  constructor() {
    this.position = createVector(random(-width,width), random(-height,height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2.3, 16.75));
    this.acceleration = createVector();
    this.maxForce = random(0.2,5);
    this.maxSpeed = random(2.0,8.0);
    this.gravity = createVector(1,0,1);
    this.colorsPalette = [color(146, 167, 202,30),
      color(186, 196, 219,30),
      color(118, 135, 172,30),
      color(76, 41, 81,30),
      color(144, 62, 92,30),
      color(178, 93, 119,30),
      color(215, 118, 136,30),
      color(246, 156, 164,30),];
     
  }

  

  align(cells) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of cells) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(cells) {
    let perceptionRadius = 34; //24
    let steering = createVector();
    let total = 0;
    for (let other of cells) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(cells) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of cells) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(cells,p) {
    let alignment = this.align(cells);
    let cohesion = this.cohesion(cells);
    let separation = this.separation(cells);
    let seek = this.seek(p);

 //   alignment.mult(alignSlider.value());
  //  cohesion.mult(cohesionSlider.value());
   // separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(seek);
  }

  seek(target)
  {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the position to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxSpeed);
    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce); // Limit to maximum steering force
    return steer;
  }
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
   this.velocity.add(this.gravity);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {

    smooth();
    strokeWeight(1);
    stroke(this.colorsPalette[floor(random(8))],map(this.velocity,2.3,16.75,0,255));
    line(this.position.x, this.position.y, this.position.x, this.position.y);
  }
}

class Equations{

 constructor()
    {
      this.xoff = random(-width,width);
      this.yoff = random(-height,height);
      this.zoff = random(-width,width);
    }
  
  
  *lorentz()
    {

      let a = random(0,12);
      let b = random(20,28);
      let c = random(8.0 / 3.0, 13/6);

      let dt = 0.0001;
    
      let dx = (a * (this.yoff - this.xoff)) * dt;
      let dy = (this.xoff * (b - this.zoff) - this.yoff) * dt;
      let dz = (this.xoff * this.yoff - c * this.zoff) * dt;
      this.xoff = this.xoff + dx;
      this.yoff = this.yoff + dy;
      this.zoff = this.zoff + dz;
     
      yield[this.zoff,this.xoff]

    }

    *set1()
    {
      let u = .0000005;
      let dt = 0.000000000000001;
      let dx = (u * ( this.xoff - 1/3 * (this.xoff*this.xoff*this.xoff) - this.yoff)) * dt;
      let dy = (1/u * this.xoff) * dt;
      
      if(this.xoff > 10000 || this.yoff > 10000 || this.yoff < -1000 || this.xoff < -1000)
      {
        this.xoff = noise(random(-width/2,width/2));
        this.yoff = noise(random(-height/2,height/2));
      }
      this.xoff += this.xoff + dx
      this.yoff += this.yoff + dy
      yield[this.xoff,this.yoff]
      
    }


    *set2()
    {
      let a = random(0,10);
      let b = random(0,10);
      let c = random(0,10);
      let d = random(0,10);
      let dt = 0.001;
      let dx = (a * this.xoff - b*this.yoff) * dt;
      let dy = (c*this.xoff*this.yoff - d*this.yoff) * dt;
     
      this.xoff += dx;
      this.yoff += dy;
      yield[this.xoff,this.yoff]
      
    }

    *set3()
    {
      let b = 0.32899;    
      let dt = .01;
      let dx = (sin(map(this.yoff,-width,width,-2*PI,2*PI)) - b*this.xoff) * dt;
      let dy = (sin(map(this.zoff,-height,height,-2*PI,2*PI)) - b*this.yoff) * dt;
      let dz = (sin(map(this.xoff,-width,width,-2*PI,2*PI)) - b*this.zoff) * dt;
     
      this.xoff += dx;
      this.yoff += dy;
      this.zoff += dz;
      yield[this.xoff,this.zoff]
    }
  
  
  }

