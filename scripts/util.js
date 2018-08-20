(function(GAME) {

	GAME.assets = {};

	GAME.loadAssets = function(assets, callback) {
		var i,
			asset,
			image,
			imagePath,
			count = assets.length,
			loadedCount = 0;

		var onload = function() { 
			loadedCount = loadedCount + 1;

			if (loadedCount === count) {
				callback(); 
			}
		};

		for (i = 0; i < count; i++) {
			asset = assets[i];

			image = new Image();
			image.src = "assets/" + asset.name + ".png";
			image.addEventListener('load', onload);

			GAME.assets[asset.name] = {
				spriteSheet: image,
				width: asset.width,
				height: asset.height,
				frameCount: asset.frameCount,
				fps: asset.fps
			};
		}
	};

	var objectAssets = {
		idle: "idle"
	};

	GAME.objects = {};
	GAME.objectAssets = objectAssets;
	GAME.objectSkipFrameCount = {};

	GAME.createObject = function(objectName, defaultAsset, loop, x, y, assets) {
		GAME.objects[objectName] = {
			x: x,
			y: y,
			assets: assets,
			currentAsset: {
				loop: loop,
				frameIndex: 0,
				asset: defaultAsset
			},
			getAsset: function() {
				return {
					frameIndex: this.currentAsset.frameIndex,
					loop: this.currentAsset.loop,
					asset: this.assets[this.currentAsset.asset]
				}
			},
			nextFrame: function(frameIndex) {
				this.currentAsset.frameIndex = frameIndex;
			},
			setAsset: function(asset, loop) {
				this.currentAsset = {
					frameIndex: 0,
					loop: loop,
					asset: asset
				};
			}
		};

		GAME.objectSkipFrameCount[objectName] = 0;
	};
})(GAME);