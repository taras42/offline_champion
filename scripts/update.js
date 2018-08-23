(function(GAME) {

	function doesFighterWalk(object, direction) {
		return object.keys[direction].find(function(key) {
			return GAME.input.keys[key];
		});
	}

	function updateFighterPosition(fighter, context, delta) {
		var canvasWidth = context.canvas.clientWidth,
			scaleX = GAME.settings.scale.x;

		var forward = doesFighterWalk(fighter, "forward"),
			back = doesFighterWalk(fighter, "back"),
			walks = forward || back,
			currentAsset = fighter.currentAsset.asset,
			walkAsset = GAME.assets.blueFighterWalk,
			idleAsset = GAME.assets.blueFighterIdle,
			speed,
			xBoundary,
			x;

		if (walks) {
			if (currentAsset !== walkAsset) {
				fighter.setAsset(walkAsset, true);
			}

			speed = fighter.speed * delta;

			if (forward) {
				x = fighter.x + speed;
			} else if (back) {
				x = fighter.x - speed;
			}

			xBoundary = (x * scaleX) + (currentAsset.width * scaleX);

			if (xBoundary > canvasWidth || x < 0) {
				x = fighter.x;	
			}

			fighter.x = x;
		} else if (currentAsset !== idleAsset) {
			fighter.setAsset(idleAsset, true);
		}
	}

	GAME.updateObjects = function(context, delta) {
		var blueFighter = GAME.objects.blueFighter;

		updateFighterPosition(blueFighter, context, delta);
	};
})(GAME);