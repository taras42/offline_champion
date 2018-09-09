(function(GAME) {

	function renderLifeBar(x, color, segmentsCount, lifeSeg, context, invert) {
		var gap = lifeSeg.gap,
			width = lifeSeg.w,
			height = lifeSeg.h,
			y = lifeSeg.y;

		for (var i = 0; i < segmentsCount; i++) {
			context.fillStyle = color;
			context.fillRect(x, y, width, height);

			x = invert ? x - width - gap : x + width + gap;
		}
	}

	function drawText(text, font, style, textAlign, x, y, context) {
		context.font = font;
		context.fillStyle = style;
		context.textAlign = textAlign;
		context.fillText(text, x, y);
	}

	GAME.drawGameOver = function(context) {
		var gameOver = GAME.staticObjects.gameOver,
			isMaxLevel = GAME.state.level === GAME.state.maxLevel,
			offlineFighter = GAME.state.offlineFighter,
			blueFighter = GAME.objects.blueFighter,
			redFighter = GAME.objects.redFighter,
			bluePlayerLooses = offlineFighter === blueFighter,
			redPlayerLooses = offlineFighter === redFighter,
			isSinglePlayer = GAME.state.isSinglePlayer();

		if (GAME.state.over) {
			if (isSinglePlayer && isMaxLevel && redPlayerLooses) {
				drawText(gameOver.tW, gameOver.f, blueFighter.color,
					gameOver.tA, gameOver.x, gameOver.y, context);
			} else if (isSinglePlayer && bluePlayerLooses) {
				drawText(gameOver.tL, gameOver.f, redFighter.color,
					gameOver.tA, gameOver.x, gameOver.y, context);
			} else {
				drawText(gameOver.t, gameOver.f, offlineFighter.color,
					gameOver.tA, gameOver.x, gameOver.y, context);
			}
		}
	}

	GAME.drawLevel = function(context) {
		var level = GAME.staticObjects.level;

		if (GAME.state.isSinglePlayer()) {
			drawText(level.t + " " + GAME.state.level, level.f, level.color,
				level.tA, level.x, level.y, context);
		} else if (GAME.state.isMultiPlayer()) {
			drawText(level.tM, level.f, level.color,
				level.tA, level.x, level.y, context);
		}
	}

	GAME.drawPause = function(context) {
		var pause = GAME.staticObjects.pause;

		if (GAME.state.gamePaused) {
			drawText(pause.t, pause.f, pause.color,
				pause.tA, pause.x, pause.y, context);
		}
	}

	GAME.drawGameInfo = function(context) {
		var gameInfo = GAME.staticObjects.gameInfo;

		if (!GAME.state.modeSelected) {
			gameInfo.lines.forEach(function(line) {
				drawText(line.t, gameInfo.f, gameInfo.color,
					gameInfo.tA, line.x, line.y, context);
			});
		}
	}

	GAME.clearScreen = function(context) {
		context.clearRect(0, 0, GAME.settings.res.x, GAME.settings.res.y);
	};

	GAME.drawStaticLine = function(context) {
		var line = GAME.staticObjects.line,
			x1 = line.x1,
			x2 = line.x2,
			y = line.y;

		context.beginPath();
		context.moveTo(x1, y);
		context.lineTo(x2, y);
		context.strokeStyle = line.color;
		context.stroke();
	};

	GAME.drawLifeBars = function(context) {
		var blueFighter = GAME.objects.blueFighter,
			redFighter = GAME.objects.redFighter,
			lifeSeg = GAME.staticObjects.lifeSeg;

		renderLifeBar(blueFighter.lifeSegX, blueFighter.color, blueFighter.life/lifeSeg.q, lifeSeg, context);
		renderLifeBar(redFighter.lifeSegX, redFighter.color, redFighter.life/lifeSeg.q, lifeSeg, context, true);
	};

	GAME.drawObject = function(object, context) {
		var assetObject = object.currentAsset,
			asset = assetObject.asset;

		context.drawImage(assetObject.asset.spriteSheet,
			0, assetObject.frameIndex * asset.height,
			asset.width, asset.height,
			object.x, object.y,
			asset.width, asset.height
		);
	}

	GAME.drawObjects = function(context) {
		Object.values(GAME.objects).sort(function(a, b) {
			return a.z - b.z;
		}).forEach(function(object) {
			GAME.drawObject(object, context);
		});
	}
})(GAME);
