
let agents = []

function setup()
{
    createCanvas(900,800);
    for(i = 0; i < 300; i++)
    {
        agents.push(new Cell());
    }
    Eq = new Equations()
    background('#011627');
}

function draw()
{///*
    translate(width/2,height/2);
    rotate(-PI/2);

    arr = Eq.set3().next().value;
    xoff = arr[0]
    yoff = arr[1]
  //  console.log(xoff, yoff)

   for (let agent of agents)
   {
    agent.flock(agents,createVector(xoff,yoff));
    agent.update();
    agent.show();
   // stroke(xoff,yoff);
    } 
  //  */
 /* 
  arr = Eq.set3().next().value;
    xoff = arr[0]
    yoff = arr[1]
    console.log(xoff, yoff)
    */900
}