//?position.y gives you the top point of the element
//? position.x gives you the leftest point of the element e.g if it has width you have to 
//? add the width to get to the right point
//? navigationwise coordinates get larger while going to the bottom and right of the canvas


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x:615,
        y:127
    },
    imageSrc: './img/shop.png',
    scale : 2.75,
    framesMax : 6
})

const player = new Fighter({
    position:{
    x:0, 
    y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    }
})

const enemy = new Fighter({
    position:{
    x:974, 
    y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:-50,
        y:0
    },
    color: 'blue'
})

const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    }
  }

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate) //?way of recursion
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }
    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    } 


    //detect for collision
    if( rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    })&& player.isAttacking
        ){
        player.isAttacking = false  
        enemy.health -=20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        //i guess that works to shut the 100ms that our sword 
        //is out for working as a continuous attack
    }
    if( rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    })&& enemy.isAttacking
        ){
        enemy.isAttacking = false  
        player.health -=20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    //end game if health becomes 0
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
    /* immobilizes the players and "stops" their attacks
    if(timer === 0 || player.health === 0 || enemy.health === 0){
        player.position.x = 0
        enemy.position.x = 974
        player.position.y = 426
        enemy.position.y = 426
        player.attackBox.width = 0
        enemy.attackBox.width = 0
    }*/
}

animate();

window.addEventListener('keydown' , (e) =>{
    switch(e.key){
        //player keys
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
        break

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a'
        break

        case 'w':
            player.velocity.y = -20;
        break

        case 's':
            player.attack()
        break

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break

        case 'ArrowUp':
            enemy.velocity.y = -20;
        break
        case 'ArrowDown':
            enemy.attack()
        break
    }
})

window.addEventListener('keyup' , (e) =>{
    switch(e.key){
        case 'd':
            keys.d.pressed = false;
        break
        case 'a':
            keys.a.pressed = false;
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break
    }
})