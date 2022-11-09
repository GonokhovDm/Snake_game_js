var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var countScore = 0;
var snake = {
	// Start coords
	x: 160,
	y: 160,
	// Snake speed
	speedX: grid,
	speedY: 0,
	// Tail movement
	cells: [],
	// Snake length
	maxCells: 4
};
var eat = {
	// Start coords
	x: 320,
	y: 320
}

// Get random
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
// Get radiobutton info
let radioBtns = document.querySelectorAll("input[name='level']");
// Choose dificult level
var findSelected = () => {
	var selected = document.querySelector("input[name='level']:checked").value;
	var result = 0;

	if (selected == "easy") {
		result = 10;
		return result;
	}
	if (selected == "normal") {
		result = 7;
		return result;
	}
	if (selected == "hard") {
		result = 4;
		return result;
	}
}

radioBtns.forEach(radioBtn => {
	radioBtn.addEventListener("change", findSelected);
});


// Game loop
function loop() {
	let requestId = requestAnimationFrame(loop);
	if (++count < findSelected()) {
		return;
	}

	count = 0;
	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Snake movement
	snake.x += snake.speedX;
	snake.y += snake.speedY;
	
	
	if (document.getElementById('checkbox-frame').checked) {
		// End canvas - horizontal moving from other side
		if (snake.x < 0) {
			// Stop animation
			cancelAnimationFrame(requestId);
			dieSnake();
		}
		else if (snake.x >= canvas.width) {
			// Stop animation
			cancelAnimationFrame(requestId);
			dieSnake();
		}
		// Some to vertical
		if (snake.y < 0) {
			// Stop animation
			cancelAnimationFrame(requestId);
			dieSnake();
		}
		else if (snake.y >= canvas.height) {
			// Stop animation
			cancelAnimationFrame(requestId);
			dieSnake();
		}
	} else {
		// End canvas - horizontal moving from other side
		if (snake.x < 0) {
			snake.x = canvas.width - grid;
		}
		else if (snake.x >= canvas.width) {
			snake.x = 0;
		}
		// Some to vertical
		if (snake.y < 0) {
			snake.y = canvas.height - grid;
		}
		else if (snake.y >= canvas.height) {
			snake.y = 0;
		}
	}

	// Moving
	snake.cells.unshift({ x: snake.x, y: snake.y });
	// Delete last snake element
	if (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}
	// Eat generate
	context.fillStyle = 'red';
	context.fillRect(eat.x, eat.y, grid - 1, grid - 1);

	context.fillStyle = 'pink';
	snake.cells.forEach(function (cell, index) {
		context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
		// If snake eating
		let countResult = document.getElementById('countResult');
		if (cell.x === eat.x && cell.y === eat.y) {
			snake.maxCells++;
			eat.x = getRandomInt(0, 25) * grid;
			eat.y = getRandomInt(0, 25) * grid;

			// Score counter
			countScore++;
			countResult.textContent = `${countScore}`;
		}
		// Check crush snake
		for (var i = index + 1; i < snake.cells.length; i++) {
			if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {				
				// Stop animation
				cancelAnimationFrame(requestId);
	
				dieSnake();
			}
		}
	});

	// Control moving
	document.addEventListener('keydown', function (e) {
		// Additional check horizontal moving
		// Left arrow button 
		if (e.which === 37 && snake.speedX === 0) {
			snake.speedX = -grid;
			snake.speedY = 0;
		}
		// Up arrow button
		if (e.which === 38 && snake.speedY === 0) {
			snake.speedY = -grid;
			snake.speedX = 0;
		}
		// Right arrow button
		if (e.which === 39 && snake.speedX === 0) {
			snake.speedX = grid;
			snake.speedY = 0;
		}
		// Down arrow button
		if (e.which === 40 && snake.speedY === 0) {
			snake.speedY = grid;
			snake.speedX = 0;
		}
	});
}

function dieSnake() {
	// Open dialog window
	document.getElementById('score-title').textContent = `Your score: ${countScore}`;
	document.getElementById('dialog-dark').open = true;
	
	newGame();
}

function newGame() {
	count = 0;
	// Null score counter
	countScore = 0;
	countResult.textContent = `${countScore}`;
	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// New snake
	// Start params
	snake.x = 160;
	snake.y = 160;
	snake.cells = [];
	snake.maxCells = 4;
	snake.dx = grid;
	snake.dy = 0;
	// Put the eat on canvas
	eat.x = getRandomInt(0, 25) * grid;
	eat.y = getRandomInt(0, 25) * grid;
}

// OnClick Functions
//Start
function startFunction() {
	requestAnimationFrame(loop);
	newGame();

	document.getElementById('radio-btn-1').disabled = true;
	document.getElementById('radio-btn-2').disabled = true;
	document.getElementById('radio-btn-3').disabled = true;

	document.getElementById('checkbox-frame').disabled = true;
}

// Try again dialog window
function tryAgainFunction() {
	newGame();
	// Start animation
	requestAnimationFrame(loop);
}

// Change level dialog window
function ChangeLevelFunction() {
	document.getElementById('radio-btn-1').disabled = false;
	document.getElementById('radio-btn-2').disabled = false;
	document.getElementById('radio-btn-3').disabled = false;

	document.getElementById('checkbox-frame').disabled = false;	
}