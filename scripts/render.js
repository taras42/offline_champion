(function(GAME) {

	GAME.clearRect = function(x, y, width, height, context) {
		context.clearRect(x, y, width, height);
	}

	GAME.drawStaticLine = function(context) {
		var line = GAME.staticObjects.line,
			x1 = line.x1,
			x2 = line.x2,
			y = line.y;

		GAME.clearRect(x1, y, x2 - x1, line.height, context);

		context.beginPath();
		context.moveTo(x1, y);
		context.lineTo(x2, y);
		context.strokeStyle = line.color;
		context.stroke();
	}

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