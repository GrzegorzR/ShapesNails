var colors = [
    ['0x268bd2', '0x0d394f'],
    ['0xc93b3b', '0x561414'],
    ['0xe25e36', '0x79231b'],
    ['0x6c71c4', '0x393f6a'],
    ['0x58c73c', '0x30641c'],
    ['0xcac34c', '0x736a2c']
];
function initWorld(world, Physics) {
    // bounds of the window
    var viewWidth = window.innerWidth, viewHeight = window.innerHeight, viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight), edgeBounce, renderer, styles = {
        'circle': {
            //src: 'http://i.imgur.com/4cJwbhX.png',
            fillStyle: colors[0][0],
            lineWidth: 1,
            strokeStyle: colors[0][1],
            angleIndicator: colors[0][1]
        },
        'rectangle': {
            fillStyle: colors[1][0],
            lineWidth: 1,
            strokeStyle: colors[1][1],
            angleIndicator: colors[1][1]
        },
        'convex-polygon': {
            fillStyle: colors[2][0],
            lineWidth: 1,
            strokeStyle: colors[2][1],
            angleIndicator: colors[2][1]
        }
    };
    // create a renderer
    renderer = Physics.renderer('pixi', { el: 'viewport', styles: styles });
    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function () {
        world.render();
    });
    // constrain objects to these bounds
    edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.2,
        cof: 0.8
    });
    // resize events
    window.addEventListener('resize', function () {
        // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
        // update the boundaries
        edgeBounce.setAABB(viewportBounds);
    }, true);
    // add behaviors to the world
    world.add([
        Physics.behavior('constant-acceleration', { acc: { x: 0, y: 0.004 } }),
        Physics.behavior('body-impulse-response'),
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune'),
        Physics.behavior('verlet-constraints'),
        edgeBounce
    ]);
}
function startWorld(world, Physics) {
    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function (time) {
        world.step(time);
    });
}
function addInteraction(world, Physics) {
    world.add(Physics.behavior('interactive', { el: world.renderer().container }));
    var attractor = Physics.behavior('attractor', {
        order: 0,
        strength: 0.002
    });
    /*
     world.on({
     'interact:poke': function( pos ){
     world.wakeUpAll();
     attractor.position( pos );
     world.add( attractor );
     }
     ,'interact:move': function( pos ){
     attractor.position( pos );
     }
     ,'interact:release': function(){
     world.wakeUpAll();
     world.remove( attractor );
     }
     });
     */
}
function addBehaviour(world, Physics) {
    var beh = Physics.behavior('pinable-behavior');
    world.add(beh);
}
function makeBody(obj) {
    return this.body(obj.name, obj);
}
function addCustomTypes(world, Physics) {
    addPinableBodyType(Physics);
    addPinableBehaviorType(Physics);
}
function addPinableBody(world, Physics, xpos, ypos, xpin, ypin) {
    var nail = Physics.body('circle', { x: 40, y: 30, radius: 2 });
    var myWheel1 = Physics.body('circle', { x: 40, y: 30, radius: 2 });
    var myWheel2 = Physics.body('circle', { x: 40, y: 30, radius: 2 });
    var pinable = Physics.body('pinablebody', { x: xpos, y: ypos, width: 200, height: 30, mass: 5 });
    //pinable.nail = nail;
    //pinable.nailr1 = myWheel1;
    //pinable.nailr2 = myWheel2;
    world.add(pinable);
    //world.add(nail);
    //world.add(myWheel1);
    //world.add(myWheel2);
    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 65:
                pinable.state.angular.acc += 0.001;
                break;
            case 68:
                pinable.state.angular.acc -= 0.001;
                break;
            case 75:
                pinable.unpin();
                break;
        }
    });
    pinable.pin(xpin, ypin);
    world.on({
        'interact:poke': function (pos) {
            // addPinableBody(world, Physics, xpos, ypos, xpin, ypin )
            pinable.unpin();
        }
    });
}
function addBodies(world, Physics) {
    addPinableBody(world, Physics, 500, 400, 540, 400);
    // addPinableBody(world,Physics,400,400,400,450);
}
require([
    'physicsjs',
    'pixi'
], function (Physics, PIXI) {
    window.PIXI = PIXI;
    var worldConfig = {
        // timestep
        timestep: 2,
        // maximum number of iterations per step
        maxIPF: 4,
        // default integrator
        integrator: 'verlet',
        // is sleeping disabled?
        sleepDisabled: false,
        // speed at which bodies wake up
        sleepSpeedLimit: 1,
        // variance in position below which bodies fall asleep
        sleepVarianceLimit: 0,
        // time (ms) before sleepy bodies fall asleep
        sleepTimeLimit: 500
    };
    Physics(worldConfig, [
        initWorld,
        addInteraction,
        addCustomTypes,
        addBehaviour,
        addBodies,
        startWorld
    ]);
});
//# sourceMappingURL=game.js.map