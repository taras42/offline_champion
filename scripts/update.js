(function(GAME) {

	function doesFighterWalkInDirection(fighter, direction) {
		return GAME.input.isKeyPressed(fighter.keys[direction]);
	}

	function isPlayerModeSeleted(mode) {
		return GAME.input.isKeyPressed(GAME.state.mode[mode]);
	}

	function isPauseKeyPressed() {
		return GAME.input.isKeyPressed(GAME.state.pauseKey);
	}

	function doesFighterHit(fighter) {
		return !fighter.cooldown && !fighter.stunned && GAME.input.isKeyPressed(fighter.keys.hit);
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
						+ (GAME.AI.hitAdditionalSteps * redFighter.speed)
			},
			hitChance;

			if (redFighterWalkState.back && !GAME.AI.currentHitChance) {
				GAME.AI.hitChance = Math.floor(Math.random() * 100);
			}

			if (!redFighter.cooldown && !redFighter.stunned) {
				if (doFightersCollide(redFighterInHitState, blueFighter, true)) {
					redFighter.cooldown = true;
					hitChance = GAME.AI.hitChance;
					GAME.AI.hitChance = null;

					return hitChance > GAME.AI.currentMissChance;
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

	function doFightersCollide(fighter1, fighter2, inverseDirection) {
		var fighter1Asset = fighter1.currentAsset.asset,
			fighter2Asset = fighter2.currentAsset.asset,
			fighter2HalfWidthCoordinate = fighter2.x + fighter2Asset.width/2;

			if (inverseDirection) {
				return fighter1.x < fighter2HalfWidthCoordinate;
			} else {
				return fighter1.x + fighter1Asset.width > fighter2HalfWidthCoordinate;
			}
	}

	function doesFighterHitsOpponent(fighter1, fighter2, inverseDirection) {
		var fighter2Asset = fighter2.currentAsset.asset;

		return (fighter2Asset !== fighter2.hitA)
			&& doFightersCollide(fighter1, fighter2, inverseDirection);
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

	function getFighterNextPosition(fighter, walkState, context) {
		var forward = walkState.forward,
			back = walkState.back,
			walks = doesFighterWalkForwardOrBack(walkState),
			currentAsset = fighter.currentAsset.asset,
			speed = fighter.speed,
			x = fighter.x;

		if (walks) {
			resetFighterXToPrevX(fighter);

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

	function updateFightersState(blueFighter, redFighter, context) {
		var blueFighterHits = doesFighterHit(blueFighter),
				blueFighterWalkState = doesFighterWalk(blueFighter),
				redFighterHits,
				redFighterWalkState,
				hitsOpponent;

		if (GAME.state.isSinglePlayer()) {
				redFighterWalkState = doesAIWalk(redFighter, redFighterHits);
				redFighterHits = doesAIHit(redFighter, blueFighter, redFighterWalkState);
		} else {
				redFighterHits = doesFighterHit(redFighter);
				redFighterWalkState = doesFighterWalk(redFighter);
		}

		var blueFighterNextPosition = getFighterNextPosition(blueFighter, blueFighterWalkState, context),
				redFighterNextPosition = getFighterNextPosition(redFighter, redFighterWalkState, context);

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

	function updateGameState(blueFighter, redFighter, context) {
		var offlineFighter;

		if (blueFighter.life <= 0) {
				GAME.state.over = true
				offlineFighter = blueFighter;
		} else if (redFighter.life <= 0) {
				GAME.state.over = true;
				offlineFighter = redFighter;
		}

		var redFighterLost = offlineFighter === redFighter;

		GAME.state.offlineFighter = offlineFighter;

		if (offlineFighter) {
			if (offlineFighter.y < GAME.settings.res.y) {
					offlineFighter.y += offlineFighter.speed;
			} else {
					GAME.state.over = false;
					GAME.state.offlineFighter = false;
					resetFightersPosition();
					switchAILevel(redFighterLost);
			}
		}
	}

	function updateObjectsAssetFrame() {
		Object.values(GAME.objects).forEach(function(object) {
			var assetObject = object.currentAsset,
				asset = assetObject.asset,
				assetFPS = asset.fps,
				assetFrameCount = asset.frameCount - 1;

			var assetFrameIndex = assetObject.frameIndex,
				assetFrameDelay = Math.round(GAME.settings.FPS / assetFPS);

			if (object.skipFrameCount >= assetFrameDelay) {
				if (assetFrameIndex < assetFrameCount) {
					assetFrameIndex = assetFrameIndex + 1;
				} else if (assetObject.loop) {
					assetFrameIndex = 0;
				}

				object.nextFrame(assetFrameIndex);
				object.skipFrameCount = 1;
			}

			object.skipFrameCount += 1;
		});
	}

	function switchAILevel(redFighterLost) {
		var level = GAME.state.level;

		if (GAME.state.isSinglePlayer()) {
			level += 1;

			if ((level <= GAME.state.maxLevel) && redFighterLost) {
				GAME.state.level = level;
				GAME.objects.redFighter.life = GAME.gameplay.fightersBaseLife + level * 10;
				GAME.AI.currentMissChance -= GAME.AI.missChanceStep;
			} else {
				reset();
			}
		}
	}

	function pauseUnpauseGame() {
		if (isPauseKeyPressed() && GAME.state.modeSelected) {
			if (GAME.state.pauseKeyUnpressed) {
				GAME.state.pauseKeyUnpressed = false;
				GAME.state.gamePaused = !GAME.state.gamePaused;
			}
	 	} else {
		 	GAME.state.pauseKeyUnpressed = true;
	 	}
	}

	function resetFightersPosition() {
		GAME.createBlueFighter();
		GAME.createRedFighter();
	}

	function reset() {
		GAME.state.over = false;
		GAME.state.level = 1;
		GAME.state.modeSelected = false;
		GAME.state.gamePaused = false;
		GAME.AI.currentMissChance = GAME.AI.missChance;

		resetFightersPosition();
	};

	function selectMode() {
		if (isPlayerModeSeleted(1)) {
			reset();
			GAME.state.modeSelected = 1;
		} else if (isPlayerModeSeleted(2)) {
			reset();
			GAME.state.modeSelected = 2;
		}
	}

	GAME.updateObjects = function(context) {
		var blueFighter = GAME.objects.blueFighter,
				redFighter = GAME.objects.redFighter;

		pauseUnpauseGame();

		if (!GAME.state.gamePaused) {
			selectMode(context);

			if (GAME.state.modeSelected &&  !GAME.state.over) {
					updateFightersState(blueFighter, redFighter, context);
			}

			updateGameState(blueFighter, redFighter, context);
		}

		updateObjectsAssetFrame();
	};
})(GAME);
