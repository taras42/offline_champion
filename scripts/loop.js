(function(GAME) {

	GAME.update = function(context, delta) {
		GAME.updateObjects(context, delta);
	}

	GAME.redraw = function(context) {
		GAME.clearScreen(context);

		GAME.drawObjects(context);
		GAME.drawStaticLine(context);
		GAME.drawLifeBars(context);
		GAME.drawGameOver(context);
		GAME.drawLevel(context);
		GAME.drawPause(context);
		GAME.drawGameInfo(context);
	}

	GAME.start = function(context) {
		var then = Date.now(),
			delta = 0;

		function step() {
			var now =  Date.now(),
				frameDelay = GAME.settings.frameDelay;

			delta += now - then;

			while(delta >= frameDelay) {
				GAME.update(context);
				GAME.playSound();

				delta -= frameDelay;
			}

			GAME.redraw(context);

	  	then = now;

			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	};
})(GAME);
