class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}}){
        this.position = position
        this.width = 50;
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw(){
        c.drawImage(
                    this.image,
                /*from here to there its the image crop the division is being made by the 
                amount of frames our image has (the background "is not affected" because 
                we are technically not changing anything since we work with variables 
                e.g framesMax)*/  
                    this.framesCurrent * (this.image.width / this.framesMax),
                    0,
                    this.image.width / this.framesMax,
                    this.image.height,
                /**/  
                    this.position.x - this.offset.x,
                    this.position.y - this.offset.y, 
                    (this.image.width / this.framesMax) * this.scale, 
                    this.image.height * this.scale
                )
    }

    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent< this.framesMax - 1){
            this.framesCurrent++
            }
            else{
            this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()   
    }
}
class Fighter extends Sprite{
    constructor({position, 
        velocity, 
        color='red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x:0, y:0},
        sprites
    })
    {   super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
        //?you can either leave that here and put the values in the parent constructor the 
        //? same way as framesMax or just pass the static values below
        // framesCurrent,
        // framesElapsed, 
        // framesHold,
    })
        this.velocity = velocity
        this.width = 50;
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset : offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0 //? here
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
          }
        }

    //*rectangle type fighters
    // draw(){
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height)
    
    //     //attack box
    //     if(this.isAttacking){
    //     c.fillStyle = 'green';
    //     c.fillRect(this.attackBox.position.x, this.attackBox.position.y, 
    //         this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update(){
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        //gravity function/ gravity is initially added to make the players fall completely down
        //also makes the fall time smoother
        if(this.position.y + this.height + this.velocity.y >= (canvas.height -96)){
            //rly difficult explanation for this line's functionality(expl 2.55video)
            this.velocity.y = 0;
            this.position.y = 330 //this is added to make the fall animation work properly
        }else{
        this.velocity.y +=gravity;
        }
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }

    switchSprite(sprite){
        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax 
                this.framesCurrent = 0
            }
                break
            case 'run':
                if(this.image !== this.sprites.run.image){
                this.image = this.sprites.run.image
                this.framesMax = this.sprites.run.framesMax
                this.framesCurrent = 0
            }
                break
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                this.image = this.sprites.jump.image
                this.framesMax = this.sprites.jump.framesMax
                this.framesCurrent = 0
            }
                break    
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                this.image = this.sprites.fall.image
                this.framesMax = this.sprites.fall.framesMax
                this.framesCurrent = 0
            }
                break                 
        }
    }
}