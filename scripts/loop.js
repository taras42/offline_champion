(function(GAME) {

	GAME.clearObject = function(object, context) {
		var asset = object.getAsset().asset;
		context.clearRect(object.x, object.y, asset.width, asset.height);
	}

	GAME.updateRedrawCycle = function(context, delta) {
		var objectKeys = Object.keys(GAME.objects);

		objectKeys.forEach(function(key) {
			GAME.updateObject(key, delta);
		});

		objectKeys.forEach(function(key) {
			GAME.drawObject(key, context, delta);
		});
	}

	GAME.updateObject = function(objectKey, delta) {};

	GAME.drawObject = function(objectKey, context, delta) {
		var object = GAME.objects[objectKey];

		GAME.clearObject(object, context);

		var assetObject = object.getAsset(),
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
			0, 0, 
			asset.width, asset.height
		);

		GAME.objectSkipFrameCount[objectKey] += delta;
	}

	GAME.start = function() {
		var canvas = document.getElementById("game"),
			context = canvas.getContext("2d");

		context.imageSmoothingEnabled = false;
		context.scale(4, 4);

		var then = Date.now();

		function step() {
			var now =  Date.now(),
				frameDelay = now - then;

			delta = Math.round(frameDelay/GAME.settings.frameDelay);	

			GAME.updateRedrawCycle(context, delta);

		  	then = now;
		  
			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	};
})(GAME);

