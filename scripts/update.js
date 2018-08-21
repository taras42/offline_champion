(function(GAME) {

	function doesFighterWalk(object, direction) {
		return object.keys[direction].find(function(key) {
			return GAME.input.keys[key];
		});
	}

	GAME.updateObject = function(objectKey, delta) {
		var object = GAME.objects[objectKey];

		if (object === GAME.objects.fighter) {
			var forward = doesFighterWalk(object, "forward"),
				back = doesFighterWalk(object, "back"),
				walks = forward || back,
				currentAsset = object.currentAsset.asset,
				speed;

			if (walks) {
				if (currentAsset !== GAME.objectAssets.walk) {
					object.setAsset(GAME.objectAssets.walk, true);
				}

				speed = object.speed * delta;

				if (forward) {
					object.x += speed;
				} else if (back) {
					object.x -= speed;
				}
			} else if (currentAsset !== GAME.objectAssets.idle) {
				object.setAsset(GAME.objectAssets.idle, true);
			}
		}
	};
})(GAME);