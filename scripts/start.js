(function(GAME) {
	GAME.loadAssets([{
		name: "fighterIdle",
		width: 48,
		height: 48,
		frameCount: 4,
		fps: 3
	}], function(result) {

		GAME.createObject("fighter", GAME.objectAssets.idle, true, 0, 0, {
			idle: GAME.assets.fighterIdle
		});

		GAME.start();
	});
})(GAME);