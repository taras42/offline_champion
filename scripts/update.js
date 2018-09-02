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
			fighter1Damage = fighter1.damage,
			fighter2HalfWidthCoordinate = fighter2.x + fighter2Asset.width/2,
			damage;

		if (inverseDirection) {
			if (fighter1.x < fighter2HalfWidthCoordinate) {
				return fighter1Damage;
			}
		} else if (fighter1.x + fighter1Asset.width > fighter2HalfWidthCoordinate) {
			return fighter1Damage;
		}
	}

	function setFightersStateAfterHit(fighter1, fighter2, damage) {
		fighter1.cooldown = true;
		fighter2.stunned = true;
		if (fighter2.life > 0) {
				fighter2.life -= damage;
		}
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
		var forward = walkState.forward,
			back = walkState.back,
			walks = forward || back,
			currentAsset = fighter.currentAsset.asset,
			speed,
			x = fighter.x;

		if (walks) {
			resetFighterXToPrevX(fighter);

			if (currentAsset !== fighter.walkA) {
				fighter.setAsset(fighter.walkA, true);
			}

			speed = fighter.speed * delta;

			if (forward) {
				x = fighter.x + speed;
			} else if (back) {
				x = fighter.x - speed;
			}

			if (x + currentAsset.width > GAME.settings.res.x || x < 0) {
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

			if (redFighter.currentAsset.asset !== redFighter.hitA) {
				redFighter.setAsset(redFighter.hitA, true);
				redFighter.prevX = redFighter.x;

				redFighter.x -= redFighter.hitA.width - redFighter.idleA.width;
			}

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

	function updateGameState(blueFighter, redFighter, context, delta) {
		var offlineFighter;

		if (blueFighter.life <= 0) {
				GAME.state.over = true
				offlineFighter = blueFighter;
		} else if (redFighter.life <= 0) {
				GAME.state.over = true;
				offlineFighter = redFighter;
		}

		GAME.state.offlineFighter = offlineFighter;

		if (offlineFighter) {
			//offlineFighter.y += offlineFighter.speed * delta;
		}
	}

	GAME.updateObjects = function(context, delta) {
		var blueFighter = GAME.objects.blueFighter,
				redFighter = GAME.objects.redFighter;

		if (!GAME.state.over) {
				updateFightersState(blueFighter, redFighter, context, delta);
		}

		updateGameState(blueFighter, redFighter, context, delta);
	};
})(GAME);
