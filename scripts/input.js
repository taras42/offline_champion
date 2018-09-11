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

	function getKey(e) {
		return e.code;
	}

	body.addEventListener("keydown", function(e) {
		GAME.input.keys[getKey(e)] = true;
	});

	body.addEventListener("keyup", function(e) {
		GAME.input.keys[getKey(e)] = false;
	});
})(GAME);
