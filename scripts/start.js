(function(GAME) {
	var spriteSize = 48;

	GAME.loadAssets([
		{
			name: "blueFighterIdle",
			width: spriteSize,
			height: spriteSize,
			frameCount: 4,
			fps: 2
		},
		{
			name: "blueFighterWalk",
			width: spriteSize,
			height: spriteSize,
			frameCount: 2,
			fps: 4
		}
	], function() {
		GAME.createObject({
			objectName: "blueFighter",
			defaultAsset: GAME.assets.blueFighterIdle,
			loop: true,
			x: 0,
			y: 0
		}, function(fighter) {
			fighter.speed = 1;
			fighter.keys = {
				forward: [68],
				back: [65]
			};
		});

		GAME.start();
	});
})(GAME);