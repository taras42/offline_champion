(function(GAME) {
	GAME.loadAssets([{
		name: "fighterIdleRight",
		width: 48,
		height: 48,
		frameCount: 4,
		fps: 3
	}], function() {

		GAME.createObject("fighter", GAME.objectAssets.idle, true, 0, 0, {
			idle: GAME.assets.fighterIdleRight
		});

		GAME.start();
	});
})(GAME);