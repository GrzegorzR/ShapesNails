



function addPinableBehaviorType(Physics : any) {

    Physics.behavior('pinable-behavior', function (parent) {


        return {



            init: function( options ){

                parent.init.call( this );
                this.options( options );


            },


            // extended
            behave: function (data) {

                var bodies = this.getTargets();

                for (var i = 0, l = bodies.length; i < l; ++i) {
                    if(bodies[i].name === "pinablebody") {
                       // bodies[i].state.vel = Physics.vector(0, 0);
                        bodies[i].update();

                        if(  bodies[i].state.pos.x > 850) {
                           // var a = bodies[i].state.vel.clone();
                          // bodies[i].pin(bodies[i].state.pos.x +50,bodies[i].state.pos.y);
                           // bodies[i].state.vel = Physics.vector(0, 0);

                        }
                        else{
                          //  bodies[i].pin(bodies[i].state.pos.x ,bodies[i].state.pos.y);
                        }
                    }
                }
            }
        };
    });
}