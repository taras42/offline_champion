(function(GAME) {

	GAME.clearObject = function(objectKey, context) {
		var object = GAME.objects[objectKey],
		asset = object.currentAsset.asset;

		context.clearRect(object.x, object.y, asset.width, asset.height);
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