(function(GAME) {

	GAME.updateRedrawCycle = function(context, delta) {
		var objectKeys = Object.keys(GAME.objects);

		objectKeys.forEach(function(key) {
			var object = GAME.objects[key],
				asset = object.currentAsset.asset;

			GAME.clearRect(object.x, object.y, asset.width, asset.height, context);
		});

		GAME.updateObjects(context, delta);

		objectKeys.forEach(function(key) {
			GAME.drawObject(key, context, delta);
		});

		GAME.drawStaticLine(context);
	}

	GAME.start = function(context) {
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

