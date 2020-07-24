// list all entities that have collision
let collisionArray = [];

// list all entities that are kinematic
let kinematicArray = [];

// list all entities that have bodies
let bodyArray = [];

// list all entities in the system
let entityArray = [];

// list all players in the system
let playerArray = [];


// create a seeded random number generator for ID generation
let idGen = createIDGenerator(Math.random());

// add a static body and kinematic body to the scene
// player
entityArray.push(kinematic(0, 0, 10, 2, .05, [0,1], false, true, body(390, 200, collides(50, 50, false, 0, false))));
// entityArray.push(kinematic( 55, 0, 10, 1, .05, [0, 1], false, false, body(100, 250, collides(50, 50, false, 0, false))));
// random block
entityArray.push(kinematic( 0, 0, 10, 1, 0, [0, 1],false, false, body(250, 50, collides(100, 50, false, .8, false))));
entityArray.push(kinematic( 0, 0, 10, 1, 0, [0, 1],false, false, body(250, 150, collides(100, 50, false, .8, false))));
entityArray.push(kinematic( 0, 0, 10, 1, 0, [0, 1],false, false, body(250, 250, collides(100, 50, false, .8, false))));
entityArray.push(kinematic( 0, 0, 10, 1, 0, [0, 1],false, false, body(250, 350, collides(100, 50, false, .8, false))));

// floor
entityArray.push(body(500, 450, collides(500, 50, false, .8, true)));
entityArray.push(body(500, 250, collides(50, 350, false, .8, true)));


// runs collision physics for all entities that can collide 
function collisionSystem () {

    // used to gather all the collide entities in one array (cache efficiency)
    let cache = [];

    // gathers all entities with the collision component
    for (let entity of entityArray) {

        for(let colliding of collisionArray){
            
            if (entity.id == colliding) {
                cache[cache.length] = entity;
                
            }
        }
        
    }

    // Loop through all entities
    for(let collider = 0; collider < cache.length; collider++) {
        
        cache[collider].isColliding = false;
        cache[collider].isOnFloor = false;
        
        if (cache[collider].isOnFloor !== undefined) cache[collider].isOnFloor = false;
        for (let collidee = 0; collidee < cache.length; collidee++) {

            // stores teh collider (the one that is provoked the collision) 
            // and collidee
            let _collider = cache[collider];
            let _collidee = cache[collidee];

            // renders the hitbox of the entity
            push();
            stroke(0, 0, 255);
            fill(0, 0, 255, 25);
            rect(_collider.posX, _collider.posY, _collider.width, _collider.height);
            pop();

            // makes sure that entities don't collide with themselves

            if(_collider.id != _collidee.id){
                
                // Checks for collision between collider and collidee
                if (_collider.posX + (_collider.width / 2) >= _collidee.posX - (_collidee.width / 2) && _collider.posX - (_collider.width / 2) <= _collidee.posX + (_collidee.width / 2)
                && _collider.posY + (_collider.height / 2) >= _collidee.posY - (_collidee.height / 2) && _collider.posY - (_collider.height / 2) <= _collidee.posY + (_collidee.height / 2)) {
     
                    _collider.isColliding = true;
                    
                    if (!_collider.imovable) {

                        
                        // calculate distance vectors for collision
                        let vectorX = _collider.posX - _collidee.posX;
                        let vectorY = _collider.posY - _collidee.posY;

                        // Alter vector based off of side lengths
                        if (_collidee.height > _collidee.width) {
                            vectorX = vectorX / (_collidee.width / _collidee.height)

                        } else {
                            vectorY = vectorY / (_collidee.height / _collidee.width)

                        }

                        // Test which vector is bigger
                        if (vectorY * vectorY > vectorX * vectorX) {

                            // Is the Y pointing down
                            if (vectorY > 0) {
                                _collider.posY = _collidee.posY + ((_collidee.height / 2) + (_collider.height / 2));
                                if (_collider.isOnFloor != undefined) _collider.isOnFloor =  _collider.floorNormal[1] === -1 || _collider.isOnFloor;

                            } else {
                                _collider.posY = _collidee.posY - ((_collidee.height / 2) + (_collider.height / 2));
                                if (_collider.isOnFloor != undefined) _collider.isOnFloor = _collider.floorNormal[1] === 1 || _collider.isOnFloor;

                            }

                        } else {
                            // Apply momentum given that they are kinematic bodies
                            if (_collider.velX != undefined && _collidee.velX != undefined) {
                                _collidee.velX += (_collider.velX / 2)
                            
                            }

                            // Is the X pointing right
                            if (vectorX > 0) {
                                _collider.posX = _collidee.posX + ((_collidee.width / 2) + (_collider.width / 2));
                                if (_collider.isOnFloor != undefined) _collider.isOnFloor = _collider.floorNormal[0] === 1 || _collider.isOnFloor;

                            } else {
                                _collider.posX = _collidee.posX - ((_collidee.width / 2) + (_collider.width / 2));
                                if (_collider.isOnFloor != undefined) _collider.isOnFloor = _collider.floorNormal[0] === -1 || _collider.isOnFloor;

                            }
                        }
                    }
                }
                
            }
            
            // if the entity is on "ground" stop accelerating downward
            if (_collider.isOnFloor) _collider.resistance = _collidee.friction;
        }
    }
    
}

// runs kinematic physics
function kinematicSystem () {
    let cache = [];

    for (let entity of entityArray) {

        for(let kinematic of kinematicArray){

            if (entity.id == kinematic) {
                cache[cache.length] = entity;

            }
        }
        
    }

    for(let entity of cache) {
        
        entity.velY += entity.gravity;
        entity.hasfriction = false;
        
        if (entity.isPlayer) {
            // Is the D key pressed?
            if (keyIsDown(68)){
                entity.velX += entity.playerAcc;

            // Is the A key pressed?
            } else if (keyIsDown(65)){
                entity.velX += -entity.playerAcc;

            // Is the no key pressed?
            } else {
                entity.hasfriction = true;
            
            }
            
            // is the W key pressed and is on floor
            if (entity.isOnFloor){
                if (keyIsDown(87)) entity.velY = -20;
                if (entity.hasfriction) entity.velX = lerp(entity.velX, 0, entity.resistance);
            
            } else {
                if (entity.hasfriction) entity.velX = lerp(entity.velX, 0, .05);
            
            }
        } else {
            if (entity.isOnFloor) {
                entity.velX = lerp(entity.velX, 0, entity.resistance);
            
            } else {
                entity.velX = lerp(entity.velX, 0, .05);
            
            }
        }

        if (entity.velX > entity.terminalX) entity.velX = entity.terminalX;
        if (entity.velX < -entity.terminalX) entity.velX = -entity.terminalX;

        if (entity.posX) entity.posX += entity.velX;
        if (entity.posY) entity.posY += entity.velY;
        
        if (entity.isOnFloor && entity.velY > 0) entity.velY = 0;

    }
}

// Sudo system that manages player camera
function playerCameraSystem () {
    let cache = [];

    for (let entity of entityArray) {

        for(let player of playerArray){

            if (entity.id == player) {
                cache[cache.length] = entity;

            }
        }
        
    }

    let avgX = 0;
    let avgY = 0;

    for(let entity of cache) {
        avgX += entity.posX;
        avgY += entity.posY;
    }

    avgX = avgX / cache.length
    avgY = avgY / cache.length

    camera.zoom = lerp(camera.zoom, 1, .30);

    camera.position.x = lerp(camera.position.x, avgX, .20);

    camera.position.y = lerp(camera.position.y, avgY, .20);

}


// TO-DO will be used to assemble cahces for all systems
function assembleCache () {

}

function staticRenderSystem() {

}

// creates a seeded random number generator
function createIDGenerator (seed) {
    return () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
}