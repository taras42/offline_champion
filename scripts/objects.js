(function(GAME) {
	
	GAME.objects = {};
	GAME.staticObjects = {};
	GAME.objectSkipFrameCount = {};

	GAME.createObject = function(options, decorate) {
		var objectName = options.objectName;

		GAME.objects[objectName] = {
			x: options.x,
			y: options.y,
			currentAsset: {
				loop: options.loop,
				frameIndex: 0,
				asset: options.defaultAsset
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