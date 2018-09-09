(function(GAME) {
	var sprite48x48 = 48;

	function getIdleSprite(name) {
		return {
			name: name,
			width: sprite48x48,
			height: sprite48x48,
			frameCount: 4,
			fps: 2
		}
	}

	function getWalkSprite(name) {
		return {
			name: name,
			width: sprite48x48,
			height: sprite48x48,
			frameCount: 2,
			fps: 4
		};
	}

	function getHitSprite(name) {
		return {
			name: name,
			width: 64,
			height: 48,
			frameCount: 1,
			fps: 1
		};
	}

	GAME.loadAssets([
		getIdleSprite("blueFighterIdle"),
		getWalkSprite("blueFighterWalk"),
		getHitSprite("blueFighterHit"),
		getIdleSprite("redFighterIdle"),
		getWalkSprite("redFighterWalk"),
		getHitSprite("redFighterHit")
	], function() {
		var bIdle = GAME.assets.blueFighterIdle,
				rIdle = GAME.assets.redFighterIdle;

		GAME.createBlueFighter = function() {
			GAME.createObject({
				objectName: "blueFighter",
				defaultAsset: bIdle,
				loop: true,
				x: 25,
				y: 35
			}, function(fighter) {
				fighter.color = "#008BB8";
				fighter.lifeSegX = 6;
				fighter.idleA = bIdle;
				fighter.walkA = GAME.assets.blueFighterWalk;
				fighter.hitA = GAME.assets.blueFighterHit;
				fighter.defaultRestoreHitDelay = GAME.settings.FPS;
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.damage = 10;
				fighter.life = 100;
				fighter.speed = 1;
				fighter.keys = {
					forward: [68],
					back: [65],
					hit: [83]
				};
			});
		}

		GAME.createRedFighter = function() {
			GAME.createObject({
				objectName: "redFighter",
				defaultAsset: rIdle,
				loop: true,
				x: 183,
				y: 35
			}, function(fighter) {
				fighter.color = "#FC4E51";
				fighter.lifeSegX = 247;
				fighter.idleA = rIdle;
				fighter.walkA = GAME.assets.redFighterWalk;
				fighter.hitA = GAME.assets.redFighterHit;
				fighter.defaultRestoreHitDelay = GAME.settings.FPS;
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.damage = 10;
				fighter.life = 100;
				fighter.speed = 1;
				fighter.keys = {
					forward: [39],
					back: [37],
					hit: [40]
				};
			});
		}

		GAME.createBlueFighter();
		GAME.createRedFighter();

		var darkViolet = "#191970";

		GAME.staticObjects.line = {
			color: darkViolet,
			x1: 4,
			x2: 252,
			h: 1,
			y: 83.5
		};

		GAME.staticObjects.lifeSeg = {
			w: 3,
			h: 3,
			gap: 3,
			y: 6,
			q: 10
		};

		var fontSufix = "px Courier",
				textAlignCenter = "center",
				screenCenterX = 128;

		GAME.staticObjects.gameOver = {
			t: "OFFLINE",
			tA: textAlignCenter,
			f: 16 + fontSufix,
			x: screenCenterX,
			y: 72
		};

		GAME.staticObjects.gameInfo = {
			lines: [
				{t: "press '1' for singleplayer", x: screenCenterX, y: 22},
				{t: "press '2' for multiplayer", x: screenCenterX, y: 30},
				{t: "controls:", x: screenCenterX, y: 44},
				{t: "1st player: A,S,D", x: screenCenterX, y: 56},
				{t: "2nd player: arrow keys", x: screenCenterX, y: 64},
				{t: "volume: I,O", x: screenCenterX, y: 72},
				{t: "rules:", x: screenCenterX, y: 106},
				{t: "both players are standing 'online'", x: screenCenterX, y: 114},
				{t: "to win knock the other player 'offline'!", x: screenCenterX, y: 122},
			],
			color: darkViolet,
			tA: textAlignCenter,
			f: 6 + fontSufix,
		};

		GAME.gameplay = {
			hitFreeze: 1.5,
			walkCollisionMod: 6
		};

		GAME.AI = {
			missChance: 30
		};

		GAME.state = {
			mode: {
				1: [49, 97],
				2: [50, 98]
			}
		};

		GAME.sound = {
			volumeStep: 0.001,
			keys: {
				up: [79],
				down: [73]
			}
		}

		var tempo = 175,
				oneFourthNoteValue = GAME.settings.FPS * 60 / tempo,
				oneEighthNoteValue = oneFourthNoteValue/2,
				halfNoteValueWithDot = oneFourthNoteValue * 3;

		var A = [49, 54],
			AFourth = [oneFourthNoteValue].concat(A),
			AEighth = [oneEighthNoteValue].concat(A),
			AHalf = [halfNoteValueWithDot].concat(A);

		var C = [52, 57],
			CFourth = [oneFourthNoteValue].concat(C),
			CEighth = [oneEighthNoteValue].concat(C);

		var E = [56, 61],
			EFourth = [oneFourthNoteValue].concat(E),
			EHalf = [halfNoteValueWithDot].concat(E);

		var F = [45, 50],
			FFourth = [oneFourthNoteValue].concat(F),
			FEighth = [oneEighthNoteValue].concat(F);

		var D = [42, 47],
			DFourth = [oneFourthNoteValue].concat(D),
			DEighth = [oneEighthNoteValue].concat(D);

		var B = [51, 56],
			BFourth = [oneFourthNoteValue].concat(B);

		var G = [47, 52],
			GFourth = [oneFourthNoteValue].concat(G);

		var mainTheme = [
			AFourth,
			AFourth,
			AEighth,
			CEighth,
			EFourth,
			AFourth,
			AFourth,

			FFourth,
			FFourth,
			FEighth,
			AEighth,
			CFourth,
			FFourth,
			FFourth,

			DFourth,
			DFourth,
			DEighth,
			FEighth,
			AFourth,
			DFourth,
			DFourth
		];

		var bridge1 = [
			CFourth,
			AFourth,
			CFourth,
			EHalf
		];

		var bridge2 = [
			CFourth,
			BFourth,
			GFourth,
			AHalf
		];

		var track = mainTheme
			.concat(bridge1)
			.concat(mainTheme)
			.concat(bridge2);

		GAME.bkgSound = GAME.createSound(track, "square", true, 2);

		GAME.hitSound = GAME.createSound([
			[oneEighthNoteValue, 25]
		], "square", false, 1);

		GAME.hitSound.freeze();

		var canvas = document.getElementById("game"),
			  context = canvas.getContext("2d");

		context.imageSmoothingEnabled = false;
		context.scale(GAME.settings.scale, GAME.settings.scale);

		GAME.start(context);
	});
})(GAME);
