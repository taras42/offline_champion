(function(GAME) {

	GAME.updateRedrawCycle = function(context, delta) {
		GAME.clearScreen(context);

		GAME.updateObjects(context, delta);

		GAME.drawObjects(context, delta);

		GAME.updateSound(delta);

		GAME.drawStaticLine(context);
		GAME.drawLifeBars(context);
		GAME.drawGameOver(context);
		GAME.drawLevel(context);
		GAME.drawPause(context);
		GAME.drawGameInfo(context);
	}

	GAME.start = function(context) {
		var then = Date.now();

		function step() {
			var now =  Date.now(),
				frameDelay = now - then;

			delta = frameDelay/GAME.settings.frameDelay;

			GAME.updateRedrawCycle(context, delta);

		  	then = now;

			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	};
})(GAME);
