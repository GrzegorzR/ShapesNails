var colors = [
    ['0x268bd2', '0x0d394f']
    , ['0xc93b3b', '0x561414']
    , ['0xe25e36', '0x79231b']
    , ['0x6c71c4', '0x393f6a']
    , ['0x58c73c', '0x30641c']
    , ['0xcac34c', '0x736a2c']
];

function initWorld(world, Physics) {

    // bounds of the window
    var viewWidth = 800
        , viewHeight = 800
        , viewportBounds = Physics.aabb(0, 0, 1200, 600)
        , edgeBounce
        , renderer
        , styles = {
            'pinablebody': {
                //src: 'http://i.imgur.com/4cJwbhX.png',
                fillStyle: colors[4][0],
                lineWidth: 1,
                strokeStyle: colors[0][1],
                angleIndicator: colors[0][1]
            },
            'circle': {
                //src: 'http://i.imgur.com/4cJwbhX.png',
                fillStyle: colors[0][0],
                lineWidth: 1,
                strokeStyle: colors[0][1],
                angleIndicator: colors[0][1]
            }
            , 'rectangle': {
                fillStyle: colors[1][0],
                lineWidth: 1,
                strokeStyle: colors[1][1],
                angleIndicator: colors[1][1]
            }
            , 'convex-polygon': {
                fillStyle: colors[2][0],
                lineWidth: 1,
                strokeStyle: colors[2][1],
                angleIndicator: colors[2][1]
            }
        }
        ;

    // create a renderer
    renderer = Physics.renderer('pixi', {el: 'viewport', styles: styles, width: 1200, height: 600});
    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function () {
        world.render();
    });

    // constrain objects to these bounds
    edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds
        , restitution: 0.2
        , cof: 0.8
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
        Physics.behavior('constant-acceleration', {acc: {x: 0, y: 0.004}}),
        Physics.behavior('body-impulse-response'),
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune'),
        Physics.behavior('verlet-constraints')
        , edgeBounce
    ]);


}

function startWorld(world, Physics) {
    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function (time) {
        world.step(time);
    });
}

function addInteraction(world, Physics) {
    world.add(Physics.behavior('interactive', {el: world.renderer().container}));
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
    addPinableBehaviorType(Physics, world);
}


function addHouse(world:any, Physics:any) {

    var rect = Physics.body('rectangle', {x:800, y: 600, width: 30, height: 200, mass : 2});
    var rect2 = Physics.body('rectangle', {x: 950, y: 600, width: 30, height: 200, mass : 2});
    var rect3 = Physics.body('rectangle', {x: 875, y: 400, width: 250, height: 30, mass : 2});
    var rect4 = Physics.body('rectangle', {x:800, y: 370, width: 30, height: 100, mass : 2});
    var rect5 = Physics.body('rectangle', {x: 950, y: 370, width: 30, height: 100, mass : 2});
    var pentagon = Physics.body('convex-polygon', {
        mass: 1,
        x: 875,
        y: 300,
        vertices: [
            { x: 0, y: 0 },
            { x: 280, y: 0 },
            { x: 140, y: -100 }

        ]
    });

    world.add(rect);
    world.add(rect2);
    world.add(rect3);
    world.add(rect4);
    world.add(rect5);
    world.add(pentagon);



}



function addBodies(world, Physics) {

    addPinableBody(world, Physics, 200, 400, 245, 400);
    addHouse(world, Physics);
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
        sleepSpeedLimit: 0.1,
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





