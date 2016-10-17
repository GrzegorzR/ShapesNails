
function addPinableBodyType( Physics : any) {
    
    Physics.body('pinablebody', 'rectangle', function (parent) {

        return {

            pinned: true,
            edgeMass: null,
            rs : null,//distances from edges to point of rotation
            closingPointNum: null,
            closingPointNew: null,
            closingPointOld: null,
            MI: null,
            MF: null,
            nail : null,
            nail1 : null,
            nail2 : null,


            init: function (options) {
                parent.init.call(this, options);
                this.edgeMass =0.5;
                this.rs = new Array(Physics.vector(0, 0) ,Physics.vector(0, 0));
                this.closingPointOld = Physics.vector(0,0);
                this.closingPointNew = Physics.vector(0,0);

            },


            update: function () {
                if (this.pinned) {
                    this.state.vel = new Physics.vector(0, 0);
                    this.state.acc = new Physics.vector(0, 0);
                    this.calaculateRs();
                    //console.log(this.closingPoint);
                    this.calculateClosingVelPoint();
                    this.calculateMomentumOfForce();
                    this.updateAngularAcc();

                }
                else{
                    this.calaculateRs();
                    this.calculateMomentumOfForce();
                    this.updateAngularAcc();
                    this.state.angular.vel = this.state.angular.vel * 0.995;

                    // this.calaculateRs();
                }
            },


            pin :function( x, y){
                this.pinned = true;
                this.setOffSet(x,y, 2);

                this.calaculateRs();
                this.calculateMoreDistancedEdge();
                this.calculateMomentumOfInertia();


            },
            unpin : function(){
               this.pinned = false;
                this.setOffSet( this.state.pos.x ,  this.state.pos.y, 1 );
                this.calculateClosingVel();
            },

            calculateClosingVel : function(){

                //TODO implement
                var oldPos = this.closingPointOld.clone();
                var newPos = this.closingPointNew.clone();
                this.state.vel = Physics.vector((oldPos.x - newPos.x),(oldPos.y - newPos.y));
            },

            setOffSet: function(x, y, k){
                var old = this.aabb() ;
                this.offset = Physics.vector(this.state.pos.x -x,this.state.pos.y  -y);
                var vec = Physics.vector((old.x - this.aabb().x)/k, (old.y - this.aabb().y)/k);
                this.state.pos = this.state.pos.add(vec.x , vec.y);
            },
            calculateMoreDistancedEdge : function (){
                var dist1 = Math.sqrt(Math.pow(this.state.pos.x - this.rs[0].x ,2) + Math.pow(this.state.pos.y - this.rs[0].y,2));
                var dist2 = Math.sqrt(Math.pow(this.state.pos.x - this.rs[1].x ,2) + Math.pow(this.state.pos.y - this.rs[1].y,2));
                if(dist1 > dist2){
                    this.closingPointNum = 1;
                }
                else{
                    this.closingPointNum = 0;
                }
                this.calculateClosingVelPoint();
            },
            calaculateRs: function () {
                var r1x = ((-this.width/2) * Math.cos(this.state.angular.pos)) + this.aabb().x;
                var r2x = ((this.width/2) * Math.cos(this.state.angular.pos)) + this.aabb().x;
                var r1y = ((-this.width/2) * Math.sin(this.state.angular.pos)) + this.aabb().y;
                var r2y = ((this.width/2) * Math.sin(this.state.angular.pos)) + this.aabb().y;
                this.rs[0] = Physics.vector(r1x, r1y);// TODO zmienic tutaj na wektor od srodka obrotu do konca obiektu
                this.rs[1] = Physics.vector(r2x, r2y);
                //this.nail.state.pos = this.state.pos.clone();
                //this.nailr1.state.pos = this.rs[0];
               // this.nailr2.state.pos = this.rs[1];


            },
            calculateClosingVelPoint : function () {
              this.closingPointOld = this.closingPointNew.clone();
                this.closingPointNew = this.rs[this.closingPointNum].clone();
            },
            calculateMomentumOfInertia : function () {

                var dist1 = Math.sqrt(Math.pow((this.state.pos.x - this.rs[0].x),2) + Math.pow((this.state.pos.y - this.rs[0].y),2));
                var dist2 = Math.sqrt(Math.pow((this.state.pos.x - this.rs[1].x),2) + Math.pow((this.state.pos.y - this.rs[1].y),2));
                // TODO tutaj po zmianie w clalulate Rs, spore ulatwienia z pomoca funkcji disSqr


                this.MI = (this.edgeMass * (dist1*dist1 + dist2*dist2));

            },
            calculateMomentumOfForce : function () {
                var gravity = -100;
                var rVec1 = Physics.vector(this.rs[0].x - this.state.pos.x, this.rs[0].y - this.state.pos.y);
                var rVec2 = Physics.vector(this.rs[1].x - this.state.pos.x, this.rs[1].y - this.state.pos.y);
                var r1F =  rVec1.cross(Physics.vector(0, gravity));
                var r2F =  rVec2.cross(Physics.vector(0, gravity));
                this.MF = r1F + r2F;
            },
            updateAngularAcc : function () {
                this.state.angular.acc = this.state.angular.acc + (this.MF / this.MI)*0.0001;
                if(this.state.angular.vel*0.995 != 0) {
                    this.state.angular.vel = this.state.angular.vel * 0.995;
                }
            }
        };
    });
}

function addPinableBody(world, Physics, xpos, ypos, xpin, ypin) {
    var nail = Physics.body('circle', {x: 40, y: 30, radius: 2});
    var myWheel1 = Physics.body('circle', {x: 40, y: 30, radius: 2});
    var myWheel2 = Physics.body('circle', {x: 40, y: 30, radius: 2});

    var pinable = Physics.body('pinablebody', {x: xpos, y: ypos, width: 150, height: 20, mass: 0.5});



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