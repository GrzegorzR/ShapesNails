function addPinableBodyType(Physics) {
    console.log("chuja");
    Physics.body('pinablebody', 'rectangle', function (parent) {
        return {
            pinned: true,
            edgeMass: null,
            rs: null,
            // r1 : Physics.vector(0, 0),
            //  r2 : Physics.vector(0, 0),  //distances from edges to point of rotation
            MI: null,
            MF: null,
            nail: null,
            nail1: null,
            nail2: null,
            init: function (options) {
                parent.init.call(this, options);
                this.edgeMass = 0.5;
                this.rs = new Array(Physics.vector(0, 0), Physics.vector(0, 0));
            },
            update: function () {
                if (this.pinned) {
                    this.state.vel = new Physics.vector(0, 0);
                    this.state.acc = new Physics.vector(0, 0);
                    this.calaculateRs();
                    this.calcualteClosingVelPoint();
                    this.calculateMomentumOfForce();
                    this.updateAngularAcc();
                }
                else {
                    this.calaculateRs();
                    //this.calculateMomentumOfForce();
                    //this.updateAngularAcc();
                    this.state.angular.vel = this.state.angular.vel * 0.995;
                }
            },
            pin: function (x, y) {
                this.pinned = true;
                this.setOffSet(x, y, 2);
                this.calaculateRs();
                this.calculateDistancesR();
                this.calculateMomentumOfInertia();
            },
            unpin: function () {
                this.pinned = false;
                this.setOffSet(this.state.pos.x, this.state.pos.y, 1);
                // this.state.old.pos = this.state.pos.clone();
                var oldPos = this.nailr2.state.old.pos;
                var newPos = this.nailr2.state.pos;
                this.state.vel = Physics.vector((oldPos.x - newPos.x), (oldPos.y - newPos.y));
                //this.state.vel = Physics.vector(0.3,-0.3);
                this.state.angular.vel = this.state.angular.vel * 0.995;
                //this.state.acc = Physics.vector(0, 0);
            },
            setOffSet: function (x, y, k) {
                var old = this.aabb();
                this.offset = Physics.vector(this.state.pos.x - x, this.state.pos.y - y);
                var vec = Physics.vector((old.x - this.aabb().x) / k, (old.y - this.aabb().y) / k);
                // console.log(vec.toString());
                // vec = vec.rotate(this.state.angular.pos);
                // console.log(vec.toString());
                this.state.pos = this.state.pos.add(vec.x, vec.y);
            },
            calculateDistancesR: function () {
            },
            calaculateRs: function () {
                var r1x = ((-this.width / 2) * Math.cos(this.state.angular.pos)) + this.aabb().x;
                var r2x = ((this.width / 2) * Math.cos(this.state.angular.pos)) + this.aabb().x;
                var r1y = ((-this.width / 2) * Math.sin(this.state.angular.pos)) + this.aabb().y;
                var r2y = ((this.width / 2) * Math.sin(this.state.angular.pos)) + this.aabb().y;
                this.rs[0] = Physics.vector(r1x, r1y); // TODO zmienic tutaj na wektor od srodka obrotu do konca obiektu
                this.rs[1] = Physics.vector(r2x, r2y);
                this.nail.state.pos = this.state.pos.clone();
                this.nailr1.state.pos = this.rs[0];
                this.nailr2.state.pos = this.rs[1];
            },
            calculateMomentumOfInertia: function () {
                var dist1 = Math.sqrt(Math.pow((this.state.pos.x - this.rs[0].x), 2) + Math.pow((this.state.pos.y - this.rs[0].y), 2));
                var dist2 = Math.sqrt(Math.pow((this.state.pos.x - this.rs[1].x), 2) + Math.pow((this.state.pos.y - this.rs[1].y), 2));
                // TODO tutaj po zmianie w clalulate Rs, spore ulatwienia z pomoca funkcji disSqr
                this.MI = (this.edgeMass * (dist1 * dist1 + dist2 * dist2));
            },
            calculateMomentumOfForce: function () {
                var gravity = -9.8;
                var rVec1 = Physics.vector(this.rs[0].x - this.state.pos.x, this.rs[0].y - this.state.pos.y);
                var rVec2 = Physics.vector(this.rs[1].x - this.state.pos.x, this.rs[1].y - this.state.pos.y);
                var r1F = rVec1.cross(Physics.vector(0, gravity));
                var r2F = rVec2.cross(Physics.vector(0, gravity));
                this.MF = r1F + r2F;
                //console.log(r1F);
                //console.log(r2F);
            },
            updateAngularAcc: function () {
                // console.log(this.MF / this.MI);
                this.state.angular.acc = this.state.angular.acc + (this.MF / this.MI) * 0.0001;
                if (this.state.angular.vel * 0.995 != 0) {
                    this.state.angular.vel = this.state.angular.vel * 0.995;
                }
            }
        };
    });
}
//# sourceMappingURL=PinableBody.js.map