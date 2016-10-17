



function addPinableBehaviorType(Physics : any, world: any) {

    Physics.behavior('pinable-behavior', function (parent) {


        return {



            init: function( options ){

                parent.init.call( this );
                this.options( options );


            },
            behave: function (data) {
                var bodies = this.getTargets();
                for (var i = 0, l = bodies.length; i < l; ++i) {
                    if(bodies[i].name === "pinablebody") {
                        bodies[i].update();
                        var absVel = Math.abs( bodies[i].state.vel.x) + Math.abs( bodies[i].state.vel.y);'' +
                        console.log(absVel);
                        if( absVel < 0.0075 && bodies[i].pinned === false ) {
                            world.remove(bodies[i]);
                            addPinableBody(world, Physics, 200, 400, 245, 400);
                        }
                    }
                }
            }
        };
    });
}