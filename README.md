swarm.js
========

swarm.js is a library for rendering swarm-like behaviour on an html canvas element. The system can be thought of as a set of particles subject to brownian motion
with added consideration for momentum as well as gravity about a certain point, or set of points. The agents (i.e. insects/gnats) comprising each swarm are not aware of each other,
but can be made aware of the cursor location. Their position should be manipulated by way of setting the gravitational center(s), this way they will maintain their
organic looking motion.


# Usage


The constructor must take a canvas context as the argument. This will produce a swarm of 100 agents (insects, gnats, call them whatever you like), with default attributes.

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var swarm = new Swarm(context);

In order to render it, you need to set up an animation loop, this can be done with something like setInterval(), or d3.timer(). This has been left exposed so that you can
synchronize your animation between multiple swarms or other drawing operations.

    setInterval(function(){
        swarm.nextIteration(cursorX,cursorY);
    }, 40)

If you don't care about interacting with the cursor, just pass in a large number as if the cursor was very far away:

    setInterval(function(){
        swarm.nextIteration(10000,10000);
    }, 40)


Try messing with the physical parameters (gravity, friction, randomness) of the swarm to see understand the effects; generally choose values that are positive and within [0,1].
All values are normalized with respect to the context's size. So setting

    swarm.centroids = [[0.5, 0.5]];

will cause the insects to be centered around the center of the screen.

Depending on how you set the parameters, these guys can start to look a lot like a swarm of gnats!



# Advanced Usage

The swarm is made of an array of 'insects', which are constructed like this

    var Insect = function(xloc,yloc,xvel,yvel,centroid){

        this.xloc = xloc;
        this.yloc = yloc;
        this.xvel = xvel;
        this.yvel = yvel;
        this.children = [];
        this.centroid = centroid;

    }

These are made by default, if not specified in the Swarm constructor.

We can manually remove and add two insects at a time with:

    swarm.addMember();
    swarm.sacrificeMember();

Also we can make every agent have a 'child' that will follow them around, and correspondingly get rid of them:

    swarm.spawnYouth();
    swarm.purgeYouth();

You may have noticed that the 'centroids' property is actually an array. If you populate that array, the swarm can do some cool stuff based on the locations of the centroids.

    swarm.centroids = [[0.3,0.3], [0.3,0.4], [0.3,0.5], [0.3,0.6], [0.3,0.7], [0.4,0.7], [0.5,0.7], [0.6,0.7], [0.7,0.7], [0.7,0.6], [0.7,0.5], [0.7,0.4], [0.7,0.3], [0.6,0.3], [0.5,0.3], [0.4,0.3],

Above the centroids are set to the outline of a 5 x 5 square.

    // spread the swarm evenly between the centroids

    swarm.equalize();

    //make each agent to continually calculate the nearest centroid and set that to be theirs:

    swarm.currentMode = SWARM_DYNAMIC_CENTROIDS;

Now the agents will migrate between the centroids if they are close enough.
Dynamic centroid mode is computationally intensive, but it looks cool. A grid system is on the to-do list to help deal with this.



That's about it!


