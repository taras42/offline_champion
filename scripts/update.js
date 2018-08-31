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

	function getHitDamage(fighter1, fighter2, inverseFighters) {
		var fighter1Asset = fighter1.currentAsset.asset,
			fighter2Asset = fighter2.currentAsset.asset,
			damage;

		if (inverseFighters) {
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

	function resetFighterXToPrevX(fighter) {
		if (fighter.prevX) {
			fighter.x = fighter.prevX;
			delete fighter.prevX;
		}
	}

	function tryRestoreFighterHit(fighter) {
		var hasHitAsset = fighter.currentAsset.asset === fighter.hitA;

		if (fighter.cooldown || fighter.stunned || hasHitAsset) {
			fighter.restoreHitDelay -= 1;

			if (fighter.restoreHitDelay === 0) {
				fighter.restoreHitDelay = fighter.defaultRestoreHitDelay;
				fighter.cooldown = false;
				fighter.stunned = false;

				fighter.setAsset(fighter.idleA, true);
				resetFighterXToPrevX(fighter);
			}
		}
	}

	function getFighterNextPosition(fighter, walkState, context, delta) {
		var canvasWidth = context.canvas.clientWidth,
			scaleX = GAME.settings.scale;

		var forward = walkState.forward,
			back = walkState.back,
			walks = forward || back,
			currentAsset = fighter.currentAsset.asset,
			speed,
			xBoundary,
			x = fighter.x;

		if (walks) {
			if (currentAsset !== fighter.walkA) {
				fighter.setAsset(fighter.walkA, true);
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
		} else if (currentAsset === fighter.walkA) {
			resetFighterXToPrevX(fighter);
			fighter.setAsset(fighter.idleA, true);
		}

		return x;
	};

	function trySetFightersPosition(leftFighter, rightFighter, leftFighterPos, rightFighterPos) {
		var leftFighterA = leftFighter.currentAsset.asset,
			leftFighterAWidth = leftFighterA.width,
			rightFighter2A = rightFighter.currentAsset.asset;

		var leftFighterBoundary = leftFighterPos + leftFighterAWidth - leftFighterAWidth/6,
			rightFighterBoundary = rightFighterPos + rightFighter2A.width/6;

		if (leftFighterBoundary < rightFighterBoundary) {
			leftFighter.x = leftFighterPos;
		}

		if (rightFighterBoundary > leftFighterBoundary) {
			rightFighter.x = rightFighterPos;
		}
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

			blueFighter.setAsset(blueFighter.hitA, true);

			if (damage)  {
				setFightersStateAfterHit(blueFighter, redFighter, damage);
			}
		} else if (redFighterHits) {
			damage = getHitDamage(redFighter, blueFighter, true);

			redFighter.setAsset(redFighter.hitA, true);
			redFighter.prevX = redFighter.x;

			redFighter.x -= redFighter.hitA.width - redFighter.idleA.width;

			if (damage)  {
				setFightersStateAfterHit(redFighter, blueFighter, damage);
			}
		} else {
			trySetFightersPosition(blueFighter, redFighter, 
				blueFighterNextPosition, redFighterNextPosition);
		}

		tryRestoreFighterHit(blueFighter);
		tryRestoreFighterHit(redFighter);
	}

	GAME.updateObjects = function(context, delta) {
		var blueFighter = GAME.objects.blueFighter,
			redFighter = GAME.objects.redFighter;

		updateFightersState(blueFighter, redFighter, context, delta);
	};
})(GAME);