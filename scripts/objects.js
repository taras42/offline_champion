(function(GAME) {
	var objectAssets = {
		idle: "idle",
		walk: "walk"
	};

	GAME.objects = {};
	GAME.objectAssets = objectAssets;
	GAME.objectSkipFrameCount = {};

	GAME.createObject = function(options, decorate) {
		var objectName = options.objectName;

		GAME.objects[objectName] = {
			x: options.x,
			y: options.y,
			assets: options.assets,
			currentAsset: {
				loop: options.loop,
				frameIndex: 0,
				asset: options.defaultAsset
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

		decorate && decorate(GAME.objects[objectName]);
	};
})(GAME);