(function(GAME) {

	GAME.updateRedrawCycle = function(context, delta) {
		var objectKeys = Object.keys(GAME.objects);

		GAME.updateObjects(delta);

		objectKeys.forEach(function(key) {
			GAME.clearObject(key, context);
			GAME.drawObject(key, context, delta);
		});
	}

	GAME.start = function() {
		var canvas = document.getElementById("game"),
			context = canvas.getContext("2d");

		context.imageSmoothingEnabled = false;
		context.scale(5, 5);

		var then = Date.now();

		function step() {
			var now =  Date.now(),
				frameDelay = now - then;

			delta = Math.round(frameDelay/GAME.settings.frameDelay);	

			GAME.updateRedrawCycle(context, delta);

		  	then = now;
		  
			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	};
})(GAME);

