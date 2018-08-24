(function(GAME) {
	var sprite48x48 = 48;

	function getIdleSprite(name) {
		return {
			name: name,
			width: sprite48x48,
			height: sprite48x48,
			frameCount: 4,
			fps: 2
		}
	}

	function getWalkSprite(name) {
		return {
			name: name,
			width: sprite48x48,
			height: sprite48x48,
			frameCount: 2,
			fps: 4
		};
	}

	function getHitSprite(name) {
		return {
			name: name,
			width: 64,
			height: 48,
			frameCount: 1,
			fps: 1
		};
	}

	GAME.loadAssets([
		getIdleSprite("blueFighterIdle"),
		getWalkSprite("blueFighterWalk"),
		getHitSprite("blueFighterHit"),
		getIdleSprite("redFighterIdle"),
		getWalkSprite("redFighterWalk"),
		getHitSprite("redFighterHit")
	], function() {
		GAME.createObject({
			objectName: "blueFighter",
			defaultAsset: GAME.assets.blueFighterIdle,
			loop: true,
			x: 0,
			y: 0
		}, function(fighter) {
			fighter.defaultRestoreHitDelay = GAME.settings.FPS;
			fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
			fighter.damage = 10;
			fighter.balance = 100;
			fighter.speed = 1;
			fighter.keys = {
				forward: [68],
				back: [65],
				hit: [83]
			};
		});

		GAME.createObject({
			objectName: "redFighter",
			defaultAsset: GAME.assets.redFighterIdle,
			loop: true,
			x: 100,
			y: 0
		}, function(fighter) {
			fighter.defaultRestoreHitDelay = GAME.settings.FPS;
			fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
			fighter.damage = 10;
			fighter.balance = 100;
			fighter.speed = 1;
			fighter.keys = {
				forward: [74],
				back: [76],
				hit: [75]
			};
		});

		GAME.start();
	});
})(GAME);