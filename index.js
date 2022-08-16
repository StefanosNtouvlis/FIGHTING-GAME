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
    },
    imageSrc: 'img/Martial Hero/Sprites/Idle.png',
    framesMax : 8,
    scale : 2.5,
    offset:{
        x:215,
        y:157
    },
    sprites:{
        idle:{
            imageSrc: 'img/Martial Hero/Sprites/Idle.png',
            framesMax : 8
        },
        run:{
            imageSrc: 'img/Martial Hero/Sprites/Run.png',
            framesMax : 8,
        },
        jump:{
            imageSrc: 'img/Martial Hero/Sprites/Jump.png',
            framesMax : 2,
        },
        fall:{
            imageSrc: 'img/Martial Hero/Sprites/Fall.png',
            framesMax : 2,
        },
        attack1:{
            imageSrc: 'img/Martial Hero/Sprites/Attack1.png',
            framesMax : 6,
        },
        takeHit:{
            imageSrc: 'img/Martial Hero/Sprites/Take hit - white silhouette.png',
            framesMax : 4,
          },
          death:{
              imageSrc: 'img/Martial Hero/Sprites/Death.png',
              framesMax : 6,
            }
    },
    attackBox: {
        offset: {
          x: 100,
          y: 50
        },
        width: 160,
        height: 50
      }
})

const enemy = new Fighter({
    position:{
    x:974, //974 
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
    imageSrc: 'img/Martial Hero 2/Sprites/Idle.png',
    framesMax : 4,
    scale : 2.5,
    offset:{
        x:215,
        y:167
    },
    sprites:{
        idle:{
            imageSrc: 'img/Martial Hero 2/Sprites/Idle.png',
            framesMax : 4
        },
        run:{
            imageSrc: 'img/Martial Hero 2/Sprites/Run.png',
            framesMax : 8,
        },
        jump:{
            imageSrc: 'img/Martial Hero 2/Sprites/Jump.png',
            framesMax : 2,
        },
        fall:{
            imageSrc: 'img/Martial Hero 2/Sprites/Fall.png',
            framesMax : 2,
        },
        attack1:{
            imageSrc: 'img/Martial Hero 2/Sprites/Attack1.png',
            framesMax : 4,
        },
        takeHit:{
            imageSrc: 'img/Martial Hero 2/Sprites/Take hit.png',
            framesMax : 3,
          },
          death:{
              imageSrc: 'img/Martial Hero 2/Sprites/Death.png',
              framesMax : 7,
            }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
          }
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
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{player.switchSprite('idle')}
    
    //jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0)
        player.switchSprite('fall')

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else{enemy.switchSprite('idle')}

    //jumping enemy
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0)
        enemy.switchSprite('fall')


    //detect for collision where enemy is hit
    if( rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    })&& player.isAttacking && player.framesCurrent === 4        
    //i guess that works to shut the 100ms that our "sword" 
    //is out for working as a continuous attack
        ){
        enemy.takeHit()    
        player.isAttacking = false  
        gsap.to('#enemyHealth', {
            width:enemy.health + '%'
        })
    }

    //if player misses attack
    if(player.isAttacking && player.framesCurrent === 4)
        player.isAttacking = false

     //detect for collision where player is hit   
    if( rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    })&& enemy.isAttacking  && enemy.framesCurrent === 2
        ){
        player.takeHit()    
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width:player.health + '%'
        })    }

        //if enemy misses attack
        if(enemy.isAttacking && enemy.framesCurrent ===2)
        enemy.isAttacking = false


    //end game if health becomes 0
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        if(timer===0)
        return
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 'w':
          player.velocity.y = -20
          break
        case 's':
          player.attack()
          break
      }
    }
  
    if (!enemy.dead) {
        if(timer===0)
        return
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          enemy.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          enemy.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          enemy.velocity.y = -20
          break
        case 'ArrowDown':
          enemy.attack()
  
          break
      }
    }
  })
  
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
    }
  
    // enemy keys
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
  })