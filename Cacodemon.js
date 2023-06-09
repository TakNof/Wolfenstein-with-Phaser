class Cacodemon{
    /**
     * The constructor for the Cacodemon class.
     * @param {Scene} scene The current scene of the game to place the sprite.
     * @param {{width: Number, height: Number}} canvasSize The size of the canvas.
     * @param {Number} amount The amount of enemies to place.
     * @param {[[Sprite]]} wallMatrix The matrix used to placer the walls.
     * @param {{x: Number, y: Number}} wallNumberRatio The ratio of walls that can be placed on the canvas.
     * @param {Number} wallBlockSize The size of the wall blocks
     * @param {Number} defaultVelocity The default velocity to set on the enemies.
     * @param {Number} chaseDistance The distance (in pixels) the enemies will be allowed to chase the player.
     * @param {Boolean} allowChase If the enemies will be allowed to chase the player. 
     */
    constructor(scene, canvasSize, amount, wallMatrix, wallNumberRatio, wallBlockSize, defaultVelocity, chaseDistance, allowChase){
        this.scene = scene;
        this.canvasSize = canvasSize;
        this.amount = amount;
        this.wallMatrix = wallMatrix;
        this.wallNumberRatio = wallNumberRatio;
        this.blockSize = wallBlockSize;
        this.defaultVelocity = defaultVelocity;
        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.enemies = new Array(this.amount);

        this.bulletProperties = {damage: 15, velocity: 200, delay: 3000, critical: 1.8};
        this.distanceLimits = {min: 250, max: 1000};
        
    }

    /**
     * Here we create all the enemies.
     * @param {boolean} value 
     */
    create(playerPosition, value){
        let enemiesPlaced = 0;
        let enemyPosition;

        let i;
        let j;
        while(enemiesPlaced < this.amount){
            enemyPosition = {x: 0, y: 0};
            i = this.getRndInteger(0, this.wallNumberRatio.y);
            j = this.getRndInteger(0, this.wallNumberRatio.x);

            if(!this.wallMatrix[i][j]){
                enemyPosition.x = (j*32 + 32);
                enemyPosition.y = (i*32 + 32);

                //Here we create an enemy.
                this.enemies[enemiesPlaced] =  new Enemy(this.scene, enemyPosition, "small_cacodemon", wallBlockSize*2, 1, this.defaultVelocity, chaseDistance, allowChase);
                
                //Here we set the particular enemy projetcile properties based on the properties of this class.
                this.enemies[enemiesPlaced].setBulletProperties = this.bulletProperties;
                this.enemies[enemiesPlaced].setDistanceLimits = this.distanceLimits;

                //We pass load the player position due we need the enemy to chase the player.
                this.enemies[enemiesPlaced].setAngleToPlayer = playerPosition;
                
                //Here we stablish the raycaster of the enemy, we pass it as well the matrix of walls.
                this.enemies[enemiesPlaced].setRaycaster(walls.getWallMatrix, 1, enemyangleOffset);
                this.enemies[enemiesPlaced].getRaycaster.setAngleStep();
                
                //Here we put the color of the rays of the enemy.
                this.enemies[enemiesPlaced].setDebug = value;
                this.enemies[enemiesPlaced].setSpriteRays(colors.black);

                this.enemies[enemiesPlaced].setMaxHealth = 200;

                //We create an sprite that will be the 3D representation of the enemy.
                this.enemies[enemiesPlaced].setEnemy3D(this.canvasSize, this.canvasSize.width/2, this.canvasSize.height*1.5, "cacodemon");

                //We set all the elements we need to collide with the walls.
                this.enemies[enemiesPlaced].setColliderElements();

                enemiesPlaced += 1;
            }
        }

        this.setColliders();
    }

     /**
     * Gets the enemies list.
     * @returns {Array<Enemy>}
     */
     get getEnemies(){
        return this.enemies;
    }

    /**
     * Allows all the enemies to move and chase the player.
     * @param {OBject} playerPosition 
     */
    move(playerPosition){
        for(let enemy of this.getEnemies){
            enemy.move(playerPosition);
        }
    }   

    /**
     * Allows all the enemies to shoot at the player.
     */
    shoot(player){
        for(let enemy of this.getEnemies){
            enemy.shoot(this.bulletProperties, this.getRndInteger(0, 9), player, this.canvasSize);
        }
    }

    /**
     * Gets the bullet properties of the cacodemons.
     * @returns {Object}
     */
    get getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Gets the minimum and maximum distance to deal damage concidering the distance to the object.
     */
    get getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Sets the colliders of the enemies.
     */
    setColliders(){
        for(let enemy1 of this.enemies){
            for(let enemy2 of this.enemies){
                this.scene.physics.add.collider(enemy1.getColliderElements, enemy2.getColliderElements);
            }
        }
    }

    /**
     * This method allows us to get a number between the specified range.
     * @param {number} min 
     * @param {number} max 
     * @returns {randomNumber}
     */
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}