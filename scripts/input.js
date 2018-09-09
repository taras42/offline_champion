(function(GAME) {
	var body = document.body;

	GAME.input = {
		keys: {}
	};

	GAME.input.isKeyPressed = function(keys) {
		return keys.find(function(key) {
			return GAME.input.keys[key];
		});
	}

	body.addEventListener("keydown", function(e) {
		GAME.input.keys[e.which] = true;
	});

	body.addEventListener("keyup", function(e) {
		GAME.input.keys[e.which] = false;
	});
})(GAME);
