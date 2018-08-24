(function(GAME) {

	function isKeyPressedPredicate(key) {
		return GAME.input.keys[key];
	}

	function doesFighterWalkInDirection(fighter, direction) {
		return fighter.keys[direction].find(isKeyPressedPredicate);
	}

	function doesFighterHit(fighter) {
		return !fighter.cooldown 
			&& !fighter.stunned 
			&& fighter.keys.hit.find(isKeyPressedPredicate);
	}

	function doesFighterWalk(fighter) {
		return {
			forward: doesFighterWalkInDirection(fighter, "forward"),
			back: doesFighterWalkInDirection(fighter, "back")
		}
	}

	function getHitDamage(fighter1, fighter2, inverseDirection) {
		var fighter1Asset = fighter1.currentAsset.asset,
			fighter2Asset = fighter2.currentAsset.asset,
			damage;

		if (inverseDirection) {
			if (fighter2.x - fighter2Asset.width < fighter1.x + fighter1Asset.width/2) {
				return fighter2.damage;
			}
		} else {
			if (fighter1.x + fighter1Asset.width > fighter2.x + fighter2Asset.width/2) {
				return fighter1.damage;
			}
		}
	}

	function setFightersStateAfterHit(fighter1, fighter2, damage) {
		fighter1.cooldown = true;
		fighter2.stunned = true;
		fighter2.balance -= damage;
	}

	function tryRestoreFighterHit(fighter, asset, hitAsset) {
		var hasHitAsset = fighter.currentAsset.asset === hitAsset;

		if (fighter.cooldown || fighter.stunned || hasHitAsset) {
			fighter.restoreHitDelay -= 1;

			if (fighter.restoreHitDelay === 0) {
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.cooldown = false;
				fighter.stunned = false;

				fighter.setAsset(asset, true);
			}
		}
	}

	function getFighterNextPosition(fighter, walkState, context, delta) {
		var canvasWidth = context.canvas.clientWidth,
			scaleX = GAME.settings.scale.x;

		var forward = walkState.forward,
			back = walkState.back,
			walks = forward || back,
			currentAsset = fighter.currentAsset.asset,
			speed,
			xBoundary,
			x = fighter.x;

		if (walks) {
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
		}

		return x;
	};

	function trySetFighterPosition() {
		
	}

	function updateFightersState(blueFighter, redFighter, context, delta) {
		var blueFighterHits = doesFighterHit(blueFighter),
			redFighterHits = doesFighterHit(redFighter),
			damage;

		var blueFighterWalkState = doesFighterWalk(blueFighter),
			redFighterWalkState = doesFighterWalk(redFighter);

		var blueFighterNextPosition = getFighterNextPosition(blueFighter, blueFighterWalkState, context, delta),
			redFighterNextPosition = getFighterNextPosition(redFighter, redFighterWalkState, context, delta);

		if (blueFighterHits) {
			damage = getHitDamage(blueFighter, redFighter);

			blueFighter.setAsset(GAME.assets.blueFighterHit, true);

			if (damage)  {
				setFightersStateAfterHit(blueFighter, redFighter, damage);
			}
		} else {
			trySetFighterPosition();
		}

		if (redFighterHits) {
			damage = getHitDamage(redFighter, blueFighter, true);

			redFighter.setAsset(GAME.assets.redFighterHit, true);

			if (damage)  {
				setFightersStateAfterHit(redFighter, blueFighter, damage);
			}
		} else {
			trySetFighterPosition();
		}

		tryRestoreFighterHit(blueFighter, GAME.assets.blueFighterIdle, GAME.assets.blueFighterHit);
		tryRestoreFighterHit(redFighter, GAME.assets.redFighterIdle, GAME.assets.redFighterHit);
	}

	GAME.updateObjects = function(context, delta) {
		var blueFighter = GAME.objects.blueFighter,
			redFighter = GAME.objects.redFighter;

		updateFightersState(blueFighter, redFighter, context, delta);
	};
})(GAME);