/**
 * Created with PyCharm.
 * User: Sam
 * Date: 9/26/13
 * Time: 10:49 PM
 * To change this template use File | Settings | File Templates.
 */
var x,y;
var Insect = function(xloc,yloc,xvel,yvel,centroid){

    this.xloc = xloc;
    this.yloc = yloc;
    this.xvel = xvel;
    this.yvel = yvel;
    this.children = [];
    this.centroid = centroid;
}

Insect.prototype.spawnYouth = function(){
    this.children.push(new Insect(this.xloc,this.yloc,this.xvel,this.yvel,this.centroid));
}

Insect.prototype.purgeYouth = function(){
    this.children = [];
}


var Swarm = function(insects,centroids,context,gravity,friction,randomness,frightfulness){
    var wid = context.canvas.width;
    var hei = context.canvas.height;
    this.state = [];
    this.saveState();
    if(centroids){
        console.log(centroids[0]);
        this.centroids = centroids;
    }
    else{
        this.centroids = [[0,0]];
    }
    this.gridbins = [];
    for( var i = 0; i < 10; i++){
        var square = [];
        for( var i = 0; i < 10; i++){
            square.push([]);
        }
        this.gridbins.push(square);
    }


    this.gridbins.push
    this.gravity = gravity;
    this.friction = friction;
    this.randomness = randomness;
    this.context = context;
    //this.bugSize = 1.6;
    this.maxPerturbDistance = 0.8;
    this.currentMode = "normal_mode";
    if(frightfulness){
        this.frightfulness = frightfulness;
    }
    else{
        this.frightfulness = 0.0002;
    }
    if(insects){
        this.insects = insects;
    }
    else{
        this.insects = [];
        for(i = 0; i < 400; i++){
            insect = new Insect(this.centroids[0][0],this.centroids[0][1],0,0,this.centroids[0])
            this.insects.push()
        }
    }
    x = d3.scale.linear()
            .domain([0, 1])
            .range([0, this.context.canvas.width]);

    y = d3.scale.linear()
        .domain([0, 1])
        .range([0, this.context.canvas.height]);
}

Swarm.prototype.spawnYouth = function(){
    this.insects.forEach(function(insect){
       insect.spawnYouth();
    });
}

Swarm.prototype.purgeYouth = function(){
    this.insects.forEach(function(insect){
       insect.purgeYouth();
    });
}

Swarm.prototype.killAll = function(){
    this.insects = [];
}

Swarm.prototype.addMember = function(){
    this.insects.push(new Insect(0,0,0,0,this.centroids[0]));
}

Swarm.prototype.sacrificeMember = function(){
    this.insects.pop();
}


Swarm.prototype.nextIteration = function(cursorX,cursorY){
    swarm = this;

    if (this.currentMode == 'normal_mode' && cursorX != NaN && cursorY != NaN){

        var mag;
        var dx;
        var dy;

        dx = this.centroids[0][0]-cursorX;
        dy = this.centroids[0][1]-cursorY;

        mag = Math.sqrt((dx*dx)+(dy*dy));
        var f;
        if(mag < this.maxPerturbDistance){
            f = this.frightfulness;
        }
        else{
            f = 0;
        }
        this.centroids[0][0] -= ((this.centroids[0][0]-0.45)*5 - (dx / (mag * mag))) * f * 5;
        this.centroids[0][1] -= ((this.centroids[0][1]-0.55)*5 - (dy / (mag * mag))) * f * 5;
    }


    counter = 0;



    swarm.insects.forEach(function(insect){



        if (swarm.currentMode == 'camera_mode' && swarm.centroids) {
            insect.centroid = [10000,10000];

            for(k =0; k < swarm.centroids.length; k++){
                da1 = insect.xloc - insect.centroid[0];
                da2 = insect.yloc - insect.centroid[1];
                db1 = insect.xloc - swarm.centroids[k][0];
                db2 = insect.yloc - swarm.centroids[k][1];

                if(((da1*da1) + (da2*da2)) > ((db1*db1) + (db2*db2))){
                    insect.centroid = swarm.centroids[k];
                }
            }
        }else if (swarm.currentMode == 'normal_mode') {
            insect.centroid = swarm.centroids[0];

        }
        dx = insect.xloc- cursorX;
        dy = insect.yloc- cursorY;

        mag = Math.sqrt((dx*dx)+(dy*dy));

        insect.xloc += insect.xvel;
        insect.yloc += insect.yvel;

        if(mag < swarm.maxPerturbDistance){
            insect.xvel += (1 + (0.1/mag)) * swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.xvel - mag * swarm.gravity * (insect.xloc - insect.centroid[0]) + (dx / (mag * mag)) * swarm.frightfulness;
            insect.yvel += (1 + (0.1/mag)) * swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.yvel - mag * swarm.gravity * (insect.yloc - insect.centroid[1]) + (dy / (mag * mag)) * swarm.frightfulness;
        }
        insect.xvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.xvel - (swarm.gravity) * (insect.xloc-insect.centroid[0]);
        insect.yvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.yvel - (swarm.gravity) * (insect.yloc-insect.centroid[1]);

        swarm.context.fillRect(x(insect.xloc),y(insect.yloc),2,2);
        counter ++;

        insect.children.forEach(function(babe){
              babe.centroid = [insect.xloc,insect.yloc];
              babe.xloc += babe.xvel;
              babe.yloc += babe.yvel;
              babe.xvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * babe.xvel - (swarm.gravity) * (babe.xloc-babe.centroid[0]);
              babe.yvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * babe.yvel - (swarm.gravity) * (babe.yloc-babe.centroid[1]);
              swarm.context.fillRect(x(babe.xloc),y(babe.yloc),1,1);
        });

    });

}

Swarm.prototype.setToNormal = function(){
    this.randomness = 0.0028;
    this.friction = 0.04;
    this.gravity = 0.006;
    this.frightfulness = 0.0002;
    this.maxPerturbDistance = 0.3;
}

Swarm.prototype.setToSelectionMode = function(){
    this.randomness = 0.0008;
    this.friction = 0.068;
    this.gravity = 0.007;
    this.frightfulness = 0 ;
    this.maxPerturbDistance = 0;
}

Swarm.prototype.equalize = function(){
   counter = 0;
        var swarm = this;
        swarm.currentMode = 'assignment_mode';

        swarm.centroids.sort();
        swarm.insects.forEach(function(insect){

            insect.centroid = swarm.centroids[counter%swarm.centroids.length];
            counter++;
        });


}

Swarm.prototype.setToExcited = function(){
    this.randomness = 0.0062;
    this.friction = 0.04;
    this.gravity = 0.005;
}

Swarm.prototype.setToCameraCapture = function(){
    this.randomness = 0.0026;
    this.friction = 0.08;
    this.gravity = 0.05;
}

Swarm.prototype.setToWander = function(){
    this.gravity = 0.006;
    this.friction = 0.05;
    this.randomness= 0.002;
    this.frightfulness = 0.00008;
}

Swarm.prototype.setToPicture = function(){
    this.gravity = 0.004;
    this.friction = 0.2;
    this.randomness= 0.001;
    this.frightfulness = 0.00008;
}


Swarm.prototype.saveState = function(){
    this.state = [this.gravity,this.friction,this.randomness,this.frightfulness];
}

Swarm.prototype.restoreState = function(){
    this.gravity = this.state[0];
    this.friction = this.state[1];
    this.randomness = this.state[2];
    this.frightfulness = this.state[3];
}

Swarm.prototype.reAssignToGrid = function(){
    this.insects.sort(function(a,b){
        return a.xloc - b.xloc;
    })
    this.centroids.sort(function(a,b){
        return a.xloc - b.xloc;
    })
    var insectTempCols = [];
    var centroidTempCols = [];
    var i;
    var y = 0;
    var k = 0;
    var cols = this.gridbins[0].length;
    var rows = this.gridbins[0][0].length;
    var x = 0;

        while(i < this.insects.count){
           for(var x = 0; x < cols; x++){
                if(this.insects[i].xloc < x * 1.0 / cols){
                    insectTempCols[x].push(this.insects[i]);
                }
        }
        insectTempCols.forEach(function(container){

            })

    }
}



