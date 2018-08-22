(function(GAME) {

	function doesFighterWalk(object, direction) {
		return object.keys[direction].find(function(key) {
			return GAME.input.keys[key];
		});
	}

	function updateFighterPosition(fighter, delta) {
		var forward = doesFighterWalk(fighter, "forward"),
			back = doesFighterWalk(fighter, "back"),
			walks = forward || back,
			currentAsset = fighter.currentAsset.asset,
			speed;

		if (walks) {
			if (currentAsset !== GAME.objectAssets.walk) {
				fighter.setAsset(GAME.objectAssets.walk, true);
			}

			speed = fighter.speed * delta;

			if (forward) {
				fighter.x += speed;
			} else if (back) {
				fighter.x -= speed;
			}
		} else if (currentAsset !== GAME.objectAssets.idle) {
			fighter.setAsset(GAME.objectAssets.idle, true);
		}
	}

	GAME.updateObjects = function(delta) {
		var blueFighter = GAME.objects.blueFighter;

		updateFighterPosition(blueFighter, delta);
	};
})(GAME);