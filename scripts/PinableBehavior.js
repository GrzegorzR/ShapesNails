function addPinableBehaviorType(Physics) {
    Physics.behavior('pinable-behavior', function (parent) {
        return {
            init: function (options) {
                parent.init.call(this);
                this.options(options);
            },
            // extended
            behave: function (data) {
                var bodies = this.getTargets();
                for (var i = 0, l = bodies.length; i < l; ++i) {
                    if (bodies[i].name === "pinablebody") {
                        // bodies[i].state.vel = Physics.vector(0, 0);
                        bodies[i].update();
                        if (bodies[i].state.pos.x > 850) {
                        }
                        else {
                        }
                    }
                }
            }
        };
    });
}
//# sourceMappingURL=PinableBehavior.js.map