$(document).ready(function(){

	// Welcome to the CyberSlug Evolutionary Dynamics Model Code - 6/21/2017
	// This runs best in a FireFox browser which supports HTML 5
	// Run data will be saved as a Local Storage Object
	// This code performs competition between Sexual Recombiners and Asexual Recombiners
	//
	// All the source code can be found in this file. Said code is not pretty
	// This project initially served the purpose of adapting the NetLogo CyberSlug model into a webpage format and to teach me how to code
	// As the project became more serious, many implementations were made to optimize its running speed but legacy code remained
	//
	// Please email paulcbogdan@gmail.com for questions regarding parts of the code

	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var turn = 0;
	var hermiNumber = 3;
	var smellDistance = 3.8;

	var cw = 10;
	var d;

	
	var textCanvas = document.createElement('canvas');
	var textCtx = textCanvas.getContext('2d');
	
	textCanvas.width = 2500;
	textCanvas.height = 2500;
	textCtx.fillStyle = 'blue';
	textCtx.font = '30px Arial';
	textCtx.textBaseline = 'top';
	
	function draw() {
		//ctx.clearRect(0,0,w,h);
		ctx.drawImage(textCanvas, 0, 0);
	}
	
	var pleuroImage = new Image();
	var bluePleuroImage = new Image();
	var greenPleuroImage = new Image();
	var greenThing1 = new Image();
	var greenThing2 = new Image();
	var pieImage = new Image();
	var mineImage = new Image();
	var robotBody = new Image();
	var robotLeg = new Image();
	var robotLaser = new Image();
	var laser = new Image();
	var goldSlug = new Image();
	var eggImage = new Image();
	var orangeEggs = new Image();
	var fontSize = 3;
	
	var speedFactor = 3; //move faster, get hungry faster, attack harder, turn faster
	
	var pleuroSize = 5;
	var pleuroSpeed = 7 * speedFactor;
	var flabSize = 3.5;
	var hermiSize = 3.5;
	
	var rightDown = 0;
	var leftDown = 0;
	 
	var clanA = 4;
	var clanB = 2;

	//Anything you see related to clan == 3 is unused
	
	var pleuros = [];
	var eggs = [];
	
	var robotYN = 0;
	var goldSlugYN = 0;
	
	var mutationChance = 25;
	var mutationIntensity = 5;
	var mutationSkew = .5;
	var energeticCost = 0;
	var boxSize = 1000;
	var selectionNess = 5;
	var monogamy = 0;
	var population = 40;
	
	var localNameAsex = "";
	var localNameSex = "";
	var localMale = "";
	
	var maleCount = 0;
	var totalSize = 0;
	
	var myPanel = new panel();

	function makePleuros() {
        for (var i = 0; i < population; i++) {
			/*if (i > 19) {
			 v = clanA;
			 } else { v = clanB;}*/
            var thePleuro = new pleuro(Math.random() * (w - 200) + 100, Math.random() * (h - 200) + 100, .1, .5, clanA, 0);
            var theClone = $.extend(true, {}, thePleuro);
            ;
            theClone.clan = clanB;
            theClone.xpos = Math.random() * (w - 200) + 100;
            theClone.ypos = Math.random() * (h - 200) + 100;
            pleuros.push(thePleuro);
            pleuros.push(theClone);

        }
    }

	
	for (var i = 0; i < pleuros.length; i++){
		for (var j = 0; j < pleuros.length; j++){
			pleuros[j].habituations[i] = 0;
		}
	}
	
		
	var hermis = [];
	for (var i = 0; i < 25; i++) {
		var theHermi = new hermi(Math.random() * (w - 400) + 200, Math.random() * (h - 400) + 200);
		hermis.push(theHermi);
	} 
	
	var flabs = [];
	for (var i = 0; i < 55; i++) {
		var theFlab = new flab(Math.random() * (w - 300) + 200, Math.random() * (h - 300) + 200);
		flabs.push(theFlab);
	} 
	
	
	document.addEventListener('keydown', function(event) {
   		if(event.keyCode == 37) {
    		leftDown = 1;
   		} 
		if(event.keyCode == 39) {
         	rightDown = 1;
    	} 
	});
	
	document.addEventListener('keyup', function(event) {
   		if(event.keyCode == 37) {
    		leftDown = 0;
   		} 
		if(event.keyCode == 39) {
         	rightDown = 0;
    	} 
	});
	
	var elem = document.getElementById("canvas"),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];


	elem.addEventListener('click', function(event) {http://jsfiddle.net/BmeKr/#
		var x = event.pageX - elemLeft,
			y = event.pageY - elemTop;
			
			for (var i = 0; i < pleuros.length; i++) {
	
				if (y > pleuros[i] && x > 100) {
					alert('clicked an element');
				}
			}
	
	
	}, false);




	function everyoneEat(ctx2)
	{
		for (var k = 0; k < pleuros.length; k++) {
			
			//ctx2.strokeRect(pleuros[k].xpos, pleuros[k].ypos, 50, 50);
			var pleuroBox = new hitbox(pleuros[k].xpos,pleuros[k].ypos,30 * 0.047 * pleuros[k].size,20* 0.047 * pleuros[k].size,20 * 0.047 * pleuros[k].size,40 * 0.047 * pleuros[k].size,pleuros[k].dir);
			for (var z = 0; z < hermis.length; z++) {
				if (Math.abs(pleuros[k].xpos - hermis[z].xpos) < 45 && Math.abs(pleuros[k].ypos - hermis[z].ypos) < 45){
					if (pleuroBox.pointOverLapping(hermis[z].xpos, hermis[z].ypos, 15)){ 
						hermis[z].eaten();
						pleuros[k].eat("hermi");
					}
				}	
			}
			for (var z = 0; z < flabs.length; z++) {
				if (Math.abs(pleuros[k].xpos - flabs[z].xpos) < 45 && Math.abs(pleuros[k].ypos - flabs[z].ypos) < 45){
					//var pleuroBox = new hitbox(pleuros[k].xpos,pleuros[k].ypos,30 * 0.047 * pleuros[k].size,20* 0.047 * pleuros[k].size,20 * 0.047 * pleuros[k].size,40 * 0.047 * pleuros[k].size,pleuros[k].dir);
					if (pleuroBox.pointOverLapping(flabs[z].xpos, flabs[z].ypos, 25)){  
						flabs[z].eaten();
						pleuros[k].eat("flab");
					}
				
				}	
			}
			for (var z = 0; z < eggs.length; z++) {
				ctx2.strokeRect(eggs[z].xpos - 500, eggs[z].ypos - 500, 1000,1000);
				if (Math.abs(pleuros[k].xpos - eggs[z].xpos) < 555 && Math.abs(pleuros[k].ypos - eggs[z].ypos) < 555){
					if (pleuroBox.pointOverLapping(eggs[z].xpos, eggs[z].ypos, 555)){   //change this number to modify the cost of sexual reproduction
						if (pleuros[k].clan == 3 && pleuros[k].gender == 1 && pleuros[k].clan == eggs[z].clan) {
							ctx.beginPath();
							ctx.moveTo(pleuros[k].xpos,pleuros[k].ypos);
							ctx.lineTo(eggs[z].xpos,eggs[z].ypos);
							ctx.stroke();
							eggs[z].fertilize(pleuros[k], 0); //TTTHIIIS

						} else if (pleuros[k].clan == 2 && pleuros[k].clan == eggs[z].clan && pleuros[k] != eggs[z].parentReference) {
							eggs[z].fertilize(pleuros[k], 0);
							//pleuros[k].size = pleuros[k].size - .5;
						}
					}
				}	
			}
			var attackBox = new hitbox(pleuros[k].xpos,pleuros[k].ypos,30 * 0.047 * pleuros[k].size,20* 0.047 * pleuros[k].size,20 * 0.047 * pleuros[k].size,40 * 0.047 * pleuros[k].size,pleuros[k].dir);		
			for (var b = 0; b < pleuros.length; b++) {
				if (k != b && pleuros[k].clan != pleuros[b].clan) {
					if (Math.abs(pleuros[k].xpos - pleuros[b].xpos) < 45 && Math.abs(pleuros[k].ypos - pleuros[b].ypos) < 45){
						//var attackBox = new hitbox(pleuros[k].xpos,pleuros[k].ypos,30 * 0.047 * pleuros[k].size,20* 0.047 * pleuros[k].size,20 * 0.047 * pleuros[k].size,40 * 0.047 * pleuros[k].size,pleuros[k].dir);
						var defendBox = new hitbox(pleuros[b].xpos,pleuros[b].ypos, -2.1 * pleuros[b].size, 1.7 * pleuros[b].size , 3.4 * pleuros[b].size, 3.4 * pleuros[b].size, pleuros[b].dir);
						if (defendBox.isOverlapping(attackBox, ctx2)) {  
							pleuros[k].attack(ctx2);
							pleuros[b].attackedFunc(ctx2, pleuros[k]);
							var randX = 30 * 0.047 * pleuros[k].size + Math.random() * 20;
							var randY = -20 * 0.047 * pleuros[k].size + Math.random() * 10;
							var xLoc = pleuros[k].xpos + randX * Math.cos(pleuros[k].dir) - randY * Math.sin(pleuros[k].dir);
							var yLoc = pleuros[k].ypos + randY * Math.cos(pleuros[k].dir) + randX * Math.sin(pleuros[k].dir);
							ctx2.strokeRect(xLoc - 5, yLoc - 5 , Math.random() * 10, Math.random() * 10);
						}
					}
				}
			}
		}
	}
				
	function hitbox(originX,originY,xpos,ypos,w,h,dir) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.width = w;
		this.height = h;
		this.dir = dir;
		this.originX = originX;
		this.originY = originY;
		this.isOverlapping = function (otherBox, ctx) {
			for (var i = 0; i < 3; i++){
				for (var j = 0; j < 3; j++){
					var newX = this.originX + (this.xpos + this.width * j / 2) * Math.cos(this.dir) + (this.ypos - this.height * i / 2) * Math.sin(this.dir);
					var newY = this.originY + (-this.ypos + this.height * i / 2) * Math.cos(this.dir) + (this.xpos + this.width * j / 2) * Math.sin(this.dir);
					for (var m = 0; m < 3; m++){
						for (var n  = 0; n < 3; n++){
							var newX2 = otherBox.originX + (otherBox.xpos + otherBox.width * m / 2) * Math.cos(otherBox.dir) + (otherBox.ypos - otherBox.height * n / 2) * Math.sin(otherBox.dir);
							var newY2 = otherBox.originY + (-otherBox.ypos + otherBox.height * n / 2) * Math.cos(otherBox.dir) + (otherBox.xpos + otherBox.width * m / 2) * Math.sin(otherBox.dir);
							
							if (Math.abs(newX - newX2) < 35 && Math.abs(newY - newY2) < 35){
								return true;
							}
						}
					}
				}
			}
			return false;
		}
		
		this.pointOverLapping = function (pointX, pointY, pointSize) {
			for (var i = 0; i < 5; i++){
				for (var j = 0; j < 5; j++){
					var newX = this.originX + (this.xpos + this.width * j / 4) * Math.cos(this.dir) + (this.ypos - this.height * i / 4) * Math.sin(this.dir);
					var newY = this.originY + (-this.ypos + this.height * i / 4) * Math.cos(this.dir) + (this.xpos + this.width * j / 4) * Math.sin(this.dir);
					
					if (Math.abs(newX - pointX) < pointSize && Math.abs(newY - pointY) < pointSize){
						return true;
					}
				}
			}
			return false;
		}
	}
							
	function init()
	{
		loadImages();
		establishVariables();
		makePleuros();
		
		myPanel.update(pleuros[0]);
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(move, 10);
		
			
	}
	init();
	
	function establishVariables() { 
		var parameters = location.search.substring(1).split("&");
		var temp = parameters[0].split("=");
		mutationChance = unescape(temp[1]);
		temp = parameters[1].split("=");
		mutationIntensity = unescape(temp[1]);
		temp = parameters[2].split("=");
		mutationSkew = unescape(temp[1]);
		temp = parameters[3].split("=");
		energeticCost = unescape(temp[1]);
		temp = parameters[4].split("=");
		boxSize = unescape(temp[1]);
		temp = parameters[5].split("=");
		selectionNess = unescape(temp[1]);
        temp = parameters[6].split("=");
        population = 40 * unescape(temp[1]);
		temp = parameters[7].split("=");
		monogamy = unescape(temp[1]);
		
		localNameAsex = "555RECOM" + mutationChance + "zo" + mutationIntensity + "ou" + mutationSkew  + "control" + energeticCost + boxSize + selectionNess + monogamy;
		localNameSex = "555SEXY2" + mutationChance + "zo" + mutationIntensity + "ou" + mutationSkew  + "control" + energeticCost + boxSize + selectionNess + monogamy;
		localMale = "boys" + mutationChance + mutationIntensity + mutationSkew + energeticCost + boxSize + selectionNess + monogamy;
		
		document.title = "MC: " + mutationChance + " MI: " + mutationIntensity + " Skew: " + mutationSkew + "MEME" + boxSize;
		
		if (localStorage.getItem(localNameAsex) == null) {
			localStorage.setItem(localNameAsex, 0);
		}
		if (localStorage.getItem(localNameSex) == null) {
			localStorage.setItem(localNameSex, 0);
		}
	}
	 
	function move() //create attack pocounwer and make killing a pleuro give size
	{
		//myPleuro.dir = myPleuro.dir + .01;
		for (var k = 0; k < pleuros.length; k++) {
			pleuros[k].index = k;
		}
		paint();
		ctx.strokeStyle="blue";
		everyoneEat(ctx);
		balance(ctx);
		//drawAverages();
		//myPanel.update(pleuros[22]);
		checkWin(ctx);
		draw();
		

		
	}

	function checkWin(ctx) {
		//localStorage.setItem("sexCount60five", 0);
		//localStorage.setItem("aSexCount60five", 0);
		ctx.font="30px Arial";
		
		
		var check1 = 0;
		var check2 = 0;
		
		for (var i4 = 0; i4 < pleuros.length; i4++) {
			var temp = pleuros[i4];
			if (pleuros[i4].xpos > 10 && pleuros[i4].ypos > 10 && pleuros[i4].size > 4) {
				if (temp.clan == clanA || temp.clan == "undefined") {
					check1++;} else { 
					check2++;}
			}
		}

		//Not True Extinction. Low population is enough
		if (check1 / check2 > 7 || check2 < 5) {
			localStorage.setItem(localNameSex, Number(localStorage.getItem(localNameSex)) + 1);

			var retrieve = localStorage.getItem(localMale);
			var parseArray = JSON.parse(retrieve);
			parseArray.push(getMaleAverage());
			var tempArray = JSON.stringify(parseArray);
			localStorage.setItem(localMale, tempArray);
			
			location.reload();
		}
		
		if (check2 / check1 > 7 || check1 < 5) {
            var retrieve = localStorage.getItem(localMale);
            var parseArray = JSON.parse(retrieve);
            parseArray.push(getMaleAverage());
            var tempArray = JSON.stringify(parseArray);
			localStorage.setItem(localNameAsex, Number(localStorage.getItem(localNameAsex)) + 1);
			location.reload();
		}
	}


	
	function getMaleAverage() { 
		return totalSize / (maleCount + 0.00001);
	}
		
		
		
		
		

	function drawAverages() {
		var count = 0;
		var alarmedAverage = 0;
		var clanAverage = 0;
		var preyAverage = 0;
		var preditorAverage = 0;
		var foodAverage = 0;
		
		for (var k = 0; k < pleuros.length; k++) {
			alarmedAverage += pleuros[k].alarmStrength;
			clanAverage += pleuros[k].clanStrength;
			preyAverage += pleuros[k].preyStrength;
			preditorAverage += pleuros[k].preditorStrength;
			foodAverage += pleuros[k].foodStrength;
			count ++;
		}
		ctx.fillStyle = "blue";
		ctx.fillText("Alarmed Average: " + alarmedAverage / count, 15, 15);
		ctx.fillText("Clan Average: " + clanAverage / count, 15, 25);
		ctx.fillText("Prey Average: " + preyAverage / count, 15, 35);
		ctx.fillText("Preditor Average: " + preditorAverage / count, 15, 45);
		ctx.fillText("Food Average: " + foodAverage / count, 15, 55);
	}
		
	function balance(ctx) { //create somethinig that tracks gene differences in asexual
		if (pleuros.length > population * 3) {
			var randoP = Math.floor(Math.random() * pleuros.length);
			pleuros[randoP].die();
			balance(ctx);
		}
		
	}
	
	function hermi(xpos, ypos)
	{
		this.xpos = xpos;
		this.ypos = ypos;
		
		this.paintHermi = function (ctx) {
			
			var modif = hermiSize / 7;
			ctx.translate(this.xpos, this.ypos);   //created using some website, NOTE WEBSITE NAME NEXT TIME
			
			ctx.drawImage(pieImage, hermiSize * -5, hermiSize * -4.5, hermiSize * 10, hermiSize * 9);
			ctx.translate(-this.xpos, -this.ypos);
		}
		
		this.eaten = function () {
			this.xpos = hermis[Math.floor(Math.random() * hermis.length)].xpos + Math.random() * 100 - 50;
			this.ypos = hermis[Math.floor(Math.random() * hermis.length)].ypos + Math.random() * 100 - 50;
			
			if (this.xpos < 400 || this.xpos > (w - 400) || this.ypos < 400 || this.ypos > (h - 400) || Math.random() < .2) {
				this.xpos = Math.random() * (w - 1000) + 500;
				this.ypos = Math.random() * (h - 1000) + 500;
			}
		}
			
	}
	
	
	
	function flab(xpos, ypos)
	{
		this.xpos = xpos;
		this.ypos = ypos;
		
		this.paintFlab = function (ctx) {
			
			ctx.translate(this.xpos, this.ypos);
			
			ctx.drawImage(mineImage,hermiSize * -5, hermiSize * -5, hermiSize * 10, hermiSize * 10);
			ctx.translate(-this.xpos, -this.ypos);
		}
		
		this.eaten = function () {
			this.xpos = Math.random() * (w - 1500) + 750;
			this.ypos = Math.random() * (h - 1500) + 750;
		}
	}
	

	function panel () {
		var tom = new pleuro(Math.random() * (w - 200) + 100, Math.random() * (h - 200) + 50, .1, .5,1,0);
		this.last = tom;
		
		this.update = function(pLueo) {
			this.last = pLueo;
			textCtx.clearRect(0,0,w,h);
			var thePleo = this.last;
			
			//var myFirstTwoNode = new levelTwoNode(this);
			
			//var theNode = new levelTwoNode(pleuros[0]);
			if (localStorage.getItem(localMale) == null) { 
				tom = [];
				tom[0] = "";
				var tempParse = JSON.stringify(tom);
				localStorage.setItem(localMale, tempParse);
			}

			var retrieve = localStorage.getItem(localMale);
			var movies2 = JSON.parse(retrieve);

			
			if (clanA == 2 && clanB == 3) {
				textCtx.fillText("Sexual Wins: " + localStorage.getItem("sexVSparthCount") + " Parth Wins: " + localStorage.getItem("parthVSsexCount") , 1250 , 100);
			} else if (clanA == 1 && clanB == 2) {
				textCtx.fillText("Sexual Wins: " + localStorage.getItem(localNameSex) + " Asexual Wins: " + localStorage.getItem(localNameAsex), 1250 , 100); 
			} else if (clanA == 4 && clanB == 2) {
				textCtx.fillText("Sexual Wins: " + localStorage.getItem(localNameSex) + " Recomb Wins: " + localStorage.getItem(localNameAsex), 1250 , 100); 
			}

			textCtx.fillText("Average Male Size This Run " + getMaleAverage(), 1250 , 200);
			
			var totalav = 0;
			var zeros = 0;
			for (var ja = 1; ja < movies2.length; ja++) {
				if (movies2[ja] < 50) { 
					totalav = totalav + movies2[ja];
					if (movies2[ja] == 0){zeros++;}
				}
			}
			
			
			var aver = totalav / (movies2.length - zeros - 1);
			
			var advanced;
			
			var advanced = (aver-5) / (energeticCost-5) * (8 - 5) + 5;//
			//var advanced = (aver-5) * (energeticCost-5) / (8 - 5) + 5;
			textCtx.fillText("Average Male: " + aver + "advanced aver" + advanced + " zeroes: " + zeros, 1250 , 160); 
			
			/*for (var j = 0; j < movies2.length; j++) {
				textCtx.fillText(movies2[j], 1250 , 230 + j * 30); 
			}*/
			
			var count1 = 0;
			var count2 = 0;
		
			for (var i4 = 0; i4 < pleuros.length; i4++) {
				var temp = pleuros[i4];
				if (pleuros[i4].xpos > 10 && pleuros[i4].ypos > 10) {
					if (temp.clan == 2 || temp.clan == "undefined") {
						count1++;} else { 
						count2++;}
				}
			}
			
			textCtx.fillText("Clan One remaining:" + count1 + " Clan Two remaining:" + count2 , 1250, 130);
			
			var theNodes = [];
			theNodes = thePleo.levelTwoNodes;
			
			var theNodes2 = [];
			theNodes2 = thePleo.levelTwoNodes2;
			
			var ee = 0;
			var uCount = 0;
			
			textCtx.fillText("Generation: " + this.last.generation, 5, 5);
			
			textCtx.fillText("Mutation Intensity: " + mutationIntensity + "     Mutation Chance: " + mutationChance, 225, 5);
			
			
			
			var sexOrAsex = "";
			if (this.last.clan == 1) {
					sexOrAsex = "Asexual"; 
				} else { 
					sexOrAsex = "Sexual";
				}
			
			textCtx.fillText("Attack Power 1: " + this.last.attackPower1 + " Max HP1: " + this.last.maxHP1 + " Offspring Count sum: " + (this.last.offspringCount1 + this.last.offspringCount2) + " Hunger Modifier sum: " + (this.last.hungerModifier1 + this.last.hungerModifier2) + " Clan: " + sexOrAsex ,15,15 * fontSize );
			for (var uu = 0; uu < theNodes.length; uu++) {
				var theText = "";
				
				if (theNodes[uu].levelOneNodes === undefined) {
					console.log(1);
					pLueo.levelTwoNodes[uu].levelOneNodes = [];
					var myLevelOne = new levelOneNode(pLueo);
					pLueo.levelTwoNodes[uu].levelOneNodes.push(myLevelOne);
					this.update(pLueo);
					return;
		
				}
				
				var theNodeyNodes = theNodes[uu].levelOneNodes;
				var theText = theNodes[uu].inputVariable + " str:" + theNodes[uu].inputStrength;
				var moreTex = "";
				
				var nn = 0;
				textCtx.fillText(theText, 15, fontSize * (25 + uu * 10 + ee));
				for (var kk = 0; kk < theNodeyNodes.length; kk++) {
					
					if (theNodeyNodes[kk].randoVar < 1) {
						moreText = "leastHab";
					} else if (theNodeyNodes[kk].randoVar < 2) {
						moreText = "hermi";
					} else if (theNodeyNodes[kk].randoVar < 3) {
						moreText = "pleuro";
					} else if (theNodeyNodes[kk].randoVar < 4) {
						moreText = "clan";
					} else if (theNodeyNodes[kk].randoVar < 5) {
						moreText = "alarm";
					} else if (theNodeyNodes[kk].randoVar < 6) {
						moreText = "HP";
					} else if (theNodeyNodes[kk].randoVar < 7) {
						moreText = "not attacked";
					} else if (theNodeyNodes[kk].randoVar < 8) {
						moreText = "nutrition";
					}
					
					if (theNodeyNodes[kk].greaterLess == 0) {
						moreText = moreText + " greater than";
					} else {moreText = moreText + " less than";}
								
					textCtx.fillText("     Rando Var: " + moreText + " " + theNodeyNodes[kk].threshold + " factorOne: " + theNodeyNodes[kk].factorOne + " plusNeg: " + theNodeyNodes[kk].plusNeg, 15, fontSize * (25 + uu * 10 + kk * 10 + 10 + ee));
					nn++;
				}
				
				ee = ee + nn * 10;
				uCount++;
			}
			
			ee = ee + uCount * 10;
			textCtx.fillText("Attack Power 2: " + this.last.attackPower2  + "Max HP2: " + this.last.maxHP2,15,fontSize * (ee + 35));
			for (var uu = 0; uu < theNodes2.length; uu++) {
				var theText = "";
				var theNodeyNodes = theNodes2[uu].levelOneNodes;
				theText = theNodes2[uu].inputVariable + " str:" + theNodes2[uu].inputStrength;
				var moreTex = "";
				
				var nn = 0;
				textCtx.fillText(theText + "555", 15, fontSize * (45 + uu * 10 + ee));
				for (var kk = 0; kk < theNodeyNodes.length; kk++) {
					
					if (theNodeyNodes[kk].randoVar < 1) {
						moreText = "leastHab";
					} else if (theNodeyNodes[kk].randoVar < 2) {
						moreText = "hermi";
					} else if (theNodeyNodes[kk].randoVar < 3) {
						moreText = "pleuro";
					} else if (theNodeyNodes[kk].randoVar < 4) {
						moreText = "clan";
					} else if (theNodeyNodes[kk].randoVar < 5) {
						moreText = "alarm";
					} else if (theNodeyNodes[kk].randoVar < 6) {
						moreText = "HP";
					} else if (theNodeyNodes[kk].randoVar < 7) {
						moreText = "not attacked";
					} else if (theNodeyNodes[kk].randoVar < 8) {
						moreText = "nutrition";
					}
					
					if (theNodeyNodes[kk].greaterLess == 0) {
						moreText = moreText + " greater than";
					} else {moreText = moreText + " less than";}
								
					textCtx.fillText("     Rando Var: " + moreText + " " + theNodeyNodes[kk].threshold + " factorOne: " + theNodeyNodes[kk].factorOne + " plusNeg: " + theNodeyNodes[kk].plusNeg, 15, fontSize * (45 + uu * 10 + kk * 10 + 10 + ee));
					nn++;
				}
				ee = ee + nn * 10;
			}		
		}
	}
	
	function neuron(strength, threshold) {
		this.strength = strength;
		this.threshold = threshold;
		
		this.processInput = function(nput) {
			if (nput > this.threshold) {
				return this.strength * nput;
			} else {
				return 0;
			}
		}
	}


	function deepCopy(obj) {
  		return JSON.parse(JSON.stringify(obj));
	}
	
	function egg(xpos, ypos, clanD, parent, reference) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.clan = clanD;
		this.parent = parent;
		this.counter = 0;
		this.parentReference = reference;
		
		this.STOP = 1;
		
		this.paintEgg = function (ctx) {
			ctx.translate(this.xpos, this.ypos);
			this.counter++;
			if (this.clan == clanA){
				ctx.drawImage(orangeEggs, -20, -20, 40,40);

			} else if (this.clan == clanB) {
				ctx.drawImage(eggImage, -20, -20, 40,40);

				ctx.fillStyle = "blue";
				ctx.fillText(this.parent.offspringCount1 + this.parent.offspringCount2, 25, 25);
				ctx.fillText(this.parent.flabCount, 55, 55);
			}
			
			
			if (this.counter == 1000 && this.clan == 3) {
				this.fertilize(this.parent, 1);
				//this.STOP = 0;
				var i7 = eggs.indexOf(this);
				eggs.splice(i7, 1);
			}
			ctx.translate(-this.xpos, -this.ypos);
		}
		
		this.fertilize = function (parentTwo, gender) {
			var i7 = eggs.indexOf(this);
			if (this.STOP == 1) {

				eggs.splice(i7, 1);

				var parent2 = parentTwo;
				
				var allSame = 0;
				var savePleuro = new pleuro(this.xpos, this.ypos , 0,0,this.clan, 0);
				
				var numbKids = 1 + Math.floor((this.parent.offspringCount1 + this.parent.offspringCount2 + parent2.offspringCount1 + parent2.offspringCount2) / 3 - this.parent.flabCount / 4);
				
				if (parentTwo.clan == 1) {   
				
					//var numbKids = Math.floor((this.parent.offspringCount1 + this.parent.offspringCount2) / 2 - this.parent.flabCount / 3);				
					for (var ku = 0; ku < numbKids; ku++) {
						
						var thePleuro = new pleuro(this.xpos + ku * 5 - 5, this.ypos + ku * 5 - 5, 2 * Math.PI / (ku + 1), .5,this.clan, 0);

						thePleuro.generation = this.parent.generation + 1;
						
						thePleuro.size = 5;
						var parent1 = this.parent;
						
						var anyMutate = Math.random() * 100;
						
						if (anyMutate < mutationChance) {
							var whichMutate = Math.random() * 100;
							thePleuro.levelTwoNodes = clone(parent1.levelTwoNodes);
							thePleuro.levelTwoNodes2 = clone(parent1.levelTwoNodes2);
							
							var muter = Math.random() - (1 - mutationSkew);
							
							if (whichMutate < 20) { 
								thePleuro.attackPower1 = parent1.attackPower1 + muter * 20 * mutationIntensity;
							} else {
								thePleuro.attackPower1 = parent1.attackPower1;
							}
							thePleuro.attackPower2 = parent1.attackPower2;// + (Math.random() * 20 - 10) * mutationIntensity ;
							
							if (whichMutate < 40 && whichMutate > 20) { 
								thePleuro.maxHP1 = parent1.maxHP1 + muter * 50 * mutationIntensity;
							} else {
								thePleuro.maxHP1 = parent1.maxHP1;
							}
							thePleuro.maxHP2 = parent1.maxHP2;// + (Math.random() * 50 - 25) * mutationIntensity ;
							
							if (whichMutate < 60 && whichMutate > 40) { 
								thePleuro.offspringCount1 = parent1.offspringCount1 + muter * 4 * mutationIntensity ;
							} else {
								thePleuro.offspringCount1 = parent1.offspringCount1;
							}
							thePleuro.offspringCount2 = parent1.offspringCount2;// + (Math.random() * 4 - 2) * mutationIntensity ;
							
							if (whichMutate < 80 && whichMutate > 60) { 
								thePleuro.hungerModifier1 = parent1.hungerModifier1 + muter * 1 * mutationIntensity ;
							} else {
								thePleuro.hungerModifier1 = parent1.hungerModifier1;
							}
							thePleuro.hungerModifier2 = parent1.hungerModifier2;// + (Math.random() * 1 - .5) * mutationIntensity ;
							
							if (whichMutate < 100 && whichMutate > 80) {
								thePleuro.speedModifier1 =  parent1.speedModifier1 + muter * .5 * mutationIntensity ;
							} else {
								thePleuro.speedModifier1 =  parent1.speedModifier1;
							}
							thePleuro.speedModifier2 =  parent1.speedModifier2;// + (Math.random() * .5 - .25) * mutationIntensity ;
				
							thePleuro.HP = thePleuro.maxHP1 + thePleuro.maxHP2;
							
							var randoLo = Math.random() * 100;
							var randoJo = Math.random() * 100;
							
							if (randoLo > 70) {
								thePleuro.levelTwoNodes.push(new levelTwoNode(thePleuro));
							} else if (randoLo > 30) {
								var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
								randoRo = Math.floor(randoRo);
								thePleuro.levelTwoNodes[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));	
							} 
							
							if (randoJo > 80) {
								if (thePleuro.levelTwoNodes.length > 1){
									var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
									randoRo = Math.floor(randoRo);
									thePleuro.levelTwoNodes.splice(randoRo,1);
								}
							} else if (randoJo > 60) {
								var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
								randoRo = Math.floor(randoRo);
								if (thePleuro.levelTwoNodes[randoRo].levelOneNodes.length > 1) {
									thePleuro.levelTwoNodes[randoRo].levelOneNodes.splice(Math.floor(Math.random() * thePleuro.levelTwoNodes[randoRo].levelOneNodes.length),1);
								}
							} else if (randoJo > 45) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
								var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
								var randoOno = Math.floor(Math.random() * tempLevelTwo.levelOneNodes.length);
								tempLevelTwo.levelOneNodes[randoOno].mutate();
								
							} else if (randoJo > 10) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
								var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
								tempLevelTwo.inputStrength = tempLevelTwo.inputStrength + (Math.random() * 40 - 20) * mutationIntensity ;
							}
						} else {
							thePleuro.levelTwoNodes = clone(parent1.levelTwoNodes); //NO MUTATION
							thePleuro.levelTwoNodes2 = clone(parent1.levelTwoNodes2);
							thePleuro.attackPower1 = parent1.attackPower1;
							thePleuro.attackPower2 = parent1.attackPower2;
							thePleuro.maxHP1 = parent1.maxHP1;
							thePleuro.maxHP2 = parent1.maxHP2;
							thePleuro.offspringCount1 = parent1.offspringCount1;
							thePleuro.offspringCount2 = parent1.offspringCount2;
							thePleuro.hungerModifier1 = parent1.hungerModifier1;
							thePleuro.hungerModifier2 = parent1.hungerModifier1;
							thePleuro.speedModifier1 =  parent1.speedModifier1;
							thePleuro.speedModifier2 =  parent1.speedModifier2;
						}
						
						pleuros.push(thePleuro);
						myPanel.update(thePleuro);
					}
				} else if (this.clan == 2 || this.clan == 4 || (this.clan == 3 && gender == 0)) {
					for (var ku = 0; ku < numbKids; ku++) {
						
					var thePleuro = new pleuro(this.xpos + ku * 5 - 5, this.ypos + ku * 5 - 5, 2 * Math.PI / (ku + 1), .5,this.clan, 0);
					thePleuro.generation = this.parent.generation + 1;
					
					thePleuro.size = 5;
					var parent1 = this.parent;
					

						if (Math.random() * 2 > 1){
							thePleuro.levelTwoNodes = clone(parent1.levelTwoNodes);
							thePleuro.attackPower1 = parent1.attackPower1;
							thePleuro.maxHP1 = parent1.maxHP1;
							thePleuro.offspringCount1 = parent1.offspringCount1;
							thePleuro.hungerModifier1 = parent1.hungerModifier1;
							thePleuro.speedModifier1 =  parent1.speedModifier1;
							thePleuro.levelTwoNodesMale1 = parent1.levelTwoNodesMale1;
							
						} else {
							thePleuro.levelTwoNodes = clone(parent1.levelTwoNodes2);
							thePleuro.attackPower1 = parent1.attackPower2;
							thePleuro.maxHP1 = parent1.maxHP2;
							thePleuro.offspringCount1 = parent1.offspringCount2;
							thePleuro.hungerModifier1 = parent1.hungerModifier2;
							thePleuro.speedModifier1 =  parent1.speedModifier2;
							thePleuro.levelTwoNodesMale1 = parent1.levelTwoNodesMale2;
						}
						
						if (Math.random() * 2 > 1){
							thePleuro.levelTwoNodes2 = clone(parent2.levelTwoNodes);
							thePleuro.attackPower2 = parent2.attackPower1;
							thePleuro.maxHP2 = parent2.maxHP1;
							thePleuro.offspringCount2 = parent2.offspringCount1;
							thePleuro.hungerModifier2 = parent2.hungerModifier1;
							thePleuro.speedModifier2 =  parent2.speedModifier1;
							thePleuro.levelTwoNodesMale2 = parent2.levelTwoNodesMale1;
						} else {
							thePleuro.levelTwoNodes2 = clone(parent2.levelTwoNodes2);
							thePleuro.attackPower2 = parent2.attackPower2;
							thePleuro.maxHP2 = parent2.maxHP2;
							thePleuro.offspringCount2 = parent2.offspringCount2;
							thePleuro.hungerModifier2 = parent2.hungerModifier2;
							thePleuro.speedModifier2 =  parent2.speedModifier2;
							thePleuro.levelTwoNodesMale2 = parent2.levelTwoNodesMale2;
						}
						
					var anyMutate = Math.random() * 100;
					if (anyMutate < mutationChance) {
						
						var muter = Math.random() - (1 - mutationSkew);
						
							if (whichMutate < 20) { 
								thePleuro.attackPower1 = thePleuro.attackPower1 + muter * 20 * mutationIntensity;
							} else {
								thePleuro.attackPower1 = thePleuro.attackPower1;
							}
							thePleuro.attackPower2 = thePleuro.attackPower2;// + (Math.random() * 20 - 10) * mutationIntensity ;
							
							if (whichMutate < 40 && whichMutate > 20) { 
								thePleuro.maxHP1 = thePleuro.maxHP1 + muter * 50 * mutationIntensity;
							} else {
								thePleuro.maxHP1 = thePleuro.maxHP1;
							}
							thePleuro.maxHP2 = thePleuro.maxHP2;// + (Math.random() * 50 - 25) * mutationIntensity ;
							
							if (whichMutate < 60 && whichMutate > 40) { 
								thePleuro.offspringCount1 = thePleuro.offspringCount1 + muter * 4 * mutationIntensity ;
							} else {
								thePleuro.offspringCount1 = thePleuro.offspringCount1;
							}
							thePleuro.offspringCount2 = thePleuro.offspringCount2;// + (Math.random() * 4 - 2) * mutationIntensity ;
							
							if (whichMutate < 80 && whichMutate > 60) { 
								thePleuro.hungerModifier1 = thePleuro.hungerModifier1 + muter * mutationIntensity ;
							} else {
								thePleuro.hungerModifier1 = thePleuro.hungerModifier1;
							}
							thePleuro.hungerModifier2 = parent1.hungerModifier2;// + (Math.random() * 1 - .5) * mutationIntensity ;
							
							if (whichMutate < 100 && whichMutate > 80) {
								thePleuro.speedModifier1 =  thePleuro.speedModifier1 + muter * .5 * mutationIntensity ;
							} else {
								thePleuro.speedModifier1 =  thePleuro.speedModifier1;
							}
							thePleuro.speedModifier2 =  thePleuro.speedModifier2;// + (Math.random() * .5 - .25) * mutationIntensity ;
						
						thePleuro.HP = thePleuro.maxHP1 + thePleuro.maxHP2;
						
						var onOff = 0;
			
						var randoLo = Math.random() * 100;
						var randoJo = Math.random() * 100;
						
						if (randoLo > 70) {
							thePleuro.levelTwoNodes.push(new levelTwoNode(thePleuro));
						} else if (randoLo > 30) {
							var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
							randoRo = Math.floor(randoRo);
							thePleuro.levelTwoNodes[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));
							
						} 
						
						
						if (randoJo > 80) {  //mutations
							if (thePleuro.levelTwoNodes.length > 1){
								var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
								randoRo = Math.floor(randoRo);
								thePleuro.levelTwoNodes.splice(randoRo,1);
							}
						} else if (randoJo > 60) {
							var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
							randoRo = Math.floor(randoRo);
							if (thePleuro.levelTwoNodes[randoRo].levelOneNodes.length > 1) {
								thePleuro.levelTwoNodes[randoRo].levelOneNodes.splice(0,1);
							}
						} else if (randoJo > 45) {
							var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
							var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
							var randoOno = Math.floor(Math.random() * tempLevelTwo.levelOneNodes.length);
							tempLevelTwo.levelOneNodes[randoOno].mutate();
							thePleuro.levelTwoNodes[randoRo] = tempLevelTwo;
						} else if (randoJo > 10) {
							var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
							var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
							tempLevelTwo.inputStrength = tempLevelTwo.inputStrength + Math.random() * 40 - 20;
							thePleuro.levelTwoNodes[randoRo] = tempLevelTwo;
						}
						
						
						///////////////////////////////////////

						var randoSo = Math.random() * 100;
						var randoTo = Math.random() * 100;
							
							if (randoSo > 80) {
								thePleuro.levelTwoNodesMale1.push(new levelTwoNode(thePleuro));
							} else if (randoSo > 30) {
								var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
								randoRo = Math.floor(randoRo);
								
								if (thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes === undefined) {
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes = [];
								}
								
								thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));
								
							} 
							
							if (randoTo > 80) {
								if (thePleuro.levelTwoNodesMale1.length > 1){
									var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
									randoRo = Math.floor(randoRo);
									thePleuro.levelTwoNodesMale1.splice(randoRo,1);
								}
							} else if (randoTo > 60) {
								var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
								randoRo = Math.floor(randoRo);
								
								if (thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes === undefined) {
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes = [];
								}
								
								if (thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.length > 1) {
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.splice(Math.floor(Math.random() * thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.length),1);
								}
							} else if (randoTo > 45) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodesMale1.length);
								
								if (thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes === undefined) {
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes = [];
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));
								}
								
								var tempLevelTwo = thePleuro.levelTwoNodesMale1[randoRo];
								var randoOno = Math.floor(Math.random() * tempLevelTwo.levelOneNodes.length);
								
								tempLevelTwo.levelOneNodes[randoOno].mutate();
								thePleuro.levelTwoNodesMale1[randoRo] = tempLevelTwo.levelOneNodes[randoOno];
							} else if (randoTo > 10) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodesMale1.length);
								var tempLevelTwo = thePleuro.levelTwoNodesMale1[randoRo];
								tempLevelTwo.inputStrength = tempLevelTwo.inputStrength + Math.random() * 40 - 20;
								thePleuro.levelTwoNodesMale1[randoRo] = tempLevelTwo;
							}
					}
					
					
					
					/*if (randoTo > 60) {  //crossing over
						var randoRo = Math.floor(Math.random() * (thePleuro.levelTwoNodes2.length - 1) + 1);
						var randoPo = Math.floor(Math.random() * (thePleuro.levelTwoNodes2.length - 1) + 1);
						
						var oldLength = thePleuro.levelTwoNodes.length;
						
						for (var ju = thePleuro.levelTwoNodes2.length - 1; ju > randoRo - 1; ju--) {
							thePleuro.levelTwoNodes.push(thePleuro.levelTwoNodes2[ju]);
							thePleuro.levelTwoNodes2.splice(ju,1);
						}
						
						for (var ju = oldLength - 1; ju > randoPo - 1; ju--) {
							thePleuro.levelTwoNodes2.push(thePleuro.levelTwoNodes[ju]);
							thePleuro.levelTwoNodes.splice(ju,1);
						}
					}*/
							
					var myPleuro = thePleuro;
					pleuros.push(myPleuro);
					myPanel.update(myPleuro);
					
					}
				} else if (this.clan == 3) {
					for (var ku = 0; ku < numbKids; ku++) {
						
						var thePleuro = new pleuro(this.xpos, this.ypos , 0, .5 + 2 * Math.PI / 3 * ku,this.clan, 1);
						
						thePleuro.size = 5;
						var parent1 = this.parent;
						
						var onOff = 0;
						
						if (Math.random() * 2 > 1){
							thePleuro.levelTwoNodes = parent1.levelTwoNodes;
							thePleuro.attackPower1 = parent1.attackPower1;
							thePleuro.maxHP1 = parent1.maxHP1;
							thePleuro.offspringCount1 = parent1.offspringCount1;
							thePleuro.hungerModifier1 = parent1.hungerModifier1;
							thePleuro.speedModifier1 =  parent1.speedModifier1;
							thePleuro.levelTwoNodesMale1 = parent1.levelTwoNodesMale1;
							
						} else {
							thePleuro.levelTwoNodes = parent1.levelTwoNodes2;
							thePleuro.attackPower1 = parent1.attackPower2;
							thePleuro.maxHP1 = parent1.maxHP2;
							thePleuro.offspringCount1 = parent1.offspringCount2;
							thePleuro.hungerModifier1 = parent1.hungerModifier2;
							thePleuro.speedModifier1 =  parent1.speedModifier2;
							thePleuro.levelTwoNodesMale1 = parent1.levelTwoNodesMale2;
						}
						
						if (Math.random() * 2 > 1){
							thePleuro.levelTwoNodes2 = parent2.levelTwoNodes;
							thePleuro.attackPower2 = parent2.attackPower1;
							thePleuro.maxHP2 = parent2.maxHP1;
							thePleuro.offspringCount2 = parent2.offspringCount1;
							thePleuro.hungerModifier2 = parent2.hungerModifier1;
							thePleuro.speedModifier2 =  parent2.speedModifier1;
							thePleuro.levelTwoNodesMale2 = parent2.levelTwoNodesMale1;
						} else {
							thePleuro.levelTwoNodes2 = parent2.levelTwoNodes2;
							thePleuro.attackPower2 = parent2.attackPower2;
							thePleuro.maxHP2 = parent2.maxHP2;
							thePleuro.offspringCount2 = parent2.offspringCount2;
							thePleuro.hungerModifier2 = parent2.hungerModifier2;
							thePleuro.speedModifier2 =  parent2.speedModifier2;
							thePleuro.levelTwoNodesMale2 = parent2.levelTwoNodesMale2;
						}
						
						var anyMutate = Math.random() * 100;
						if (anyMutate < mutationChance) {
							thePleuro.levelTwoNodes = thePleuro.levelTwoNodes;
							thePleuro.levelTwoNodes2 = thePleuro.levelTwoNodes2;
							thePleuro.attackPower1 = thePleuro.attackPower1 + Math.random() * 20 - 10;
							thePleuro.attackPower2 = thePleuro.attackPower2 + Math.random() * 20 - 10;
							thePleuro.maxHP1 = thePleuro.maxHP1  + Math.random() * 50 - 25;
							thePleuro.maxHP2 = thePleuro.maxHP2  + Math.random() * 50 - 25;
							thePleuro.offspringCount1 = thePleuro.offspringCount1 + Math.random() * 4 - 2;
							thePleuro.offspringCount2 = thePleuro.offspringCount2 + Math.random() * 4 - 2;
							thePleuro.hungerModifier1 = thePleuro.hungerModifier1 + Math.random() * 1 - .5;
							thePleuro.hungerModifier2 = thePleuro.hungerModifier1 + Math.random() * 1 - .5;
							thePleuro.speedModifier1 =  thePleuro.speedModifier1 + Math.random() * .5 - .25;
							thePleuro.speedModifier2 =  thePleuro.speedModifier2 + Math.random() * .5 - .25;

				
							thePleuro.HP = thePleuro.maxHP1 + thePleuro.maxHP2;
							
							var randoLo = Math.random() * 100;
							var randoJo = Math.random() * 100;
							
							if (randoLo > 80) {
								thePleuro.levelTwoNodes.push(new levelTwoNode(thePleuro));
							} else if (randoLo > 30) {
								var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
								randoRo = Math.floor(randoRo);
								thePleuro.levelTwoNodes[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));
								
							} 
							
							if (randoJo > 80) {
								if (thePleuro.levelTwoNodes.length > 1){
									var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
									randoRo = Math.floor(randoRo);
									thePleuro.levelTwoNodes.splice(randoRo,1);
								}
							} else if (randoJo > 60) {
								var randoRo = Math.random() * thePleuro.levelTwoNodes.length;
								randoRo = Math.floor(randoRo);
								if (thePleuro.levelTwoNodes[randoRo].levelOneNodes.length > 1) {
									thePleuro.levelTwoNodes[randoRo].levelOneNodes.splice(Math.floor(Math.random() * thePleuro.levelTwoNodes[randoRo].levelOneNodes.length),1);
								}
							} else if (randoJo > 45) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
								var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
								var randoOno = Math.floor(Math.random() * tempLevelTwo.levelOneNodes.length);
								tempLevelTwo.levelOneNodes[randoOno].mutate();
								thePleuro.levelTwoNodes[randoRo] = tempLevelTwo;
							} else if (randoJo > 10) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodes.length);
								var tempLevelTwo = thePleuro.levelTwoNodes[randoRo];
								tempLevelTwo.inputStrength = tempLevelTwo.inputStrength + Math.random() * 40 - 20;
								thePleuro.levelTwoNodes[randoRo] = tempLevelTwo;
							}
							
							/////////////////////////////
							
							var randoSo = Math.random() * 100;
							var randoTo = Math.random() * 100;
							
							if (randoSo > 80) {
								thePleuro.levelTwoNodesMale1.push(new levelTwoNode(thePleuro));
							} else if (randoSo > 30) {
								var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
								randoRo = Math.floor(randoRo);
								thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.push(new levelOneNode(thePleuro));
								
							} 
							
							if (randoTo > 80) {
								if (thePleuro.levelTwoNodesMale1.length > 1){
									var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
									randoRo = Math.floor(randoRo);
									thePleuro.levelTwoNodesMale1.splice(randoRo,1);
								}
							} else if (randoTo > 60) {
								var randoRo = Math.random() * thePleuro.levelTwoNodesMale1.length;
								randoRo = Math.floor(randoRo);
								if (thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.length > 1) {
									thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.splice(Math.floor(Math.random() * thePleuro.levelTwoNodesMale1[randoRo].levelOneNodes.length),1);
								}
							} else if (randoTo > 45) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodesMale1.length);
								var tempLevelTwo = thePleuro.levelTwoNodesMale1[randoRo];
								var randoOno = Math.floor(Math.random() * tempLevelTwo.levelOneNodes.length);
								tempLevelTwo.levelOneNodes[randoOno].mutate();
								thePleuro.levelTwoNodesMale1[randoRo] = tempLevelTwo.levelOneNodes[randoOno];
							} else if (randoTo > 10) {
								var randoRo = Math.floor(Math.random() * thePleuro.levelTwoNodesMale1.length);
								var tempLevelTwo = thePleuro.levelTwoNodesMale1[randoRo];
								tempLevelTwo.inputStrength = tempLevelTwo.inputStrength + Math.random() * 40 - 20;
								thePleuro.levelTwoNodesMale1[randoRo] = tempLevelTwo;
							}
						}
	
						var myPleuro = thePleuro;	
						pleuros.push(myPleuro);
						myPanel.update(myPleuro);

					}
				}
				this.STOP = 0;
			}
		}
		

	}

	//only large piece of code from stackoverflow
	function clone(obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	//Modifier neuron. LevelTwoNeurons have arrays of these
	function levelOneNode(pare4) {
		var parent = pare4;
		this.plusNeg;
		if (Math.random() * 2 < 1) {
			this.plusNeg = 1;
		} else {
			this.plusNeg = -1;
		}
		
		this.factorOne;
		if (Math.random() * 2 < 1) {
			this.factorOne = 1;
		} else {
			this.factorOne = 0;
		}
		
		this.greaterLess = 1;
		if (Math.random() * 2 < 1) {
			this.greaterLess = 1;
		} else {
			this.greaterLess = 0;
		}
		
		this.threshold = Math.random() * 2;
		
		this.randoVar = Math.random() * 8;
		this.inputVariablu = 0;	
		
		if (this.randoVar < 1) {
			this.inputVariablu = (parent.leastHabRight + parent.leastHabLeft) / 2;
		} else if (this.randoVar < 2) {
			this.inputVariablu = (parent.hermiRight + parent.hermiLeft) / 2;
		} else if (this.randoVar < 3) {
			this.inputVariablu = (parent.pleuroRight + parent.pleuroLeft)/ 2;
		} else if (this.randoVar < 4) {
			this.inputVariablu = (parent.clanRight + parent.clanLeft) / 2;
		} else if (this.randoVar < 5) {
			this.inputVariablu = (parent.alarmRight + parent.alarmLeft) / 2;
		} else if (this.randoVar < 6) {
			this.inputVariablu = parent.HP * .01;
		} else if (this.randoVar < 7) {
			this.inputVariablu = parent.notAttacked;
		} else if (this.randoVar < 8) {
			this.inputVariablu = parent.nutrition;
		}
		
		this.mutate = function () {
			var whichProperty = Math.random() * 4;
			
			if (whichProperty < 1) {
				if (Math.random() * 2 < 1) {
					this.plusNeg = 1;
				} else { 
					this.plusNeg = -1;
				}
			} else if (whichProperty < 2) {
				if (Math.random() * 2 < 1) {
					this.factorOne = 1;
				} else {
					this.factorOne = 0;
				}
			} else if (whichProperty < 3) {
				if (Math.random() * 2 < 1) {
					this.greaterLess = 1;
				} else { 
					this.greaterLess = 0;
				}	
			} else if (whichProperty < 4) {
				this.randoVar = Math.random() * 8;
			}
		}
		
		this.update = function () {
			if (this.randoVar < 1) {
				this.inputVariablu = (parent.leastHabRight + parent.leastHabLeft) / 2;
			} else if (this.randoVar < 2) {
				this.inputVariablu = (parent.hermiRight + parent.hermiLeft) / 2;
			} else if (this.randoVar < 3) {
				this.inputVariablu = (parent.pleuroRight + parent.pleuroLeft)/ 2;
			} else if (this.randoVar < 4) {
				this.inputVariablu = (parent.clanRight + parent.clanLeft) / 2;
			} else if (this.randoVar < 5) {
				this.inputVariablu = (parent.alarmRight + parent.alarmLeft) / 2;
			} else if (this.randoVar < 6) {
				this.inputVariablu = parent.HP * .01;
			} else if (this.randoVar < 7) {
				this.inputVariablu = parent.notAttacked;
			} else if (this.randoVar < 8) {
				this.inputVariablu = parent.nutrition;
			}
		}
			
	}
		
	function levelTwoNode(pare5) {
		
		//this.parent = pare5;
		
		this.inputStrength = Math.random() * 40 - 20;
		
		var randoVar = Math.random() * 5;
		this.inputVariable;
		
		this.levelOneNodesLength = 1;
		
		if (randoVar < 1) {
			this.inputVariable = "leastHab";
		} else if (randoVar < 2) {
			this.inputVariable = "hermi";
		} else if (randoVar < 3) {
			this.inputVariable = "pleuro";
		} else if (randoVar <  4) {
			this.inputVariable = "clan";
		} else {
			this.inputVariable = "flab";
		}
			
		this.levelOneNodes = [];
		var myLevelOne = new levelOneNode(pare5);
		
		this.levelOneNodes.push(myLevelOne);
		
		this.isEqual = function (joop) {
			if (this.inputStrength > joop.inputStrength - 1 && this.inputStrength < joop.inputStrength + 1) {
				return true;
			} else {
				return false;
			}
		}
		
		this.updateLevelOne = function (parent) {
			if (this.levelOneNodes.length > 0) {
				for (var i8 = 0; i8 < this.levelOneNodes.length; i8++){
					var randoVar = this.levelOneNodes[i8].randoVar;
					if (randoVar < 1) {
						this.levelOneNodes[i8].inputVariablu = (parent.leastHabRight + parent.leastHabLeft) / 2;
					} else if (randoVar < 2) {
						this.levelOneNodes[i8].inputVariablu = (parent.hermiRight + parent.hermiLeft) / 2;
					} else if (randoVar < 3) {
						this.levelOneNodes[i8].inputVariablu = (parent.pleuroRight + parent.pleuroLeft)/ 2;
					} else if (randoVar < 4) {
						this.levelOneNodes[i8].inputVariablu = (parent.clanRight + parent.clanLeft) / 2;
					} else if (randoVar < 5) {
						this.levelOneNodes[i8].inputVariablu = (parent.alarmRight + parent.alarmLeft) / 2;
					} else if (randoVar < 6) {
						this.levelOneNodes[i8].inputVariablu = parent.HP * .01;
					} else if (randoVar < 7) {
						this.levelOneNodes[i8].inputVariablu = parent.notAttacked;
					} else if (randoVar < 8) {
						this.levelOneNodes[i8].inputVariablu = parent.nutrition;
					}
				}
			}
		}
		
		this.drawT = function (ctx3) {
			///ctx3.fillText(pare5.nutrition , pare5.xpos, pare5.ypos + 30);
			//ctx3.fillText(pare5.hermiRight , pare5.xpos, pare5.ypos + 40);
			//ctx3.fillText(dog.randoVar, pare5.xpos, pare5.ypos + 40)
		}
		
	}

	function countOriginalTwoNodes() {
		var originalNodeCount = 0;
		var nonOriginalNodes = [];
		
			for (var i4 = 0; i4 < pleuros.length; i4++) {
				
				var temP= [];
				temP = pleuros;
				var original = 1;
				var saveJ2 = 0;
						
				if (nonOriginalNodes.length > 0) {
					for (var j2 = 0; j2 < pleuros[i4].levelTwoNodes.length; j2++) {	
					var temP2 = pleuros[i4].levelTwoNodes;
						for (var k3 = 0; k3 < nonOriginalNodes.length; k3++) {
							if (nonOriginalNodes[k3] == temP2[j2]){
								original = 0;
							} else { 
								saveJ2 = j2;
							}
						}
						
						if (original == 1) {
							nonOriginalNodes.push(temP2[saveJ2]);
						}

					}
	
				} else {
					nonOriginalNodes[0] = temP[0].levelTwoNodes[0];
				}
				
				if (original == 1) {
					pleuros[i4].count = originalNodeCount;
					originalNodeCount++;
				}
										
				if (original == 0) {
					pleuros[i4].count = originalNodeCount - 1;
				}
				
			}
			
		return originalNodeCount;
	}	
	
	function countOriginalOneNodes() { 
		var originalNodeCount = 0;
		var nonOriginalNodes = [];
		var nonOriginalOneNodes = [];
		var counter = [];
		var returnArray = [];
		
			for (i4 = 0; i4 < pleuros.length; i4++) {
				
			var temP= [];
			temP = pleuros;
			var original = 1;
			var originalOne = 1;
			var saveJ2 = 0;
			var saveJ3 = 0;
			var temP2 = [];
			temP2 = temP[i4].levelTwoNodes;		
				if (nonOriginalNodes.length > 0) {
					for (var j2 = 0; j2 < pleuros[i4].levelTwoNodes.length; j2++) {	
						
						counter[saveJ2] = 0;
						for (var k3 = 0; k3 < nonOriginalNodes.length; k3++) {
							if (nonOriginalNodes[k3] == temP2[j2]){
								original = 0;
							} else { 
								saveJ2 = j2;
							}
						}
						
						if (original == 1) {
							counter[saveJ2] = 0;
							nonOriginalNodes.push(temP2[saveJ2]);
							for (var j3 = 0; j3 < temP2[j2].levelOneNodes.length; j3++) {	
								//if (nonOriginalOneNodes.length > 0) {
									var tempLevelOnes = temP2[saveJ2].levelOneNodes;
									for (var k4 = 0; k4 < nonOriginalOneNodes.length; k4++) {
										if (nonOriginalOneNodes[k4] == tempLevelOnes[j3]){
											originalOne = 0;
										} else { 
											saveJ3 = j3;
										}
									}
									
									if (originalOne == 0) {
										pleuros[i4].countOne = counter[saveJ2];
									}
								
									if (originalOne == 1) {
										nonOriginalOneNodes.push(tempLevelOnes[saveJ3])
										counter[saveJ2]++;
										pleuros[i4].countOne = counter[saveJ2];
										
									}
						
							}
						}
						
					}
		
				} else {
					nonOriginalNodes[0] = temP[0].levelTwoNodes[0];
					counter.push(0);
					for (var j3 = 0; j3 < temP2[0].levelOneNodes.length; j3++) {	
						var tempLevelOnes = temP2[0].levelOneNodes;
						for (var k4 = 0; k4 < nonOriginalOneNodes.length; k4++) {
							if (nonOriginalOneNodes[k4] == tempLevelOnes[j3]){
								originalOne = 0;
									} else { 
										saveJ3 = j3;
									}
								}
									
							if (originalOne == 0) {
								pleuros[i4].countOne = counter[0];
							}	
							if (originalOne == 1) {
								nonOriginalOneNodes.push(tempLevelOnes[saveJ3])
								counter[0]++;
								pleuros[i4].countOne = counter[0];
							}
						}
					returnArray.push(counter[0]);
				}

				if (original == 1) {
					returnArray.push(counter[saveJ2]);
				}
				
				
			}
			
		return returnArray;
	}

	function pleuro(xpos, ypos, direction, nutrition, clanD, genderD) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.nutrition = nutrition;

		this.dir = direction;
		this.gender = genderD;

		this.turnAngle = 0;
	 	this.attacked = 0;
		this.attacking = 0;
		this.notAttacked = 1;
		
		this.speed = pleuroSpeed;

		this.maxSize = pleuroSize;
		this.size = this.maxSize;
		this.clan = clanD;
		this.index = 0;
		this.paintingCounter1 = 0;
		
		this.maxHP1 = Math.random() * 50 + 25;
		this.maxHP2 = Math.random() * 50 + 25;
		this.speedModifier1 = Math.random() * .2 + .4;
		this.speedModifier2 = Math.random() * .2 + .4;
		this.offspringCount1 = 1 + Math.random() * 2;
		this.offspringCount2 = 1 + Math.random() * 2;
		this.attackPower1 = Math.random() * 30 + 5;
		this.attackPower2 = Math.random() * 30 + 5;
		this.hungerModifier1 = Math.random();
		this.hungerModifier2 = Math.random();
		
		this.HP = this.maxHP1 + this.maxHP2;
		this.flabCount = 0;
		
		this.pleuroRight = 0;
		this.pleuroLeft = 0;
		this.leastHabRight = 0;
		this.leastHabLeft = 0;
		this.clanRight = 0;
		this.clanLeft = 0;
		this.alarmRight = 0;
		this.alarmLeft = 0;
		this.hermiRight = 0;
		this.hermiLeft = 0;

		this.levelTwoNodes = [];
		var myFirstTwoNode = new levelTwoNode(this);
		this.levelTwoNodes.push(myFirstTwoNode);
		
		this.levelTwoNodes2 = [];
		var myFirstTwo2Node = new levelTwoNode(this);
		this.levelTwoNodes2.push(myFirstTwo2Node);
		
		this.levelTwoNodesMale1 = [];
		var myFirstTwoMale1Node = new levelTwoNode(this);
		this.levelTwoNodesMale1.push(myFirstTwoMale1Node);
		
		this.levelTwoNodesMale2 = [];
		var myFirstTwoMale2Node = new levelTwoNode(this);
		this.levelTwoNodesMale2.push(myFirstTwoMale2Node);
		
		this.count = 0;
		this.countOne = 0;
		
		this.generation = 0;
	
		this.pastSmellRight = [];
		this.pastSmellLeft = [];
		this.habituations = [];
		this.incentiveRight = 0;
		this.incentiveLeft = 0;
		
		this.getLevelTwoNodes1 = function () { 
			var tempNodes = this.levelTwoNodes.slice(0);
			return tempNodes;
		}
		
		this.updateNodes = function () {
			
			for (var i3 = 0; i3 < this.levelTwoNodes.length; i3++) {
				this.levelTwoNodes[i3].updateLevelOne(this);
				}	
			
			};
			
		
		this.calculateIncentive = function (ctx2, nodes1, nodes2) {
			var incentiveTotalRight = 0;
			var incentiveTotalLeft = 0;
			for (var j1 = 0; j1 < nodes1.length; j1++){
				
				var inputVar21 = nodes1[j1];
				
				var inputStr = inputVar21.inputStrength;
			
				var inputVar1 = inputVar21.inputVariable;
				
				if (inputVar21.levelOneNodes === undefined) {
					inputVar21.levelOneNodes = [];
				}
				
				var nodesLength = inputVar21.levelOneNodes.length;
				var rightSmell;// = this.smellRight(inputVar1, 0); //MAKE THIS BETTER
				var leftSmell;// = this.smellLeft(inputVar1, 0);
				
				if (inputVar1 == "hermi") {
					rightSmell = this.hermiRight;
					leftSmell = this.hermiLeft;
				} else if (inputVar1 == "flab") {
					rightSmell = this.flabRight;
					leftSmell = this.flabLeft;
				} else if (inputVar1 == "leastHab") {
					rightSmell = this.leastHabRight;
					leftSmell = this.leastHabLeft;
				} else if (inputVar1 == "pleuro") {
					rightSmell = this.pleuroRight;
					leftSmell = this.pleuroLeft;
				} else if (inputVar1 == "clan") {
					rightSmell = this.clanRight;
					leftSmell = this.clanLeft;
				}
				
				var factorOne = 1;
				
				var incentiveRight = 0;
				var incentiveLeft = 0

				
				for (var k2 = 0; k2 < nodesLength; k2++){
					inputVar21.levelOneNodes[k2].update();
					var inputVar2 = inputVar21.levelOneNodes[k2];
					var inputVar3 = inputVar2.inputVariablu;
					var nodeThreshold = inputVar2.threshold;
					var greaterLess = inputVar2.greaterLess;
					var plusNeg = inputVar2.plusNeg;
					
					if (greaterLess < 1){
						if (inputVar3 > nodeThreshold) { //if it is greater than the threshold and that is what greaterLess calls for
							factorOne = factorOne * plusNeg;
						} else if (inputVar2.factorOne == 0){
							if (factorOne == 0){ //if the node causes the path to become multiplied by zero and the path is already being multiplied by zero then it becomes being multiplied by one
								factorOne = 1;
							} else {
								factorOne = 0;
							}
						}
					} else {
						if (inputVar3 < nodeThreshold) {
							factorOne = factorOne * plusNeg;
						} else if (inputVar2.factorOne == 0){
							if (factorOne == 0){
								factorOne = 1;
							} else {
								factorOne = 0;
							}
						}
					}
	
					incentiveLeft = leftSmell * factorOne * inputStr;
					incentiveRight = rightSmell * factorOne * inputStr;
				}
				
				incentiveTotalLeft = incentiveTotalLeft + incentiveLeft;
				incentiveTotalRight = incentiveTotalRight + incentiveRight;
			}
			
			for (var j1 = 0; j1 < nodes2.length; j1++){
				
				var inputVar21 = nodes2[j1];
				
				var inputStr = inputVar21.inputStrength;
			
				var inputVar1 = inputVar21.inputVariable;
				if (inputVar21.levelOneNodes === undefined) {
					inputVar21.levelOneNodes = [];
				}
								
				var nodesLength = inputVar21.levelOneNodes.length;
				var rightSmell = this.smellRight(inputVar1, 0);
				var leftSmell = this.smellLeft(inputVar1, 0);
				var factorOne = 1;
				
				var incentiveRight = 0;
				var incentiveLeft = 0

				
				for (var k2 = 0; k2 < nodesLength; k2++){
					inputVar21.levelOneNodes[k2].update();
					var inputVar2 = inputVar21.levelOneNodes[k2];
					var inputVar3 = inputVar2.inputVariablu;
					var nodeThreshold = inputVar2.threshold;
					var greaterLess = inputVar2.greaterLess;
					var plusNeg = inputVar2.plusNeg;
					
					if (greaterLess < 1){
						if (inputVar3 > nodeThreshold) { //if it is greater than the threshold and that is what greaterLess calls for
							factorOne = factorOne * plusNeg;
						} else if (inputVar2.factorOne == 0){
							if (factorOne == 0){ //if the node causes the path to become multiplied by zero and the path is already being multiplied by zero then it becomes being multiplied by one
								factorOne = 1;
							} else {
								factorOne = 0;
							}
						}
					} else {
						if (inputVar3 < nodeThreshold) {
							factorOne = factorOne * plusNeg;
						} else if (inputVar2.factorOne == 0){
							if (factorOne == 0){
								factorOne = 1;
							} else {
								factorOne = 0;
							}
						}
					}
	
					incentiveLeft = leftSmell * factorOne * inputStr;
					incentiveRight = rightSmell * factorOne * inputStr;
				}
				
				incentiveTotalLeft = incentiveTotalLeft + incentiveLeft;
				incentiveTotalRight = incentiveTotalRight + incentiveRight;
			}
			
			this.incentiveRight = incentiveTotalRight;
			this.incentiveLeft = incentiveTotalLeft;
			
		}		
		
		this.pleuroStep = function (fd) {
			this.xpos = this.xpos + Math.cos(this.dir) * fd;
			this.ypos = this.ypos + Math.sin(this.dir) * fd;
		}
		
		this.calculateAttacking = function () {
			if (this.HP < 0) {
				this.die();
			}
			
			this.notAttacked = 1;
			if (this.attacked > 0){
				this.attacked = this.attacked + 1;
				this.notAttacked = 0;
			}
			
			if (this.attacked > 50){
				this.attacked = 0;
				this.notAttacked = 1;
			}
			
			if (this.attacking > 0){
				this.attacking = this.attacking + 1;
			}
			if (this.attacking > 5){
				this.attacking = 0;
			}
		}
		
		this.calculateLeastHabituated = function() {
			var highI = 0;
			var highestPleuroSmell = 0;
			
			for (var i = 0; i < pleuros.length; i++){
				if (Math.abs(pleuros[i].xpos - this.xpos) < 500 && Math.abs(pleuros[i].xpos - this.xpos) < 500){
					var rightSmellInd = this.smellRight("pleuroInd", i);
					var leftSmellInd = this.smellLeft("pleuroInd", i);
					if (rightSmellInd + leftSmellInd > .1){
						if (rightSmellInd + leftSmellInd < this.pastSmellRight[i] + this.pastSmellLeft[i]){
							this.habituations[i] = this.habituations[i] + 5;
						}
					} else {
						this.habituations[i] = this.habituations[i] - 1;
					} 
					if (this.habituations[i] < 0) {
						this.habituations[i] = 0;
					}
					
					var currSmell = (rightSmellInd + leftSmellInd) * (1 / this.habituations[i]);
					//this.habituations[i] / 100) / (Math.exp(this.habituations[i] / 20));
					
					if (currSmell > highestPleuroSmell){
						highestPleuroSmell = currSmell;
						highI = i;
					}
					
					this.pastSmellRight[i] = rightSmellInd;
					this.pastSmellLeft[i] = leftSmellInd;
				}
			}
			
			return highI;
		}
		
		this.checkNodes = function() {
			var saveJ = -1;
			var temp32 = [];
			temp32 = this.levelTwoNodes;
			for (var i4 = 0; i4 < this.levelTwoNodes.length; i4++) {
				for (var j4 = 0; j4 < this.levelTwoNodes.length; j4++) {
					if (temp32[i4].isEqual(temp32[j4]) && j4 != i4) {
						//console.log(temp32[i4].inputStrength);
						saveJ = j4;
						j4 = 1000;
						i4 = 1000;
					}
				}
			}
			
			if (saveJ > -1) {
				this.levelTwoNodes.splice(saveJ,1);
				this.levelTwoNodesLength--;
			}
		}
		

		this.think = function (ctx2) {
			
			//ctx2.fillText(this.levelTwoNodesLength,111,111);
			this.updateNodes();
			this.checkNodes();
			
			this.levelTwoNodesLength = this.levelTwoNodes.length;
			
			this.pleuroRight = this.smellRight("pleuro",0);
			this.pleuroLeft = this.smellLeft("pleuro",0);
			this.leastHabRight = this.smellRight("leastHab",0);
			this.leastHabLeft = this.smellLeft("leastHab",0);
			this.clanRight = this.smellRight("clan",0);
			this.clanLeft = this.smellLeft("clan",0);
			this.alarmRight = this.smellRight("alarm",0);
			this.alarmLeft = this.smellLeft("alarm",0);
			this.hermiRight = this.smellRight("hermi",0);
			this.hermiLeft = this.smellLeft("hermi",0);
			this.flabRight = this.smellRight("flab",0);
			this.flabLeft = this.smellLeft("flab", 0);
			
			ctx.strokeStyle="blue";
			ctx.fillStyle = "blue";
			//this.levelTwoNodes[0].drawT(ctx2);
			//this.levelTwoNodes[1].drawT(ctx2);
	
			this.calculateAttacking();			
			var highI = this.calculateLeastHabituated();
			this.layEggs(ctx2);
			this.HP = this.HP + .02 * speedFactor;
			
			if (this.HP > this.maxHP1 + this.maxHP2) {
				this.HP = this.maxHP1 + this.maxHP2;
			}
			

			if (this.nutrition < .01) { 
				this.die();}
			if (this.size < 3){
				this.die();}
				
			if (this.xpos < 0 || this.xpos > w || this.ypos < 0 || this.ypos > h){
				this.die();}
			
			var alarmed = 0;
			if (this.smellRight("alarm", 0) > .01 || this.smellLeft("alarm",0) > .01) {
				alarmed = 1;}
			
			var fightDesire = 0;
			if (this.HP > this.territorialness){
				fightDesire = 1;}
			if (this.attacked > 0 && fightDesire == 0){
				this.speed = pleuroSpeed * 1.2;}
			
			if (this.speed == 0 && this.attacking == 0){
				this.speed = pleuroSpeed;}
			
			if (this.attack == 0 && this.attacking == 0){
				this.speed = pleuroSpeed;}

			//var foodMultiplyer = (1 - alarmed) * this.notAttacked * (1 - 2 * satiated * foodGreater3); 
			
			var incentiveLeft = 0;
			
			var incentiveRight = 0;
			if (this.gender == 0) {
				this.calculateIncentive(ctx2, this.levelTwoNodes, this.levelTwoNodes2);
			} else if (this.gender == 1) {
				this.calculateIncentive(ctx2, this.levelTwoNodesMale1, this.levelTwoNodesMale2);
			}
			
			//this.incentiveRight = this.smellRight("hermi",0) * 5;
			//this.incentiveLeft = this.smellLeft("hermi",0) * 5;
			
			var incentiveLeft = this.incentiveLeft - this.smellLeft("wall",0) * 135;
			var incentiveRight = this.incentiveRight - this.smellRight("wall",0) * 135;
			
			this.nutrition = this.nutrition - this.nutrition * this.nutrition * this.nutrition * .001 * speedFactor * (this.hungerModifier1 + this.hungerModifier2) - .00005 * speedFactor * (this.hungerModifier1 + this.hungerModifier2);
			
			//if (snsBetaine > .5 || Math.abs(incentiveLeft + incentiveRight) > 2){
			//this.turnAngle =  .03 * (incentiveRight - incentiveLeft);
			this.turnAngle = .8 / (1 + Math.exp(-3 * (incentiveRight - incentiveLeft))) - .4;
			this.turnAngle = this.turnAngle * speedFactor / 5;
			//this.turnAngle = 20 / (1 + Math.exp((-1 * this.turnAngle) * .5)) - 10;
			//} else {
				//this.turnAngle = 0;
			//}
			
			this.turnAngle = this.turnAngle	+ (1 - Math.random() * 2) / 50;	
			this.speed = this.speed / (1 + Math.abs(this.turnAngle) * Math.abs(this.turnAngle) * 15);
			
			if (this.index > 0 || goldSlugYN == 0) {  // for controlling the golden slug
			this.dir = this.dir + this.turnAngle;} else {
				if (rightDown > 0) {
					this.dir = this.dir + .05; }
				if (leftDown > 0) {
					this.dir = this.dir - .05; }
			}
			this.pleuroStep(this.speed * .5 * (this.speedModifier1 + this.speedModifier2));
			this.speed = this.speed * (1 + Math.abs(this.turnAngle) * Math.abs(this.turnAngle) * 15);
			

		}
		
		this.layEggs = function (ctx2) {
			if (this.size > energeticCost) {
			
				
				if (this.clan == 1) {
					var theClone = $.extend(true, {}, this);
					var myEgg = new egg(this.xpos, this.ypos, this.clan, theClone, this);
					eggs.push(myEgg);
					myEgg.fertilize(this, 0);
					this.size = 5;
					this.flabCount = 0;
				} else {
					var saveLargest = new pleuro(0,0,0,0,0,10);
					saveLargest.size = selectionNess;
					for (zu = 0; zu < pleuros.length; zu++) {
						if (Math.abs(pleuros[zu].xpos - this.xpos) < boxSize && Math.abs(pleuros[zu].ypos - this.ypos) < boxSize && pleuros[zu].size != this.size) {
							if (pleuros[zu].size > saveLargest.size) {
								saveLargest = $.extend(true, {}, pleuros[zu]);
							}
						}
					}
					if (saveLargest.gender < 9 || this.clan == 4) {
						var theClone = $.extend(true, {}, this);
						var myEgg = new egg(this.xpos, this.ypos, this.clan, theClone, this);
						eggs.push(myEgg);
						
						if (this.clan == 4) {
							myEgg.fertilize($.extend(true, {}, this), 0);
						} else {
							myEgg.fertilize($.extend(true, {}, saveLargest), 0);
							totalSize = totalSize + saveLargest.size;
							maleCount++;
						}
						this.size = 5;
						this.flabCount = 0;
					}
				}
				
				ctx2.strokeRect(this.xpos, this.ypos, 100,100);
			}
		}
		
		
		this.attack = function (ctx) {
			this.attacking = 1;
			this.speed = 0;
		}
		
		this.attackedFunc = function (ctx, attacker) {
			this.HP = this.HP - (attacker.attackPower1 + attacker.attackPower2) / 25 * speedFactor;
			if (this.HP < 0) { 
				attacker.size = attacker.size + (this.size - 5);
				attacker.nutrition = attacker.nutrition + .5;
			}
			
			this.attacked = 1;
		}
		
		this.die = function () {
		    var i4 = pleuros.indexOf(this);
			for (var j = 0; j < pleuros.length; j++){
				if (pleuros[j].habituations[i4] != null){
					pleuros[j].habituations.splice(i4, 1);
				}
				if (pleuros[j].habituations[i4] != null){
					pleuros[j].pastSmellRight.splice(i4, 1);
				}
				if (pleuros[j].habituations[i4] != null){
					pleuros[j].pastSmellLeft.splice(i4, 1);
				}
			}
			pleuros.splice(i4, 1);
			
		}

		this.eat = function (food) {
			if (food == "hermi"){
				
				if (this.nutrition < 1) {
					this.nutrition = this.nutrition + .3;
					this.size = this.size + .8;} else {
					this.nutrition = this.nutrition - .3;
					this.size = this.size - .4;	
				}
			}
			
			if (food == "flab"){
				//this.vF = this.vF + .5 * (1 - this.vF);
				this.size = this.size - .6;
				this.flabCount++;
				this.nutrition = this.nutrition;
			}
		}
		
		this.paintPleuro = function (ctx) {
			ctx.translate(this.xpos, this.ypos);
			ctx.rotate(this.dir);
			this.paintingCounter1 = this.paintingCounter1 + 1;
			
			
			
			if (this.index == 0 && goldSlugYN == 1) {
					//ctx.drawImage(goldSlug, this.size * -2.5, this.size * -1.8, this.size * 5, this.size * 3.6);
			} else {
				if (this.clan == 1) {
					ctx.strokeStyle="LimeGreen";
					ctx.fillStyle="Lime"
				}
				if (this.clan == clanA) {
					ctx.strokeStyle="blue";
					ctx.fillStyle="blue"
					ctx.drawImage(pleuroImage, this.size * -2.5, this.size * -1.8, this.size * 5, this.size * 3.6);
					//ctx.fillText(this.levelTwoNodesMale1.length, 25, 25);
					//ctx.fillText(this.levelTwoNodesMale2.length, 45, 45);
				}
				if (this.clan == clanB){
					ctx.strokeStyle="rgb(125,200,150)";
					ctx.fillStyle="rgb(100,250,150)";
					ctx.strokeStyle="blue";
					ctx.fillStyle="blue"
					ctx.drawImage(bluePleuroImage, this.size * -2.5, this.size * -1.8, this.size * 5, this.size * 3.6);
					//ctx.fillText(this.levelTwoNodesMale1.length, 25, 25);
					//ctx.fillText(this.levelTwoNodesMale2.length, 45, 45);
				}
			}
			
			if (this.gender == 1) {
				ctx.strokeStyle="black";
				ctx.strokeRect(this.size * -3, this.size * -2, this.size * 6, this.size * 4);
			}
			
			if (this.paintingCounter1 > 50) {
				this.paintingCounter1 = -50;
			}

			
			var modif = this.size / 20;
			
			ctx.rotate(-this.dir);
			ctx.translate(-this.xpos, -this.ypos);
			ctx.strokeStyle="blue";
			ctx.fillStyle = "blue";
			

		}
		
		this.smellRight = function (smell, indx) {
			if (smell == "hermi")
			{
				var totalOdor = 0;
				for (var i = 0; i < hermis.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size* Math.sin(this.dir) - hermis[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size* Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - hermis[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					totalOdor = totalOdor + odor;
					
				}
				return totalOdor;
			}
			if (smell == "flab")
			{
				var totalOdor = 0;
				for (var i = 0; i < flabs.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - flabs[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55  * 0.047 * this.size * Math.sin(this.dir) - flabs[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					totalOdor = totalOdor + odor;
				}
			return totalOdor;
			}
			
			if (smell == "betaine"){
				return this.smellRight("hermi",0) + this.smellRight("flab",0);
			}
			
			if (smell == "wall"){
				var distXright = w - (this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir));
				var odorXright = 2.6 - Math.log(distXright) / Math.LN10 * .95;
				var distYlow = h - (this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir)) ;
				
				var odorYlow = 2.6 - Math.log(distYlow) / Math.LN10 * .95;
			
				var odorXleft = 2.6 - Math.log(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir)) / Math.LN10  * .95;
				var odorYhigh = 2.6 - Math.log(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir)) / Math.LN10 * .95;
			
				if (odorXright < 0) { 
					odorXright = 0;
				}
 				if (odorXleft < 0) { 
					odorXleft = 0;
				}
				if (odorYlow < 0) { 
					odorYlow = 0;
				}
				if (odorYhigh < 0) { 
					odorYhigh = 0;
				}
				
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].clan == this.clan) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
						var odor = Math.log(dist) / Math.log(2);
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						if (this.index == i){
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor + odorXright + odorYlow + odorXleft + odorYhigh;
			}
			
			if (smell == "pleuro")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					totalOdor = totalOdor + odor;
					
				}
				
				return totalOdor - 1.25;
			}
			
			if (smell == "pleuroInd")
			{
				var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[indx].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[indx].ypos, 2));
				var odor = Math.log(dist) / Math.log(4.7);
				if (odor < smellDistance){
					odor = smellDistance - odor;
				} else {
					odor = 0;
				}
				if (this.index == indx){
					return 0;
				} else {
					return odor;
				}
			}
			 	
			
			if (smell == "alarm")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].attacked > 0) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
						var odor = Math.log(dist) / Math.log(5);
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor;  //includes the slugs own scent if the slug is being attacked
			}
			
			if (smell == "clan")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].clan == indx) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) - 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos + 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
						var odor = Math.log(dist) / Math.log(5);
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						if (this.index == i){
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor;
			}
			
			if (smell == "leastHab")
			{
				return this.smellRight("pleuroInd",this.calculateLeastHabituated());
			}
				

		}
		
		this.smellLeft = function (smell, indx) {
			if (smell == "hermi")
			{
				var totalOdor = 0;
				for (var i = 0; i < hermis.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - hermis[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - hermis[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					var totalOdor = totalOdor + odor;
				}
				
				return totalOdor;
			}
			if (smell == "flab")
			{
				var totalOdor = 0;
				for (var i = 0; i < flabs.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size*  Math.cos(this.dir) + 20 * 0.047 * this.size* Math.sin(this.dir) - flabs[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size* Math.cos(this.dir) + 55 * 0.047 * this.size* Math.sin(this.dir) - flabs[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					totalOdor = totalOdor + odor;
				}
			return totalOdor;
			}
			if (smell == "betaine"){
				return this.smellLeft("hermi",0) + this.smellLeft("flab",0);
			}
			
			if (smell == "wall"){
				var distXright = w - (this.xpos + 55 * 0.047 * this.size*  Math.cos(this.dir) + 20 * 0.047 * this.size* Math.sin(this.dir));
				var odorXright = 2.6 - Math.log(distXright) / Math.LN10 * .95;
				var distYlow = h - (this.ypos - 20 * 0.047 * this.size* Math.cos(this.dir) + 55 * 0.047 * this.size* Math.sin(this.dir));
				
				var odorYlow = 2.6 - Math.log(distYlow) / Math.LN10  * .95; 
			
				var odorXleft = 2.6 - Math.log((this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size* Math.sin(this.dir))) / Math.LN10  * .95;
				var odorYhigh = 2.6 - Math.log((this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55* 0.047 * this.size * Math.sin(this.dir))) / Math.LN10  * .95;
			
				if (odorXright < 0) { 
					odorXright = 0;
				}
 				if (odorXleft < 0) { 
					odorXleft = 0;
				}
				if (odorYlow < 0) { 
					odorYlow = 0;
				}
				if (odorYhigh < 0) { 
					odorYhigh = 0;
				}
				
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].clan == this.clan) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
						var odor = Math.log(dist) / Math.log(2); //changed to 2 on 12/4/15 
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						if (this.index == i){
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor + odorXright + odorYlow + odorXleft + odorYhigh;
			}
			
			if (smell == "pleuro")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
					var odor = Math.log(dist) / Math.log(5);
					if (odor < smellDistance){
						odor = smellDistance - odor;
					} else {
						odor = 0;
					}
					totalOdor = totalOdor + odor;
				}
				
				return totalOdor - 1.25;
			}
			
			if (smell == "pleuroInd")
			{
				var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[indx].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[indx].ypos, 2));
				var odor = Math.log(dist) / Math.log(4.7);
				if (odor < smellDistance){
					odor = smellDistance - odor;
				} else {
					odor = 0;
				}
				if (this.index == indx){
					return 0;
				} else {
					return odor;
				}
			}
			
			if (smell == "alarm")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].attacked > 0) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2))
						var odor = Math.log(dist) / Math.log(5);
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor;  //includes the slugs own scent if the slug is being attacked
			}
			
			if (smell == "clan")
			{
				var totalOdor = 0;
				for (var i = 0; i < pleuros.length; i++) {
					if (pleuros[i].clan == indx) {
						var dist = Math.sqrt(Math.pow(this.xpos + 55 * 0.047 * this.size *  Math.cos(this.dir) + 20 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].xpos, 2) + Math.pow(this.ypos - 20 * 0.047 * this.size * Math.cos(this.dir) + 55 * 0.047 * this.size * Math.sin(this.dir) - pleuros[i].ypos, 2));
						var odor = Math.log(dist) / Math.log(5);
						if (odor < smellDistance){
							odor = smellDistance - odor;
						} else {
							odor = 0;
						}
						if (this.index == i){
							odor = 0;
						}
						totalOdor = totalOdor + odor;
					}
				}
				return totalOdor;
			}
			
			if (smell == "leastHab")
			{
				return this.smellLeft("pleuroInd",this.calculateLeastHabituated());
			}
		}

	}
	
	function loadImages()
	{
		pleuroImage.src = 'sluggy.png';
		pieImage.src = 'pie.png';
		mineImage.src = 'mine.png';
		bluePleuroImage.src = 'blueSlug.png';
		eggImage.src = 'eggs.png';
		orangeEggs.src = 'orangeEggs.png';
	}

		
	//Lets paint the snake now
	function paint()
	{
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		
		for (var i = 0; i < hermis.length; i++) {
			hermis[i].paintHermi(ctx);
		}
		
		for (var i = 0; i < flabs.length; i++) {
			flabs[i].paintFlab(ctx);
		}
		
		for (var i = 0; i < eggs.length; i++) {
			eggs[i].paintEgg(ctx);
		}
		
		for (var k = 0; k < pleuros.length; k++) {
			if (pleuros[k].xpos > 10 && pleuros[k].ypos > 10) { //fixes bug where they are randomly painted in the top left corner?
				pleuros[k].paintPleuro(ctx);
				pleuros[k].think(ctx);
			}
		}

	}
	
})

	
	