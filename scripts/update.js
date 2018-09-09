(function(GAME) {

	function isKeyPressedPredicate(key) {
		return GAME.input.keys[key];
	}

	function doesFighterWalkInDirection(fighter, direction) {
		return fighter.keys[direction].find(isKeyPressedPredicate);
	}

	function isSoundVolumeChanged(direction) {
		return GAME.sound.keys[direction].find(isKeyPressedPredicate);
	}

	function isPlayerModeSeleted(mode) {
		return GAME.state.mode[mode].find(isKeyPressedPredicate);
	}

	function doesFighterHit(fighter) {
		return !fighter.cooldown && !fighter.stunned && fighter.keys.hit.find(isKeyPressedPredicate);
	}

	function doesFighterWalk(fighter) {
		var afterHitFrozen = fighter.cooldown && isFighterHitFrozen(fighter);

		return {
			forward: !afterHitFrozen && doesFighterWalkInDirection(fighter, "forward"),
			back: !afterHitFrozen && doesFighterWalkInDirection(fighter, "back")
		}
	}

	function doesAIHit(redFighter, blueFighter, redFighterWalkState) {
			var redFighterInHitState = {
					currentAsset: redFighter.currentAsset,
					damage: redFighter.damage,
					x: redFighter.x - getRedFighterHitPosDelta(redFighter)
			},
			hitChance;

			if (redFighterWalkState.back && !GAME.AI.currentHitChance) {
				GAME.AI.hitChance = Math.floor(Math.random() * 100);
			}

			if (!redFighter.cooldown && !redFighter.stunned) {
				if (doesFighterHitsOpponent(redFighterInHitState, blueFighter, true)) {
					redFighter.cooldown = true;
					hitChance = GAME.AI.hitChance;
					GAME.AI.hitChance = null;

					return hitChance > GAME.AI.missChance;
				}
			}
	}

	function doesAIWalk(redFighter, doesFighterHit) {
		var forward,
				back,
				hitDelay;

		if (!doesFighterHit) {
				if (redFighter.cooldown) {
						back = !isFighterHitFrozen(redFighter);
				} else if (redFighter.stunned) {
						back = true;
				} else {
						forward = true;
				}
		}

		return {
			forward: back,
			back: forward
		}
	}

	function isFighterHitFrozen(fighter) {
		return fighter.defaultRestoreHitDelay/fighter.restoreHitDelay <= GAME.gameplay.hitFreeze;
	}

	function setLoopedFighterAssetIfNotAlreadySet(fighter, asset) {
		if (fighter.currentAsset.asset !== asset) {
			fighter.setAsset(asset, true);
		}
	}

	function getRedFighterHitPosDelta(redFighter) {
			return redFighter.hitA.width - redFighter.idleA.width;
	}

	function doesFighterHitsOpponent(fighter1, fighter2, inverseDirection) {
		var fighter1Asset = fighter1.currentAsset.asset,
			fighter2Asset = fighter2.currentAsset.asset,
			fighter2HalfWidthCoordinate = fighter2.x + fighter2Asset.width/2;

		if (inverseDirection) {
			return fighter1.x < fighter2HalfWidthCoordinate;
		} else {
			return fighter1.x + fighter1Asset.width > fighter2HalfWidthCoordinate;
		}
	}

	function setFightersStateAfterHit(fighter1, fighter2, hitsOpponent) {
		fighter1.cooldown = true;

		if (hitsOpponent && fighter2.life > 0) {
				fighter2.stunned = true;
				fighter2.life -= fighter1.damage;
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

				setLoopedFighterAssetIfNotAlreadySet(fighter, fighter.idleA);

				resetFighterXToPrevX(fighter);
			}
		}
	}

	function getFighterNextPosition(fighter, walkState, context, delta) {
		var forward = walkState.forward,
			back = walkState.back,
			walks = doesFighterWalkForwardOrBack(walkState),
			currentAsset = fighter.currentAsset.asset,
			speed,
			x = fighter.x;

		if (walks) {
			resetFighterXToPrevX(fighter);

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
		}

		return x;
	};

	function doesFighterWalkForwardOrBack(walkState) {
		return walkState.forward || walkState.back;
	}

	function updateFightersPosition(leftFighter, rightFighter, leftFighterPos, rightFighterPos) {
		var leftFighterA = leftFighter.currentAsset.asset,
			leftFighterAWidth = leftFighterA.width,
			rightFighter2A = rightFighter.currentAsset.asset,
			collisionMod = GAME.gameplay.walkCollisionMod;

		var leftFighterBoundary = leftFighterPos + leftFighterAWidth - leftFighterAWidth/collisionMod,
			rightFighterBoundary = rightFighterPos + rightFighter2A.width/collisionMod;

		if (leftFighterBoundary < rightFighterBoundary) {
			leftFighter.x = leftFighterPos;
		}

		if (rightFighterBoundary > leftFighterBoundary) {
			rightFighter.x = rightFighterPos;
		}
	}

	function setFighterNotHitAsset(fighter, walkState) {
		var currentAsset = fighter.currentAsset.asset;

		if (doesFighterWalkForwardOrBack(walkState)) {
			setLoopedFighterAssetIfNotAlreadySet(fighter, fighter.walkA);
		} else if (currentAsset === fighter.walkA || (fighter.cooldown && !isFighterHitFrozen(fighter))) {
			resetFighterXToPrevX(fighter);
			setLoopedFighterAssetIfNotAlreadySet(fighter, fighter.idleA);
		}
	}

	function updateFightersState(blueFighter, redFighter, context, delta) {
		var blueFighterHits = doesFighterHit(blueFighter),
				blueFighterWalkState = doesFighterWalk(blueFighter),
				redFighterHits,
				redFighterWalkState,
				hitsOpponent;

		if (GAME.state.modeSelected === 1) {
				redFighterWalkState = doesAIWalk(redFighter, redFighterHits);
				redFighterHits = doesAIHit(redFighter, blueFighter, redFighterWalkState);
		} else {
				redFighterHits = doesFighterHit(redFighter);
				redFighterWalkState = doesFighterWalk(redFighter);
		}

		var blueFighterNextPosition = getFighterNextPosition(blueFighter, blueFighterWalkState, context, delta),
				redFighterNextPosition = getFighterNextPosition(redFighter, redFighterWalkState, context, delta);

		if (blueFighterHits) {
			blueFighter.setAsset(blueFighter.hitA, true);

			hitsOpponent = doesFighterHitsOpponent(blueFighter, redFighter);

			setFightersStateAfterHit(blueFighter, redFighter, hitsOpponent);

			GAME.hitSound.unfreeze();
		} else if (redFighterHits) {
			if (redFighter.currentAsset.asset !== redFighter.hitA) {
				redFighter.setAsset(redFighter.hitA, true);
				redFighter.prevX = redFighter.x;

				redFighter.x -= getRedFighterHitPosDelta(redFighter);
			}

			hitsOpponent = doesFighterHitsOpponent(redFighter, blueFighter, true);

			setFightersStateAfterHit(redFighter, blueFighter, hitsOpponent);
			GAME.hitSound.unfreeze();
		} else {
			updateFightersPosition(blueFighter, redFighter,
				blueFighterNextPosition, redFighterNextPosition);

				setFighterNotHitAsset(blueFighter, blueFighterWalkState);
				setFighterNotHitAsset(redFighter, redFighterWalkState);
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
			if (offlineFighter.y < GAME.settings.res.y) {
					offlineFighter.y += offlineFighter.speed * delta;
			} else {
					GAME.reset();
			}
		}
	}

	GAME.updateSound = function(delta) {
		var isVolumeUp = isSoundVolumeChanged("up"),
			isVolumeDown = isSoundVolumeChanged("down"),
			volumeStep = GAME.sound.volumeStep;

		if (isVolumeUp) {
			GAME.changeVolume(volumeStep);
		} else if (isVolumeDown) {
			GAME.changeVolume(volumeStep * -1);
		}

		GAME.hitSound.play(delta);
		GAME.bkgSound.play(delta);
	}

	GAME.reset = function() {
		GAME.state.over = false;

		GAME.createBlueFighter();
		GAME.createRedFighter();
	}

	function selectMode() {
		if (isPlayerModeSeleted(1)) {
			GAME.state.modeSelected = 1;
			GAME.reset();
		} else if (isPlayerModeSeleted(2)) {
			GAME.state.modeSelected = 2;
			GAME.reset();
		}
	}

	GAME.updateObjects = function(context, delta) {
		var blueFighter = GAME.objects.blueFighter,
				redFighter = GAME.objects.redFighter;

		selectMode(context, delta);

		if (GAME.state.modeSelected &&  !GAME.state.over) {
				updateFightersState(blueFighter, redFighter, context, delta);
		}

		updateGameState(blueFighter, redFighter, context, delta);
	};
})(GAME);
