var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sun,sunImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;
var collideSound, jumpSound;

var score=0;
var gameOver, restart;
var touches =[];

localStorage = ["HighestScore"];
localStorage[0] = 0;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  sunImg = loadImage("sun.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle4 = loadImage("obstacle4.png");
      
  gameOverImg = loadImage("gameOver.png");
  
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.wav");
  collideSound = loadSound("collided.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-width/5,height/6,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.09;
  
  ground = createSprite(width/2,height-15,width,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  trex = createSprite(75,height-90,15,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.scale = height/450;
  trex.setCollider("rectangle",0,-5,65,60);
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/10,height-32,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(170,206,251);
  textSize(16);
  fill("black");
  text("Score: "+ score, width-120, height/15);
  text("High Score: "+ localStorage[0], 30, height/15);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("space")) && trex.y >= (height-height/6)) {
      trex.velocityY = -15;
      jumpSound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.95;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      collideSound.play();
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.lenghth > 0) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(width,height/3,40,10);
    cloud.y = Math.round(random(2*height/3 -30,height/10));
    cloud.addImage(cloudImage);
    cloud.scale = random(height/1000,4*height/1000);
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = restart.depth;
    restart.depth = restart.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  var fCount;
  if(score < 250) {
    fCount = 80;
  }
  if(score >= 250) {
    fCount = 60;
  }
  if(frameCount % fCount === 0) {
    var obstacle = createSprite(width-50,height-50,10,40);
     obstacle.velocityX = -(6 + 3*score/100);
    
     //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.8;
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle4);
              obstacle.scale = 0.75;
              break; 
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  touches = [];
  score = 0;
  
}
