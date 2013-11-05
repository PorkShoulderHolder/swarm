/**
 * Created with PyCharm.
 * User: Lisa
 * Date: 9/26/13
 * Time: 10:49 PM
 * To change this template use File | Settings | File Templates.
 */
var Insect = function(xloc,yloc,xvel,yvel,centroid){

    this.xloc = xloc;
    this.yloc = yloc;
    this.xvel = xvel;
    this.yvel = yvel;
    this.centroid = centroid;
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
}



Swarm.prototype.nextIteration = function(cursorX,cursorY){
    swarm = this;

    if (this.currentMode == 'normal_mode' && cursorX != NaN){

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

        dx = insect.xloc- cursorX;
        dy = insect.yloc- cursorY;

        if (swarm.currentMode == 'camera_mode') {
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
        else if (swarm.currentMode == 'assignment_mode'){
            insect.centroid = swarm.centroids[counter%swarm.centroids.length];
        }

        mag = Math.sqrt((dx*dx)+(dy*dy));

        insect.xloc += insect.xvel;
        insect.yloc += insect.yvel;

        if(mag < swarm.maxPerturbDistance){
            insect.xvel += (1 + (0.1/mag)) * swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.xvel - mag * swarm.gravity * (insect.xloc - insect.centroid[0]) + (dx / (mag * mag)) * swarm.frightfulness;
            insect.yvel += (1 + (0.1/mag)) * swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.yvel - mag * swarm.gravity * (insect.yloc - insect.centroid[1]) + (dy / (mag * mag)) * swarm.frightfulness;
        }
        insect.xvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.xvel - (swarm.gravity) * (insect.xloc-insect.centroid[0]);
        insect.yvel += swarm.randomness * (Math.random() - 0.5) - swarm.friction * insect.yvel - (swarm.gravity) * (insect.yloc-insect.centroid[1]);

        x = d3.scale.linear()
            .domain([0, 1])
            .range([0, swarm.context.canvas.width]);

        y = d3.scale.linear()
            .domain([0, 1])
            .range([0, swarm.context.canvas.height]);

        swarm.context.fillRect(x(insect.xloc),y(insect.yloc),2,2);
        counter ++;
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
    var start = 0;
    var finish = (this.insects.length / this.centroids.length) + 1;
        ;
    var partition = 1;
    var swarm = this;
    this.centroids.forEach(function(centroid){
        finish = finish > swarm.insects.length ? swarm.insects.length : finish;
        for ( var i = start; i < finish; i++){
            //if(swarm.insects[i] == undefined){
            console.log((start))
            console.log(finish)
            console.log(i);
           // /}

            swarm.insects[i].centroid = centroid;
        }

        partition ++;
        finish = Math.round(partition * swarm.insects.length / swarm.centroids.length);
        start = finish;

    });
    swarm.currentMode = 'assignment_mode';
    console.log(swarm.currentMode);
    setTimeout(function(){
        swarm.currentMode = 'camera_mode';
    },4000);
    console.log(swarm.currentMode);
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

Swarm.prototype.saveState = function(){
    this.state = [this.gravity,this.friction,this.randomness,this.frightfulness];
}

Swarm.prototype.restoreState = function(){
    this.gravity = this.state[0];
    this.friction = this.state[1];
    this.randomness = this.state[2];
    this.frightfulness = this.state[3];
}




