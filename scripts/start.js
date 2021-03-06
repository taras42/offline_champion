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

	function getCrowdSprite(name) {
		return {
			name: name,
			width: 256,
			height: 50,
			frameCount: 2,
			fps: 1
		}
	}

	GAME.loadAssets([
		getIdleSprite("blueFighterIdle"),
		getWalkSprite("blueFighterWalk"),
		getHitSprite("blueFighterHit"),
		getIdleSprite("redFighterIdle"),
		getWalkSprite("redFighterWalk"),
		getHitSprite("redFighterHit"),
		getCrowdSprite("crowd")
	], function() {
		var bIdle = GAME.assets.blueFighterIdle,
				rIdle = GAME.assets.redFighterIdle;

		GAME.createObject({
			objectName: "crowd",
			defaultAsset: GAME.assets.crowd,
			loop: true,
			x: 0,
			y: 94,
			z: 3
		});

		GAME.createBlueFighter = function() {
			GAME.createObject({
				objectName: "blueFighter",
				defaultAsset: bIdle,
				loop: true,
				x: 25,
				y: 35,
				z: 1
			}, function(fighter) {
				fighter.color = "#008BB8";
				fighter.lifeSegX = 6;
				fighter.idleA = bIdle;
				fighter.walkA = GAME.assets.blueFighterWalk;
				fighter.hitA = GAME.assets.blueFighterHit;
				fighter.defaultRestoreHitDelay = GAME.settings.FPS;
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.damage = 10;
				fighter.life = GAME.gameplay.fightersBaseLife;
				fighter.speed = 1;
				fighter.keys = {
					forward: ["KeyD"],
					back: ["KeyA", "KeyQ"],
					hit: ["KeyS"]
				};
			});
		}

		GAME.createRedFighter = function() {
			GAME.createObject({
				objectName: "redFighter",
				defaultAsset: rIdle,
				loop: true,
				x: 183,
				y: 35,
				z: 2
			}, function(fighter) {
				fighter.color = "#FC4E51";
				fighter.lifeSegX = 247;
				fighter.idleA = rIdle;
				fighter.walkA = GAME.assets.redFighterWalk;
				fighter.hitA = GAME.assets.redFighterHit;
				fighter.defaultRestoreHitDelay = GAME.settings.FPS;
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.damage = 10;
				fighter.life = GAME.gameplay.fightersBaseLife;
				fighter.speed = 1;
				fighter.keys = {
					forward: ["ArrowRight"],
					back: ["ArrowLeft"],
					hit: ["ArrowDown"]
				};
			});
		}

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

		var fontSufix = "px monospace",
				textAlignCenter = "center",
				screenCenterX = 128;

		GAME.staticObjects.gameOver = {
			t: "OFFLINE",
			tW: "OFFLINE CHAMPION",
			tL: "YOU ARE OFFLINE",
			tA: textAlignCenter,
			f: 16 + fontSufix,
			x: screenCenterX,
			y: 72
		};

		GAME.staticObjects.level = {
			t: "LEVEL",
			tM: "FIGHT",
			color: darkViolet,
			tA: textAlignCenter,
			f: 8 + fontSufix,
			x: screenCenterX,
			y: 11
		};

		GAME.staticObjects.pause = {
			t: "PAUSE",
			color: darkViolet,
			tA: textAlignCenter,
			f: 16 + fontSufix,
			x: screenCenterX,
			y: 72
		};

		GAME.staticObjects.gameInfo = {
			lines: [
				{t: "press '1' for singleplayer", x: screenCenterX, y: 18},
				{t: "press '2' for multiplayer", x: screenCenterX, y: 26},
				{t: "controls:", x: screenCenterX, y: 40},
				{t: "1st player: A(Q),S,D", x: screenCenterX, y: 52},
				{t: "2nd player: arrow keys", x: screenCenterX, y: 60},
				{t: "volume: I,O", x: screenCenterX, y: 68},
				{t: "pause: P", x: screenCenterX, y: 76},
				{t: "rules:", x: screenCenterX, y: 94},
				{t: "both players are standing 'online'", x: screenCenterX, y: 102},
				{t: "to win knock the other player 'offline'!", x: screenCenterX, y: 110},
			],
			color: darkViolet,
			tA: textAlignCenter,
			f: 6 + fontSufix,
		};

		GAME.gameplay = {
			fightersBaseLife: 100,
			hitFreeze: 1.5,
			walkCollisionMod: 6
		};

		GAME.AI = {
			missChance: 70,
			currentMissChance: 70,
			missChanceStep: 10,
			hitAdditionalSteps: 0
		};

		GAME.state = {
			level: 1,
			maxLevel: 5,
			modeSelected: null,
			mode: {
				1: ["Digit1", "Numpad1"],
				2: ["Digit2", "Numpad2"]
			},
			gamePaused: false,
			pauseKey: ["KeyP"],
			isSinglePlayer: function() {
				return this.modeSelected === 1;
			},
			isMultiPlayer: function() {
				return this.modeSelected === 2;
			},
			init: function() {
				GAME.createBlueFighter();
				GAME.createRedFighter();

				if (this.isSinglePlayer()) {
					GAME.AI.currentMissChance = GAME.AI.currentMissChance - GAME.AI.missChanceStep * this.level;
					GAME.objects.redFighter.life = GAME.gameplay.fightersBaseLife + this.level * 10;
				}
			}
		};

		GAME.sound = {
			volumeStep: 0.001,
			keys: {
				up: ["KeyO"],
				down: ["KeyI"]
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

		GAME.state.init();
		GAME.start(context);
	});
})(GAME);
