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

			asset.spriteSheet = image;

			GAME.assets[asset.name] = asset;
		}
	};
})(GAME);
