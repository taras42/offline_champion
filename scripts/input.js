(function(GAME) {
	var body = document.body;

	GAME.input = {
		keys: {}
	};

	body.addEventListener("keydown", function(e) {
		GAME.input.keys[e.which] = true;
	});

	body.addEventListener("keyup", function(e) {
		GAME.input.keys[e.which] = false;
	});
})(GAME);
