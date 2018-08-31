(function(GAME) {

	function renderLifeBar(x, color, segmentsCount, lifeSeg, context, invert) {
		var gap = lifeSeg.gap,
			width = lifeSeg.w,
			height = lifeSeg.h,
			y = lifeSeg.y;

		var rectW = lifeSeg.q * (width + gap),
			rectX = invert ? x - rectW : x;

		GAME.clearRect(rectX, y, rectW, height, context);

		for (var i = 0; i < segmentsCount; i++) {
			context.fillStyle = color;
			context.fillRect(x, y, width, height);

			x = invert ? x - width - gap : x + width + gap;
		}
	}

	GAME.clearRect = function(x, y, width, height, context) {
		context.clearRect(x, y, width, height);
	};

	GAME.drawStaticLine = function(context) {
		var line = GAME.staticObjects.line,
			x1 = line.x1,
			x2 = line.x2,
			y = line.y;

		GAME.clearRect(x1, y, x2 - x1, line.h, context);

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

	GAME.drawObject = function(objectKey, context, delta) {
		var object = GAME.objects[objectKey];

		var assetObject = object.currentAsset,
			asset = assetObject.asset,
			assetFPS = asset.fps,
			assetFrameCount = asset.frameCount - 1;

		var assetFrameIndex = assetObject.frameIndex,
			assetFrameDelay = Math.round(GAME.settings.FPS / assetFPS);

		if (GAME.objectSkipFrameCount[objectKey] >= assetFrameDelay) {
			if (assetFrameIndex < assetFrameCount) {
				assetFrameIndex = assetFrameIndex + 1;
			} else if (assetObject.loop) {
				assetFrameIndex = 0;
			}

			object.nextFrame(assetFrameIndex);
			GAME.objectSkipFrameCount[objectKey] = 1;
		}

		context.drawImage(assetObject.asset.spriteSheet, 
			0, assetFrameIndex * asset.height, 
			asset.width, asset.height, 
			object.x, object.y, 
			asset.width, asset.height
		);

		GAME.objectSkipFrameCount[objectKey] += delta;
	}
})(GAME);