function body(positionX, positionY, component = {}){
    let hash = md5(`${idGen()} ${positionX} ${positionY} ${component.id ? component.id : ""}`);
    component = {
        id: hash,
        posX: positionX,
        posY: positionY,
        ...component,
    }

    bodyArray.push(component.id);
    return component;
}

function kinematic (velocityX, velocityY, terminalX, gravity, resistance, floorNormal, isOnFloor, isPlayer, component = {}) {
    let hash = md5(`${idGen()} ${velocityX} ${velocityY}, ${gravity}, ${isOnFloor} ${component.id ? component.id : ""}`);
    component = {
        id: hash,
        velX: velocityX,
        velY: velocityY,
        terminalX: terminalX,
        gravity: gravity,
        resistance: resistance,
        hasfriction: false,
        floorNormal: floorNormal,
        isOnFloor: isOnFloor,
        isPlayer: isPlayer,
        playerAcc: 3,
        playerJump: 5,
        ...component,
    }

    if (isPlayer) playerArray.push(component.id);

    kinematicArray.push(component.id);
    return component;
}

function collides (width, height, isColliding, friction, imovable, component = {}) {
    let hash = md5(`${idGen()} ${width} ${height} ${component.id ? component.id : ""}`);
    component =  {
        id: hash,
        width: width,
        height: height,
        isColliding: isColliding,
        friction: friction,
        imovable: imovable,
        ...component,
    }

    collisionArray.push(component.id);
    return component;
}

function player () {
    
}