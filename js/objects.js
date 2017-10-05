//create player object, update grid according to this

/*
 This work is submitted as part of the assessment for Year 9 IST.
 This is all my own work. I have referenced any work used from other
 sources and have not plagiarised the work of others.
 (signed) Jack Carey
 */

var player = {
	x: 0,//position of the player in pixels (unit coord)
	y: 0,
	direction: Math.PI/2,//which way player is facing (radians)
	movement: 0,//moving forward or backwards: -1 for backwards, 0 for still, 1
	//for forwards and 2 for sprinting
	rotation: 0,//-1 for left, 1 for right
	moveSpeed: 0.1,//how fast player moves per cycle
	rotationSpeed: 0.065,//how fast player rotates per cycle
	strafe: 0,//1 for true
	fov: 60,//field of vision of player in degrees);
	sprintRatio: 2.5,
	weaponType: 1,
	weapons: [
		false,
		false
	],
	lastWeapon: 1,
	score: 0,
	health: 50,
	ammo: 8
};




//object to store all of the slice heights and types etc
var sliceData = {};

//Game object for all game methods
var Game = {};

//this is mostly just minimap stuff

Game.findStart = function(level){
	for(var row = 0; row < levels[level].length; row++){
		for(var col = 0; col < levels[level][row].length; col++){
			var point = levels[level][row][col];
			switch(point){
				case 'n':
					player.direction = Math.PI/2;
					return [row, col];
					break;
				case 's':
					player.direction = 3*Math.PI/2;
					return [row, col];
					break;
				case 'e':
					player.direction = 0.0001;
					return [row, col];
					break;
				case 'w':
					player.direction = Math.PI;
					return [row, col];
					break;
				default:
					break;
			}
		}
	}
};


var visibleSprites = [];
var previousSprites = [];

Game.weaponSwitch = function(){
	var weapWidth = 4096*(weaponSize/256);

	weapon.style.width = weaponSize + "px";
	weapon.style.height = weaponSize + "px";
	weapon.style.backgroundPosition = -(weapWidth/4 * player.weaponType) + "px 0px";
	weapon.style.backgroundSize = weapWidth + "px " + weaponSize + "px";
};

Game.loadLevel = function(levelNum){
	map = levels[levelNum];

	mapWidth = map[0].length;
	mapHeight = map.length;

	rectCollider.size *= scale;


	player.x = Game.findStart(levelNum)[1]*scale + scale/2;
	player.y = Game.findStart(levelNum)[0]*scale + scale/2;

	//make sure that speed is relative to scale
	player.moveSpeed *= scale;


	//randomise stone walls, and create spriteMap
	for(var i = 0; i < mapHeight; i++){
		for(var j = 0; j < mapWidth; j++){
			if(map[i][j] == 1){
				if(Math.random() >= 0.5){
					map[i][j] = 99;
				}
			}
			if(map[i][j] == 9){
				if(Math.random() >= 0.5){
					map[i][j] = 98;
				}
			}

			if(!Number.isInteger(map[i][j]) && map[i][j] != 'n' && map[i][j] != 's' && map[i][j] != 'e' && map[i][j] != 'w'){
				var sprite = {};
				sprite.div = document.createElement("div");
				sprite.div.style.display = "none";
				sprite.div.style.position = "absolute";
				sprite.div.id = "sprite";
				sprite.div.style["image-rendering"] = "pixelated";
				sprite.visible = false;
				sprite.isGuard = false;
				sprite.isDog = false;
				sprite.blocking = false;
				sprite.collectable = false;


				switch(map[i][j]){
					case 'G':
						sprite.isGuard = true;
						sprite.type = 1;
						sprite.health = 100;
						break;
					case 'D':
						sprite.isDog = true;
						sprite.type = 17;
						break;
					case 'L':
						sprite.type = 15;
						break;
					case 'B':
						sprite.isGuard = true;
						sprite.type = 46;
						break;
					case 'A':
						sprite.type = 27;
						sprite.collectable = true;
						break;
					case 'F':
						sprite.type = 25;
						sprite.collectable = true;
						break;
					case 'PB':
						sprite.type = 20;
						break;
					case 'LS':
						sprite.type = 10;
						break;
					case 'BP':
						sprite.type = 12;
						sprite.blocking = true;
						break;
					case 'C':
						sprite.type = 5;
						break;
					case 'T':
						sprite.type = 14;
						sprite.blocking = true;
						break;
					case 'W':
						sprite.type = 37;
						sprite.blocking = true;
						break;
					case 'BA':
						sprite.type = 36;
						sprite.blocking = true;
						break;
					case 'WA':
						sprite.type = 1;
						break;
					case 'P':
						sprite.type = 24;
						break;
					case 'DF':
						sprite.type = 7;
						sprite.collectable = true;
						break;
					case 'K':
						sprite.type = 17;
						sprite.blocking = true;
						break;
					case 'MG':
						sprite.type = 28;
						sprite.collectable = true;
						break;
					case 'H':
						sprite.type = 26;
						sprite.collectable = true;
						break;
					case 'TC':
						sprite.type = 3;
						sprite.blocking = true;
						break;
					case 'V':
						sprite.type = 13;
						sprite.blocking = true;
						break;
					case 'JC':
						sprite.type = 30;
						sprite.collectable = true;
						break;
					case 'GG':
						sprite.type = 31;
						sprite.collectable = true;
						break;
					case 'X':
						sprite.type = 4;
						sprite.blocking = true;
						break;
					case 'RF':
						sprite.type = 40;
						sprite.blocking = true;
						break;
					case 'TR':
						sprite.type = 9;
						sprite.blocking = true;
						break;
					case 'TB':
						sprite.type = 32;
						sprite.collectable = true;
						break;
					case 'GB':
						sprite.type = 2;
						sprite.blocking = true;
						break;
					case 'EL':
						sprite.type = 34;
						sprite.collectable = true;


				}

				if(sprite.isGuard){
					sprite.div.style.backgroundImage = 'url("textures/guard.png")';
				} else if(sprite.isDog){
					sprite.div.style.backgroundImage = 'url("textures/dog.png")';
				} else {
					sprite.div.style.backgroundImage = 'url("textures/sprites.png")';
				}

				if(sprite.blocking){
					map[i][j] = 77;
				} else {
					map[i][j] = 0;
				}


				if(sprite.collectable){
					map[i][j] = 88;
				} else if(!sprite.blocking){
					map[i][j] = 0;
				}

				sprite.x = (j + 0.5) * scale;
				sprite.y = (i + 0.5) * scale;

				spriteMap[i].push(sprite);
				viewport.div.appendChild(sprite.div);

			} else {
				spriteMap[i].push(0);
			}
		}

		if(i != mapHeight - 1){
			spriteMap.push([]);
		}

	}

	//set name, score, health, and ammo
	document.getElementById("name").innerHTML = "NAME:<br/><br/><span id='large'>" + player.name + "</span>";
	document.getElementById("scoreCont").innerHTML = "SCORE:<br/><br/><span id='score'>" + player.score + "</span>";
	document.getElementById("healthCont").innerHTML = "HEALTH:<br/><br/><span id='health'>" + player.health + "</span>";
	document.getElementById("ammoCont").innerHTML = "AMMO:<br/><br/><span id='ammo'>" + player.ammo + "</span>";

	scoreSpan = document.getElementById("score");
	healthSpan = document.getElementById("health");
	ammoSpan = document.getElementById("ammo");

	//play music
	background.loop = true;
	background.volume = 0.7;
	background.play();

	//assign keyboard event listeners
	window.addEventListener("keydown", function(event){Game.keyInput.keyDown(event);}, false);
	window.addEventListener("keyup", function(event){Game.keyInput.keyUp(event);}, false);
};

Game.clearView = function(drawer){
	drawer.clearRect(0, 0, drawer.canvas.width, drawer.canvas.height);
};


/*
//unneeded
Game.updateMiniMap = function(){
	//Draw the player here
	drawCtx.beginPath();
	drawCtx.arc(player.x, player.y, scale/4, 0, 2*Math.PI);
	drawCtx.closePath();
	drawCtx.fillStyle = 'green';
	drawCtx.fill();

	drawCtx.beginPath();
	drawCtx.moveTo(player.x, player.y);
	drawCtx.lineTo(player.x + Math.cos(player.direction) * 10, player.y - Math.sin(player.direction) * 10);
	drawCtx.stroke()

};
*/
//main view functions

Game.initView = function(){
	viewport.div = document.getElementById("viewport");

	//help from http://permadi.com/1996/05/ray-casting-tutorial-5/
	viewport.dimensions = [viewport.div.clientWidth, viewport.div.clientHeight];
	viewport.center = [viewport.dimensions[0]/2, viewport.dimensions[1]/2];
	viewport.distToPlayer = viewport.center[0] / Math.tan((player.fov*(Math.PI/180))/2);
	viewport.angleBetRays = (player.fov*(Math.PI/180))/viewport.dimensions[0];//in rad
	numSlices = viewport.dimensions[0]/sliceSize;

	for(var i = 0; i < numSlices; i++) {
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.left = i*sliceSize + (viewport.div.offsetWidth - viewport.dimensions[0])/2 + "px";
		div.style.width = sliceSize+"px";
		div.style.top = viewport.dimensions[1]/2 - 32 + "px";
		//div.style.height = scale + "px"; //scale, slow
		div.style.height = "0px"; //faster
		div.style.overflow = "hidden";
		div.style.backgroundColor = "blue";
		div.style["image-rendering"] = "pixelated";

		if (i == 0){
			div.className += "FIRST"
		}

		sliceData["slice" + i];

		allSlices.push(div);
		viewport.div.appendChild(div);
	}

	Game.weaponSwitch();

	//start timer
	startTime = (new Date).getTime();

};

//sprite help from https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-2/ (note that I only used this
//resource for sprite help, nothing else, and I mostly used my own trigonometery, using the article's as a reference)

Game.spriteRenderer = function(){
	for(var i = 0; i < visibleSprites.length; i++){
		var sprite = visibleSprites[i];

		//positions relative to player
		var dx = player.x  - sprite.x;
		var dy = sprite.y  - player.y;
		var angle = (Math.atan2(dy, dx) - player.direction) + Math.PI;


		var spriteDist = Math.sqrt(Math.pow(player.x - sprite.x, 2) + Math.pow(player.y - sprite.y, 2));
		var correctDist = spriteDist * Math.cos(angle);
		var spriteHeight = (scale / correctDist * viewport.distToPlayer);

		console.log(correctDist)

		sprite.div.style.display = "block";
		sprite.div.style.height = spriteHeight + "px";
		sprite.div.style.width = spriteHeight + "px";

		sprite.div.style.zIndex = -Math.floor(correctDist*1000);

		sprite.div.style.left = (viewport.dimensions[0]/2 - spriteHeight/2 - Math.tan(angle) * viewport.distToPlayer) + "px";
		sprite.div.style.top = (viewport.dimensions[1]/2 - spriteHeight/2) + "px";

		sprite.div.style.backgroundPosition = -((sprite.type - 1) * spriteHeight) + "px 0px";

		if(sprite.isGuard){
			sprite.div.style.backgroundSize = (spriteHeight * guardWidth)/128 + "px " + spriteHeight + "px";
		} else if(sprite.isDog){
			sprite.div.style.backgroundSize = (spriteHeight * dogWidth)/128 + "px " + spriteHeight + "px";
		} else {
			sprite.div.style.backgroundSize = (spriteHeight * spriteWidth)/128 + "px " + spriteHeight + "px";
		}


	}

	for(var i = 0; i < previousSprites.length; i++){
		var old = previousSprites[i];
		if(visibleSprites.indexOf(old) < 0){
			old.visible = false;
			old.div.style.display = "none";
		}
	}
};

Game.clearSprites = function(){
	previousSprites = [];
	for(var i = 0; i < visibleSprites.length; i++){
		var temp = visibleSprites[i];
		previousSprites.push(temp);
		temp.visible = false;
	}
	visibleSprites = [];
};

Game.finish = function(isSecret){
	if(isSecret){
		player.score *= 10;
	}
	var endGame = document.getElementById("endGame1");
	var endGame2 = document.getElementById("endGame2");
	var endGame3 = document.getElementById("endGame3");
	endGame.style.display = "block";
	endGame2.style.display = "block";
	endGame3.style.display = "block";

	gameInProgress = false;
	background.pause();
	background.currentTime = 0;
	finished.play();
	setTimeout(function(){
		urahero.loop = true;
		urahero.volume = 0.7;
		urahero.play();
	}, 700)

	if(isSecret){
		endGame.innerHTML = "SCORE: " + player.score + "<br/><span id='recordText'>BONUS x10</span><br/>HIGH SCORE: ";
	} else {
		endGame.innerHTML = "SCORE: " + player.score + "<br/><br/>HIGH SCORE: ";
	}

	if(localStorage.getItem("recordScore" + player.name) != null){
		if(localStorage.getItem("recordScore" + player.name) < player.score){
			if(player.score.toString().length > 4){
				endGame.innerHTML += player.score + "<br/><span id='recordText'>NEW HIGH SCORE!!</span><br/><br/>";
			} else{
				endGame.innerHTML += player.score + "<br/><br/><span id='recordText'>NEW HIGH SCORE!!</span><br/><br/>";
			}
			localStorage.setItem("recordScore" + player.name, player.score);
		} else{
			endGame.innerHTML += localStorage.getItem("recordScore");
		}
	} else {
		if(player.score.toString().length > 4){
			endGame.innerHTML += player.score + "<br/><span id='recordText'>NEW HIGH SCORE!!</span><br/><br/>";
		} else{
			endGame.innerHTML += player.score + "<br/><br/><span id='recordText'>NEW HIGH SCORE!!</span><br/><br/>";
		}
		localStorage.setItem("recordScore" + player.name, player.score);
	}

	//milliseconds to minutes/seconds code from http://stackoverflow.com/a/21294619
	var levelTime = (new Date).getTime() - startTime;
	var minutes = Math.floor(levelTime / 60000);
  var seconds = ((levelTime % 60000) / 1000).toFixed(0);
  var formatted = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;


	endGame2.innerHTML = "TIME: " + formatted + "<br/><br/>BEST TIME: ";
	if(localStorage.getItem("recordTime" + player.name) != null){
		if(localStorage.getItem("recordTime" + player.name) > levelTime){
			endGame2.innerHTML += formatted + "<br/><br/><span id='recordText'>NEW BEST TIME!!</span><br/><br/>";
			localStorage.setItem("recordTime" + player.name, levelTime);
		} else {
			var recordMin = Math.floor(localStorage.getItem("recordTime" + player.name) / 60000);
			var recordSec = ((localStorage.getItem("recordTime" + player.name) % 60000) / 1000).toFixed(0);
			var recordFormat = recordMin + ":" + (recordSec < 10 ? '0' : '') + recordSec;

			endGame2.innerHTML += recordFormat;
		}
	} else {
		endGame2.innerHTML += formatted + "<br/><br/><span id='recordText'>NEW BEST TIME!!</span><br/><br/>";
		localStorage.setItem("recordTime" + player.name, levelTime);
	}

	endGame3.innerHTML = "Congratulations! You found the exit! Simply refresh this page to play again and to try and improve you score and time. They will be saved, don't worry! To improve you score, try and collect all the treasure: remember that there are a few secrets hidden around the map, as well as an easter egg! <!-- name of wolf3d protag -->"


};

//help from http://permadi.com/1996/05/ray-casting-tutorial-7/
Game.raycast = function(){

	var textureOffset;
	var startAngle = player.direction + ((player.fov/2)*(Math.PI/180));//in radians
	//simplify angle

	if(startAngle > 2*Math.PI){
		while(startAngle > 2*Math.PI){
			startAngle -= 2*Math.PI;
		}
	} else if (startAngle < 0){
		while(startAngle < 0){
			startAngle += 2*Math.PI;
		}
	}


	var currentAngle = startAngle

	var previousTexOff;
	for(var slice = 0; slice < numSlices; slice++){
		//cast ray here with currentAngle, get distance
		//first, find first horizontal intersection ***(A)***
		var ray = {};
		var hozWallType;
		var horizFoundWall = false;
		var toShade = false;
		var shortTex = false;
		var reverseTexture = false;
		var hozReverseTexture = false;

		ray.horizontal = {};
		ray.horizontal.firstPoint = {};
		if(currentAngle < Math.PI){
			//facing up
			ray.horizontal.firstPoint.y = Math.floor(player.y/scale) * scale;
			ray.horizontal.yA = -(scale);
			ray.horizontal.offset = -1;
			hozReverseTexture = true;

		} else {
			//facing down
			ray.horizontal.firstPoint.y = Math.floor(player.y/scale) * scale + scale
			ray.horizontal.yA = scale;
			ray.horizontal.offset = 1;
		}
		ray.horizontal.firstPoint.yGrid = Math.floor((ray.horizontal.firstPoint.y + ray.horizontal.offset)/ scale);

		ray.horizontal.firstPoint.x = player.x + (player.y - ray.horizontal.firstPoint.y)/Math.tan(currentAngle);
		ray.horizontal.firstPoint.xGrid = Math.floor(ray.horizontal.firstPoint.x/scale);

		ray.horizontal.xA = -(ray.horizontal.yA)/Math.tan(currentAngle);
		hozWallType = map[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid];


		if(spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid] != 0  && spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid] != undefined && !spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid].visible){
			/*
			//shooting stuff
			if(checkFireHit[0] && slice > (numSlices/2 - 50) && slice < (numSlices/2 + 50) && spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid].isGuard){
				Game.damage(spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid], numSlices/2 - slice, checkFireHit[1]);
			}
			*/
			spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid].visible = true;
			visibleSprites.push(spriteMap[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid]);
		}


		if((hozWallType != 0 && (Number.isInteger(hozWallType) || hozWallType == undefined)) && hozWallType != 77 && hozWallType != 88){
			if((hozWallType == 10 || hozWallType == 20) && Game.keyInput.spacePressed && slice == numSlices/2){
				if(hozWallType == 20){
					Game.finish(true);
				} else {
					Game.finish(false);
				}
			} else if((hozWallType == 41 || hozWallType == 71 || hozWallType == 91) && Game.keyInput.spacePressed && slice == numSlices/2){
				map[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid] = 0;
				secret.pause();
				secret.currentTime = 0;
				secret.play();
			} else if(hozWallType == 50 && Game.keyInput.spacePressed && slice == numSlices/2){
				map[ray.horizontal.firstPoint.yGrid][ray.horizontal.firstPoint.xGrid] = 0;
				doorOpen.pause();
				doorOpen.currentTime = 0;
				doorOpen.play();
			}

			//Found a wall on a horizontal intersection!
			horizFoundWall = true;
			ray.horizontal.xPoint = ray.horizontal.firstPoint.x;
			ray.horizontal.yPoint = ray.horizontal.firstPoint.y;
		} else {
			var previousPoint = {};
			previousPoint.x = ray.horizontal.firstPoint.x;
			previousPoint.y = ray.horizontal.firstPoint.y;
			while(horizFoundWall == false){
				var currentPoint = {};
				currentPoint.x = previousPoint.x + ray.horizontal.xA;
				currentPoint.y = previousPoint.y + ray.horizontal.yA;

				var yGridValue = Math.floor((currentPoint.y + ray.horizontal.offset)/scale);
				var xGridValue = Math.floor(currentPoint.x/scale);

				hozWallType = map[yGridValue][xGridValue];

				if(spriteMap[yGridValue][xGridValue] != 0 && spriteMap[yGridValue][xGridValue] != undefined && !spriteMap[yGridValue][xGridValue].visible){
					/*
					if(checkFireHit[0] && slice > (numSlices/2 - 50) && slice < (numSlices/2 + 50) && spriteMap[yGridValue][xGridValue].isGuard){
						Game.damage(spriteMap[yGridValue][xGridValue], numSlices/2 - slice, checkFireHit[1]);
					}
					*/
					spriteMap[yGridValue][xGridValue].visible = true;
					visibleSprites.push(spriteMap[yGridValue][xGridValue]);
				}

				if((hozWallType != 0 && (Number.isInteger(hozWallType) || hozWallType == undefined)) && hozWallType != 77 && hozWallType != 88){
					horizFoundWall = true;
					ray.horizontal.xPoint = currentPoint.x;
					ray.horizontal.yPoint = currentPoint.y;
				}
				previousPoint = currentPoint;
			}
		}



		//vertical checking V2
		var vertFoundWall = false;
		var vertWallType;
		var vertReverseTexture = false;
		ray.vertical = {};
		ray.vertical.firstPoint = {};

		//find first point
		//check whether it's facing left or right
		if((currentAngle > 0 && currentAngle < Math.PI/2) || (currentAngle < 2*Math.PI && currentAngle > 3*Math.PI/2)){
			ray.vertical.firstPoint.x = Math.floor(player.x/scale) * (scale) + scale;
			ray.vertical.xA = scale;
			ray.vertical.offset = 1;
			vertReverseTexture = true;
		} else {
			ray.vertical.firstPoint.x = Math.floor(player.x/scale) * (scale);
			ray.vertical.xA = -(scale);
			ray.vertical.offset = -1;
		}

		ray.vertical.firstPoint.xGrid = Math.floor((ray.vertical.firstPoint.x + ray.vertical.offset)/scale);

		ray.vertical.firstPoint.y = player.y + (player.x - ray.vertical.firstPoint.x) * Math.tan(currentAngle);
		ray.vertical.firstPoint.yGrid = Math.floor(ray.vertical.firstPoint.y/scale);

		ray.vertical.yA = -(ray.vertical.xA) * Math.tan(currentAngle);
		if(ray.vertical.firstPoint.yGrid >= mapHeight || ray.vertical.firstPoint.yGrid < 0){
			vertFoundWall = true;
			ray.vertical.distance = mapWidth * mapHeight * scale + 1;
		} else {
			vertWallType = map[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid];

			if(spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid] != 0 && spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid] != undefined && !spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid].visible){
				//shooting stuff
				/*
				if(checkFireHit[0] && slice > (numSlices/2 - 50) && slice < (numSlices/2 + 50) && spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid].isGuard){
					Game.damage(spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid], numSlices/2 - slice, checkFireHit[1]);
				}
				*/
				spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid].visible = true;
				visibleSprites.push(spriteMap[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid]);
			}

			if((vertWallType != 0 && (Number.isInteger(vertWallType) || vertWallType == undefined)) && vertWallType != 77 && vertWallType != 88){
				if((vertWallType == 10 || vertWallType == 20) && Game.keyInput.spacePressed == true && slice == numSlices/2){
					if(vertWallType == 20){
						Game.finish(true)
					} else {
						Game.finish(false);
					}
				} else if((vertWallType == 41 || vertWallType == 71 || vertWallType == 91) && Game.keyInput.spacePressed && slice == numSlices/2){
					map[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid] = 0;
					secret.pause();
					secret.currentTime = 0;
					secret.play();
				} else if(vertWallType == 50 && Game.keyInput.spacePressed && slice == numSlices/2){
					map[ray.vertical.firstPoint.yGrid][ray.vertical.firstPoint.xGrid] = 0;
					doorOpen.pause();
					doorOpen.currentTime = 0;
					doorOpen.play();
				}

				vertFoundWall = true;
				ray.vertical.xPoint = ray.vertical.firstPoint.x;
				ray.vertical.yPoint = ray.vertical.firstPoint.y;
			} else {
				var previousPoint = {};
				previousPoint.x = ray.vertical.firstPoint.x;
				previousPoint.y = ray.vertical.firstPoint.y;
				while(vertFoundWall == false){
					var currentPoint = {};
					currentPoint.x = previousPoint.x + ray.vertical.xA;
					currentPoint.y = previousPoint.y + ray.vertical.yA;
					if(currentPoint.y > mapHeight * scale || currentPoint.y < 0){
						vertFoundWall = true;
						ray.vertical.distance = mapWidth * mapHeight * scale + 1;
					} else {

						var yVertGridValue = Math.floor(currentPoint.y/scale);
						var xVertGridValue = Math.floor((currentPoint.x + ray.vertical.offset)/scale);

						vertWallType = map[yVertGridValue][xVertGridValue];

						if(spriteMap[yVertGridValue][xVertGridValue] != 0 && spriteMap[yVertGridValue][xVertGridValue] != undefined && !spriteMap[yVertGridValue][xVertGridValue].visible){
							/*
							if(checkFireHit[0] && slice > (numSlices/2 - 50) && slice < (numSlices/2 + 50) && spriteMap[yVertGridValue][xVertGridValue].isGuard){
								Game.damage(spriteMap[yVertGridValue][xVertGridValue], numSlices/2 - slice, checkFireHit[1]);
							}
							*/
							spriteMap[yVertGridValue][xVertGridValue].visible = true;
							visibleSprites.push(spriteMap[yVertGridValue][xVertGridValue]);
						}

						if((vertWallType != 0 && (Number.isInteger(vertWallType) || vertWallType == undefined)) && vertWallType != 77 && vertWallType != 88){
							vertFoundWall = true;
							ray.vertical.xPoint = currentPoint.x;
							ray.vertical.yPoint = currentPoint.y;
						}
					}
					previousPoint = currentPoint;
				}
			}
		}


		ray.horizontal.distance = Math.sqrt(Math.pow(player.x - ray.horizontal.xPoint, 2) + Math.pow(player.y - ray.horizontal.yPoint, 2));

		if(typeof ray.vertical.distance == "undefined"){
			ray.vertical.distance = -((player.x - ray.vertical.xPoint)/Math.cos(currentAngle));
		}

		var wallType;

		if(ray.horizontal.distance < ray.vertical.distance){
			ray.xPoint = ray.horizontal.xPoint;
			ray.yPoint = ray.horizontal.yPoint;
			ray.distance = ray.horizontal.distance;
			textureOffset = Math.floor(ray.xPoint % scale);
			wallType = hozWallType;
			reverseTexture = hozReverseTexture
		} else {
			ray.xPoint = ray.vertical.xPoint;
			ray.yPoint = ray.vertical.yPoint;
			ray.distance = ray.vertical.distance;
			textureOffset = Math.floor(ray.yPoint % scale);
			toShade = true;
			wallType = vertWallType;
			reverseTexture = vertReverseTexture;
		}



		//help from http://permadi.com/1996/05/ray-casting-tutorial-9/

		//correct the distance (to prevent fishbowl effect)

		ray.correctDist = ray.distance * Math.cos(player.direction - currentAngle);

		ray.sliceHeight = scale / ray.correctDist * viewport.distToPlayer;

		sliceData["slice" + slice] = {
			height: ray.sliceHeight,
			type: wallType,
			reverse: reverseTexture,
			shade: toShade,
			short: shortTex,
			offset: textureOffset,
			distance: ray.correctDist
		}



		/*
		//minimap
		drawCtx.strokeStyle = "rgba(0,100,0,0.3)";
		drawCtx.lineWidth = 0.5;
		drawCtx.beginPath();
		drawCtx.moveTo(player.x, player.y);
		drawCtx.lineTo(ray.xPoint, ray.yPoint);
		//drawCtx.lineTo(ray.horizontal.xPoint, ray.horizontal.yPoint)
		drawCtx.closePath();
		drawCtx.stroke();
		*/

		currentAngle -= (viewport.angleBetRays * sliceSize);
		if(currentAngle < 0){
			currentAngle += 2*Math.PI;
		}

		previousTexOff = textureOffset;



	}
	//checkFireHit[0] = false;

};
/*
Game.damage = function(sprite, sliceDiff, weaponType){
	sliceDiff = Math.abs(sliceDiff);
	var damage = 100/sliceDiff;
	console.log(damage);
	checkFireHit[0] = false;
	console.log(sprite);
};
*/
Game.updateView = function(){

	for(var slice = 0; slice < numSlices; slice++){

		//draw the rays here

		//scaling - slower
		//allSlices[slice].style.transform = "scaleY(" + ray.sliceHeight/scale + ")";

		//setting height - faster
		allSlices[slice].style.height = sliceData["slice" + slice].height + "px";
		allSlices[slice].style.top = viewport.dimensions[1]/2 - sliceData["slice" + slice].height/2 + "px";

		//setting z-index
		allSlices[slice].style.zIndex = -Math.floor(sliceData["slice" + slice].distance * 1000);


		switch (sliceData["slice" + slice].type){
			case 1:
				allSlices[slice].style.backgroundImage = "url('textures/stone1.png')";
				break;
			case 2:
				allSlices[slice].style.backgroundImage = "url('textures/flag1.png')";
				break;
			case 3:
				allSlices[slice].style.backgroundImage = "url('textures/wood.png')";
				break;
			case 4:
				allSlices[slice].style.backgroundImage = "url('textures/eagle.png')";
				break;
			case 5:
				allSlices[slice].style.backgroundImage = "url('textures/hitler2.png')";
				break;
			case 6:
				allSlices[slice].style.backgroundImage = "url('textures/eagle2.png')";
				break;
			case 7:
				allSlices[slice].style.backgroundImage = "url('textures/hitler1.png')";
				break;
			case 8:
				allSlices[slice].style.backgroundImage = "url('textures/hitler1.png')";
				break;
			case 9:
				allSlices[slice].style.backgroundImage = "url('textures/blue1.png')";
				break;
			case 10:
			case 20:
				allSlices[slice].style.backgroundImage = "url('textures/elevator.png')";
				sliceData["slice" + slice].shade = false;
				sliceData["slice" + slice].short = true;
				break;
			case 11:
				allSlices[slice].style.backgroundImage = "url('textures/handrails.png')";
				sliceData["slice" + slice].shade = false;
				sliceData["slice" + slice].short = true;
				break;
			case 12:
				allSlices[slice].style.backgroundImage = "url('textures/cell1.png')";
				break;
			case 13:
				allSlices[slice].style.backgroundImage = "url('textures/cell2.png')";
				break;

			//door
			case 50:
				allSlices[slice].style.backgroundImage = "url('textures/door.png')";
				break;
			//secrets
			case 41:
				allSlices[slice].style.backgroundImage = "url('textures/eagle.png')";
				break;
			case 71:
				allSlices[slice].style.backgroundImage = "url('textures/hitler1.png')";
				break;
			case 91:
				allSlices[slice].style.backgroundImage = "url('textures/stone1.png')";
				break;

			//randomizer
			case 99:
				allSlices[slice].style.backgroundImage = "url('textures/stone2.png')";
				break;
			case 98:
				allSlices[slice].style.backgroundImage = "url('textures/blue2.png')";
				break;
		}

		if(sliceData["slice" + slice].reverse){
			sliceData["slice" + slice].offset = scale - sliceData["slice" + slice].offset;
		}

		if(sliceData["slice" + slice].shade){
			allSlices[slice].style.backgroundPosition = Math.floor(sliceData["slice" + slice].offset * sliceSize) + "px "+ sliceData["slice" + slice].height + "px";
		} else {
			allSlices[slice].style.backgroundPosition = Math.floor(sliceData["slice" + slice].offset * sliceSize) + "px 0px";
		}

		if(sliceData["slice" + slice].short){
			allSlices[slice].style.backgroundSize = (scale * sliceSize) + "px " + (sliceData["slice" + slice].height) + "px";
		} else {
			allSlices[slice].style.backgroundSize = (scale * sliceSize) + "px " + (sliceData["slice" + slice].height * 2) + "px";
		}
	}
};

//object to check collisions
var rectCollider = {
	x: 0,//same as player
	y: 0,
	size: 0.75,//multiplied by scale to get w/h in loadLevel(). MUST BE LESS THAN 1
	//1 is topleft, 2 is topright, 3 is bottom right, 4 is bottom left (at least I think, damn idek anymore)
	cornerPos: function(corner){//get the position of each corner
		var half = this.size/2;
		var mapPos = [];
		var whichDiag = "";
		switch(corner){
			case 1:
				mapPos = [Math.floor(((this.y) - half)/scale), Math.floor(((this.x) - half)/scale)];
				//also see whether it's on the topright half or the botleft half of the square
				var localCoord = [(this.y - half) % scale, (this.x - half) % scale];
				if(map[mapPos[0]][mapPos[1]] != 0 && Number.isInteger(map[mapPos[0]][mapPos[1]])) whichDiag = localCoord[0] <= localCoord[1] ? "topRight" : "botLeft";
				break;
			case 2:
				mapPos = [Math.floor(((this.y) - half)/scale), Math.floor(((this.x) + half)/scale)];
				var localCoord = [(this.y - half) % scale, (this.x + half) % scale];
				if(map[mapPos[0]][mapPos[1]] != 0 && Number.isInteger(map[mapPos[0]][mapPos[1]])) whichDiag = localCoord[0] + localCoord[1] <= scale ? "topLeft" : "botRight";
				break;
			case 3:
				mapPos = [Math.floor(((this.y) + half)/scale), Math.floor(((this.x) + half)/scale)];
				var localCoord = [(this.y + half) % scale, (this.x + half) % scale];
				if(map[mapPos[0]][mapPos[1]] != 0 && Number.isInteger(map[mapPos[0]][mapPos[1]])) whichDiag = localCoord[0] <= localCoord[1] ? "topRight" : "botLeft";
				break;
			case 4:
				mapPos = [Math.floor(((this.y) + half)/scale), Math.floor(((this.x) - half)/scale)];
				var localCoord = [(this.y + half) % scale, (this.x - half) % scale];
				if(map[mapPos[0]][mapPos[1]] != 0 && Number.isInteger(map[mapPos[0]][mapPos[1]])) whichDiag = localCoord[0] + localCoord[1] <= scale ? "topLeft" : "botRight";
				break;
		}
		return(map[mapPos[0]][mapPos[1]] != 0 && Number.isInteger(map[mapPos[0]][mapPos[1]]) && map[mapPos[0]][mapPos[1]] != 88 ? [true, mapPos, spriteMap[mapPos[0]][mapPos[1]], whichDiag] : [false, mapPos, spriteMap[mapPos[0]][mapPos[1]]]);
	}
};

Game.resetWeaponSounds = function(){
	pistolShot.pause();
	pistolShot.currentTime = 0;
	machineShot.pause();
	machineShot.currentTime = 0;
	chainShot.pause();
	chainShot.currentTime = 0;
};

Game.fire = function(){
	//checkFireHit[1] = player.weaponType;
	if(Game.keyInput.firePressed || currentlyFiring){
		if(!currentlyFiring && (!outOfAmmo || player.weaponType == 0)){
			currentlyFiring = true;
			if(player.weaponType == 0 && outOfAmmo){
				knifeStab.pause();
				knifeStab.currentTime = 0;
			} else {
				Game.resetWeaponSounds();
			}

			Game.weaponAnim(0);
			fireCycles++;
		} else {
			if((player.weaponType == 1 && !outOfAmmo) || player.weaponType == 0){
				if (fireCycles == 6){
					Game.weaponAnim(0);
					if(player.weaponType == 1){
						pistolShot.play();
						//checkFireHit[0] = true;
						player.ammo -= 1;
					} else {
						knifeStab.play();
					}

				} else if(fireCycles == 12){
					Game.weaponAnim(0);
				} else if(fireCycles == 18){
					Game.weaponAnim(1);
				} else if(fireCycles == 24){
					currentlyFiring = false;
					if(player.ammo <= 0){
						outOfAmmo = true;
						player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
						player.weaponType = 0;
						Game.weaponSwitch();
					}
					fireCycles = 0
				}
				fireCycles++;
			} else if((player.weaponType == 2 && !outOfAmmo) || player.weaponType == 0){
				if(fireCycles == 6){
					Game.weaponAnim(0);
					machineShot.play();
					//checkFireHit[0] = true;
					player.ammo -= 1;
				} else if(fireCycles == 12){
					Game.weaponAnim(0);
				} else if(fireCycles == 18){
					if(Game.keyInput.firePressed){
						if(player.ammo <= 0){
							currentlyFiring = false;
							outOfAmmo = true;
							player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
							player.weaponType = 0;
							Game.weaponSwitch();
						} else {
							Game.resetWeaponSounds();
							Game.weaponAnim(2);
							machineShot.play();
							//checkFireHit[0] = true;
							player.ammo -= 1;
							fireCycles = 7;
						}
					} else {
						Game.weaponAnim(1);
					}
				} else if(fireCycles == 24){
					currentlyFiring = false;
					if(player.ammo <= 0){
						outOfAmmo = true;
						player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
						player.weaponType = 0;
						Game.weaponSwitch();
					}
					fireCycles = 0
				}

				fireCycles++
			} else if((player.weaponType == 3 && !outOfAmmo) || player.weaponType == 0){
				if(fireCycles == 8){
					Game.weaponAnim(0);
					chainShot.play();
					//checkFireHit[0] = true;
					player.ammo -= 1;
				} else if(fireCycles == 12){
					if(player.ammo <= 0){
						outOfAmmo = true;
						currentlyFiring = false;
						player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
						player.weaponType = 0;
						Game.weaponSwitch();
					} else {
						Game.resetWeaponSounds();
						Game.weaponAnim(0);
						//checkFireHit[0] = true;
						player.ammo -= 1;
						chainShot.play();
					}
				} else if(fireCycles == 16){
					if(Game.keyInput.firePressed){
						if(player.ammo <= 0){
							outOfAmmo = true;
							currentlyFiring = false;
							player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
							player.weaponType = 0;
							Game.weaponSwitch();
						} else {
							Game.resetWeaponSounds();
							Game.weaponAnim(2);
							chainShot.play();
							//checkFireHit[0] = true;
							player.ammo -= 1;
							fireCycles = 9;
						}
					} else {
						Game.weaponAnim(1);
					}
				} else if(fireCycles == 20){
					currentlyFiring = false;
					if(player.ammo <= 0){
						outOfAmmo = true;
						player.lastWeapon = player.weaponType != 0 ? player.weaponType : player.lastWeapon;
						player.weaponType = 0;
						Game.weaponSwitch();
					}
					fireCycles = 0
				}
				fireCycles++;

			}
		}
	}
};

Game.weaponAnim = function(type){
	if(type == 0){
		var weaponPos = weapon.style.backgroundPosition.split(" ");
		var xPos = parseInt(weaponPos[0].slice(0, -2));
		xPos -= weaponSize;
		weapon.style.backgroundPosition = xPos + "px 0px";
	} else if(type == 1){
		var weaponPos = weapon.style.backgroundPosition.split(" ");
		var xPos = parseInt(weaponPos[0].slice(0, -2));
		xPos += weaponSize*3;
		weapon.style.backgroundPosition = xPos + "px 0px";
	} else if(type == 2){
		var weaponPos = weapon.style.backgroundPosition.split(" ");
		var xPos = parseInt(weaponPos[0].slice(0, -2));
		xPos += weaponSize;
		weapon.style.backgroundPosition = xPos + "px 0px";
	}
}

Game.updateUI = function(){
	scoreSpan.textContent = player.score;
	healthSpan.textContent = player.health;
	ammoSpan.textContent = player.ammo;
};


//key input information and reference from
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
Game.keyInput = {
	up: 38,
	down: 40,
	right: 39,
	left: 37,
	x: 88,
	z: 90,
	shift: 16,
	one: 49,
	two: 50,
	three: 51,
	four: 52,
	space: 32,

	upPressed: false,
	downPressed: false,
	rightPressed: false,
	leftPressed: false,
	strafePressed: false,
	shiftPressed: false,
	firePressed: false,
	spacePressed: false,
	//keyData: { },

	keyDown: function(event){
		//this.keyData[event.keyCode] = true;

		if(event.repeat == false){
			//if it's not a repeat key
			switch(event.keyCode){
				case(this.up):
					this.upPressed = true;
					if(this.downPressed){
						player.movement = 0;
					} else{
						player.movement = 1;
					}
					break;
				case(this.down):
					this.downPressed = true;
					if(this.upPressed){
						player.movement = 0;
					} else{
						player.movement = -1;
					}
					break;
				case(this.right):
					this.rightPressed = true;
					if(this.leftPressed){
						player.rotation = 0;
					} else{
						player.rotation = -1;
					}
					break;
				case(this.left):
					this.leftPressed = true;
					if(this.rightPressed){
						player.rotation = 0;
					} else{
						player.rotation = 1;
					}
					break;
				case(this.z):
					this.strafePressed = true;
					player.strafe = 1;
					break;
				case(this.shift):
					this.shiftPressed = true;
					player.moveSpeed *= player.sprintRatio;
					break;
				case(this.x):
					this.firePressed = true;
					break;
				case(this.one):
					if(player.weaponType != 0 && !currentlyFiring){
						player.weaponType = 0;
						Game.weaponSwitch();
					}
					break;
				case(this.two):
					if(player.weaponType != 1 && !currentlyFiring && !outOfAmmo){
						player.weaponType = 1;
						Game.weaponSwitch();
					}
					break;
				case(this.three):
					if(player.weaponType != 2 && !currentlyFiring && player.weapons[0] && !outOfAmmo){
						player.weaponType = 2;
						Game.weaponSwitch();
					}
					break;
				case(this.four):
					if(player.weaponType != 3 && !currentlyFiring && player.weapons[1] && !outOfAmmo){
						player.weaponType = 3;
						Game.weaponSwitch();
					}
					break;
				case(this.space):
					this.spacePressed = true;
					break;
			}
		}

	},

	keyUp: function(event){
		//this.keyData[event.keyCode] = false;


		if(event.repeat == false){
			switch(event.keyCode){
				case(this.up):
					this.upPressed = false;
					if(this.downPressed){
						player.movement = -1;
					} else {
						player.movement = 0;
					}
					break;
				case(this.down):
					this.downPressed = false;
					if(this.upPressed){
						player.movement = 1;
					} else{
						player.movement = 0;
					}
					break;
				case(this.right):
					this.rightPressed = false;
					if(this.leftPressed){
						player.rotation = 1;
					} else{
						player.rotation = 0;
					}
					break;
				case(this.left):
					this.leftPressed = false;
					if(this.rightPressed){
						player.rotation = -1;
					} else{
						player.rotation = 0;
					}
					break;
				case(this.z):
					this.strafePressed = false;
					player.strafe = 0;
					break;
				case(this.shift):
					if(this.shiftPressed){
						this.shiftPressed = false;
						player.moveSpeed /= player.sprintRatio;

					}
					break;
				case(this.x):
					this.firePressed = false;
					break;
				case(this.space):
					this.spacePressed = false;
					break;
			}
		}

	}

};

var collectedSprite = false;

Game.spriteCollector = function(spriteObj, coords){
	if(!collectedSprite){
		if(spriteObj != 0){
			if(spriteObj.collectable){
				collectedSprite = true;
				switch(spriteObj.type){
					case 27:
						if(!currentlyFiring){
							//ammo
							spriteMap[coords[0]][coords[1]] = 0;
							if(!ammoUp.paused){
								ammoUp.pause();
								ammoUp.currentTime = 0;
							}
							ammoUp.play();
							player.ammo += 4;
							if(outOfAmmo){
								outOfAmmo = false;
								player.weaponType = player.lastWeapon;
								Game.weaponSwitch();
							}
						}

						break;

					case 30:
						//jesus
						spriteMap[coords[0]][coords[1]] = 0;
						if(!jesus.paused){
							jesus.pause();
							jesus.currentTime = 0;
						}
						jesus.play();
						player.score += 100;
						break;
					case 31:
						//goblet
						spriteMap[coords[0]][coords[1]] = 0;
						if(!goblet.paused){
							goblet.pause();
							goblet.currentTime = 0;
						}
						goblet.play();
						player.score += 500;
						break;
					case 32:
						//treasure
						spriteMap[coords[0]][coords[1]] = 0;
						if(!treasure.paused){
							treasure.pause();
							treasure.currentTime = 0;
						}
						treasure.play();
						player.score += 1000;
						break;

					case 25:
						//food
						collectedSprite = false;
						if(player.health != 100){
							collectedSprite = true;
							spriteMap[coords[0]][coords[1]] = 0;
							if(!food.paused){
								food.pause();
								food.currentTime = 0;
							}
							food.play();
							if(player.health > 90){

								player.health = 100;
							} else {
								player.health += 10;
							}
						}
						break;
					case 7:
						//dog food
						collectedSprite = false;
						if(player.health != 100){
							collectedSprite = true;
							spriteMap[coords[0]][coords[1]] = 0;
							if(!food.paused){
								food.pause();
								food.currentTime = 0;
							}
							food.play();
							if(player.health > 96){

								player.health = 100;
							} else {
								player.health += 4;
							}
						}
						break;
					case 26:
						//health pack
						collectedSprite = false;
						if(player.health != 100){
							collectedSprite = true;
							spriteMap[coords[0]][coords[1]] = 0;
							if(!medKit.paused){
								medKit.pause();
								medKit.currentTime = 0;
							}
							medKit.play();
							if(player.health > 75){

								player.health = 100;
							} else {
								player.health += 25;
							}
						}
						break;

					case 28:
						spriteMap[coords[0]][coords[1]] = 0;
						if(!machineGet.paused){
							machineGet.pause();
							machineGet.currentTime = 0;
						}
						machineGet.play();
						player.weapons[0] = true;
						if(!currentlyFiring){
							player.weaponType = 2;
							Game.weaponSwitch();
						}
						break;

					case 34:
						collectedSprite = false;
						if(player.health != 100){
							collectedSprite = true;
							spriteMap[coords[0]][coords[1]] = 0;
							if(!medKit.paused){
								medKit.pause();
								medKit.currentTime = 0;
							}
							medKit.play();
							player.health = 100;
						}
						break;
				}
			}
		}
	}

};

Game.playerMove = function(){
	//movement help from http://www.w3schools.com/games/game_movement.asp

	//varibles to cancel a certain axis's movement, as of collision.
	//0 for both, 1 for only forward allowed, -1 for only decreasing allowed
	var yAxis = 0;
	var xAxis = 0;

	//update the rectCollider
	rectCollider.x = player.x;
	rectCollider.y = player.y;


	var corner1 = rectCollider.cornerPos(1);
	var corner2 = rectCollider.cornerPos(2);
	var corner3 = rectCollider.cornerPos(3);
	var corner4 = rectCollider.cornerPos(4);
	collectedSprite = false;

	//sprite collection
	Game.spriteCollector(corner1[2], corner1[1]);
	Game.spriteCollector(corner2[2], corner2[1]);
	Game.spriteCollector(corner3[2], corner3[1]);
	Game.spriteCollector(corner4[2], corner4[1]);

	//collision
	if(corner1[0]){
		if(corner2[0]){
			yAxis = 1;
		} else if(corner1[3] == "topRight" && !corner4[0]){
			xAxis = 1;
		} else if(corner1[3] == "botLeft" && !corner4[0]){
			yAxis = 1;
		}
		if(corner4[0]){
			xAxis = 1;
		}
	}

	if(corner2[0]){
		if(corner3[0]){
			xAxis = -1;
		} else if(corner2[3] == "botRight" && !corner1[0]){
			yAxis = 1;
		} else if(corner2[3] == "topLeft" && !corner1[0]){
			xAxis = -1;
		}
		if(corner1[0]){
			yAxis = 1;
		}
	}

	if(corner3[0]){
		if(corner4[0]){
			yAxis = -1;
		} else if(corner3[3] == "botLeft" && !corner2[0]){
			xAxis = -1;
		} else if(corner3[3] == "topRight" && !corner2[0]){
			yAxis = -1;
		}
		if(corner2[0]){
			xAxis = -1;
		}
	}

	if(corner4[0]){
		if(corner1[0]){
			xAxis = 1;
		} else if(corner4[3] == "topLeft" && !corner3[0]){
			yAxis = -1;
		} else if(corner4[3] == "botRight" && !corner3[0]){
			xAxis = 1;
		}
		if(corner3[0]){
			yAxis = -1;
		}
	}

	//movement
	if(player.strafe == 0 || (player.strafe == 1 && player.rotation == 0)){
		//not strafing, do regular movement
		player.direction += player.rotation * player.rotationSpeed;
		var newX = player.x + player.moveSpeed * Math.cos(player.direction) * player.movement;
    var newY = player.y - player.moveSpeed * Math.sin(player.direction) * player.movement;
	}

	else if(player.strafe == 1 && player.rotation != 0 && player.movement != 0){
		//diagonal strafing
		var diagDir = 0
		if(player.rotation * player.movement == -1){
			diagDir = player.direction - Math.PI/4;
			var newX = player.x - player.moveSpeed * Math.cos(diagDir) * player.rotation;
			var newY = player.y + player.moveSpeed * Math.sin(diagDir) * player.rotation;
		} else {
			diagDir = player.direction + Math.PI/4;
			var newX = player.x + player.moveSpeed * Math.cos(diagDir) * player.rotation;
			var newY = player.y - player.moveSpeed * Math.sin(diagDir) * player.rotation;
		}
	}

	else{
		//just strafe
		var strafeDir = player.direction + Math.PI/2;
		var newX = player.x + player.moveSpeed * Math.cos(strafeDir) * player.rotation;
		var newY = player.y - player.moveSpeed * Math.sin(strafeDir) * player.rotation;
	}

	//actually update w/ collision detection
	if(xAxis == 1){
		//allow increasing
		if(newX > player.x){
			player.x = newX;
		}
	} else if(xAxis == -1){
		//allow decreasing
		if(newX < player.x){
			player.x = newX;
		}
	} else{
		player.x = newX;
	}
	if(yAxis == 1){
		if(newY > player.y){
			player.y = newY;
		}
	} else if(yAxis == -1){
		if(newY < player.y){
			player.y = newY;
		}
	} else {
		player.y = newY;
	}


};

Game.start = function(){
	player.name = prompt("Please enter your name");

	if(player.name == 'William "B.J." Blazkowicz'){
		//god mode enabled :P
		player.ammo = Infinity;
		player.moveSpeed *= 2;
		player.weapons[1] = true;
		player.weaponType = 3;
	} else if(player.name == null){
		player.name = "B.J.";
	}

	var splitted = player.name.split(" ");
	var nameResult = "";
	if(splitted.length >= 3){
		for(var i = 0; i < 2; i++){
			nameResult += splitted[i];
			if(i == 0){
				nameResult += " ";
			}
		}
		nameResult += "...";
		player.name = nameResult;
	}


	Game.initView();
	Game.loadLevel(1);

};
