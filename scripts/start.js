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
		var bIdle = GAME.assets.blueFighterIdle,
			rIdle = GAME.assets.redFighterIdle;

		GAME.createObject({
			objectName: "blueFighter",
			defaultAsset: bIdle,
			loop: true,
			x: 0,
			y: 0
		}, function(fighter) {
			fighter.idleA = bIdle;
			fighter.walkA = GAME.assets.blueFighterWalk;
			fighter.hitA = GAME.assets.blueFighterHit;
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
			defaultAsset: rIdle,
			loop: true,
			x: 100,
			y: 0
		}, function(fighter) {
			fighter.idleA = rIdle;
			fighter.walkA = GAME.assets.redFighterWalk;
			fighter.hitA = GAME.assets.redFighterHit;
			fighter.defaultRestoreHitDelay = GAME.settings.FPS;
			fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
			fighter.damage = 10;
			fighter.balance = 100;
			fighter.speed = 1;
			fighter.keys = {
				forward: [76],
				back: [74],
				hit: [75]
			};
		});

		GAME.start();
	});
})(GAME);