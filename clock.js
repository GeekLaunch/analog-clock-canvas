let canvas, ctx;

//https://stackoverflow.com/questions/29675279/how-to-style-canvas-elements-with-css


/* Function to get information from CSS into Canvas:
   - An div element is created and added to the DOM.
   - The CSS information of the element is saved to an array and available for the canvas.
   - After that, the element is removed from the DOM again.
*/

// "Cache"
var classProperties = {};
function getPropeties(className){
	if (true === classProperties[className]) {
		return classProperties[className];
	}

	// Create an element with the class name and add it to the DOM
	let element = document.createElement('div');
	element.style.display = 'none;'
	//element.classList.add(className);
	element.setAttribute('id', className);
	document.body.appendChild(element);
	
	// Get needed stuff from the DOM and put it in the cache
	let compStyles = window.getComputedStyle(element);
	// create font like '18px Noto Sans'
	let font = (canvas.width / 16)+"px "+compStyles.fontFamily.slice(1,-1);
	classProperties[className] = {
		fill: compStyles.backgroundColor,
		lineWidth: compStyles.fontSize,
		stroke: compStyles.borderColor,
		second: compStyles.outlineColor,
		color: compStyles.color,
		font: font
	}
	// Remove the element from the DOM again
	element.remove();
	return classProperties[className];
}

function draw () {
	
	let time = (function () {
		let midnight = new Date();
		midnight.setHours(0);
		midnight.setMinutes(0);
		midnight.setSeconds(0);
		midnight.setMilliseconds(0);
		return Date.now() - midnight.getTime();
	})(),
	
	hours = time / (60 * 60 * 1000),
	minutes = hours * 60 % 60,
	seconds = Math.round(minutes * 60 % 60),
	
	c = {x: canvas.width / 2, y: canvas.height / 2};
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineCap = 'round';

	background();
	hourHand();
	minuteHand();
	secondHand();
	face();

	function background() {
		// Background
		ctx_bgr.beginPath();
		ctx_bgr.arc(c.x, c.y, canvas.width / 2 - canvas.width / 60, 0, Math.PI * 2);
		ctx_bgr.fillStyle = classProperties.clockface.fill;
		ctx_bgr.fill();
	}

	function face () {
		
		// Border
		let lwf = canvas.width / 300;
		ctx.lineWidth = lwf;
		ctx.strokeStyle = classProperties.clockface.stroke;
		ctx.beginPath();
		let rf = canvas.width / 2 - canvas.width / 60;
		ctx.arc(c.x, c.y, rf, 0, Math.PI * 2);
		ctx.stroke();
		
		// Dashes
		ctx.lineWidth = lwf;
		for (let i = 0; i < 60; i++) {
			let l = canvas.width / 80,
				r = rf - l;
			ctx.strokeStyle = classProperties.clockface.stroke;
			if (i % 5 === 0)
				l *= 2.5,
				r = rf - l,
				ctx.strokeStyle = classProperties.clockface.stroke;
			let v = new Vector(r, Math.PI * 2 * (i / 60) - Math.PI / 2);
			ctx.beginPath();
			ctx.moveTo(v.getX() + c.x, v.getY() + c.y);
			v.setMag(r + l);
			ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
			ctx.stroke();
		}

		// Numbers
		ctx.font = classProperties.clockface.font;
		ctx.fillStyle = classProperties.clockface.color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (let i = 1; i <= 12; i++) {
			let v = new Vector(rf - canvas.width / 14, Math.PI * 2 * (i / 12) - Math.PI / 2);
			ctx.fillText(i, v.getX() + c.x, v.getY() + c.y);
		}

		// Center button
		ctx.beginPath();
		ctx.arc(c.x, c.y, canvas.width / 130, 0, Math.PI * 2);
		ctx.fillStyle = classProperties.clockface.fill;
		ctx.strokeStyle = classProperties.clockface.second;
		ctx.lineWidth = canvas.width / 180;
		ctx.fill();
		ctx.stroke();	

	}

	function secondHand () {
		ctx.lineWidth = canvas.width / 200;
		ctx.strokeStyle = classProperties.clockface.second;
		ctx.beginPath();
		let a = Math.PI * 2 * (seconds / 60) - Math.PI / 2;
		let v = new Vector(canvas.width / 2 - canvas.width / 6, a);
		let v2 = new Vector(-canvas.width / 20, a);
		ctx.moveTo(v2.getX() + c.x, v2.getY() + c.y);
		ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
		ctx.stroke();
	}

	function minuteHand () {
		ctx.lineWidth = canvas.width / 75;
		ctx.strokeStyle = classProperties.clockface.stroke;
		ctx.beginPath();
		let a = Math.PI * 2 * (minutes / 60) - Math.PI / 2;
		let v = new Vector(canvas.width / 2 - canvas.width / 6, a);
		ctx.moveTo(c.x, c.y);
		ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
		ctx.stroke();
	}

	function hourHand () {
		ctx.lineWidth = canvas.width / 75;
		ctx.strokeStyle = classProperties.clockface.stroke;
		ctx.beginPath();
		let a = Math.PI * 2 * (hours / 12) - Math.PI / 2;
		let v = new Vector(canvas.width / 2 - canvas.width / 3.5, a);
		ctx.moveTo(c.x, c.y);
		ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
		ctx.stroke();
	}
}

function init () {
	canvas = document.getElementById('clock');
	canvas_bgr = document.getElementById('clock-background');
	
	ctx = canvas.getContext('2d');
	ctx_bgr = canvas_bgr.getContext('2d');
	
	let canvasCSS = window.getComputedStyle(clock);		// get current width of clock element in px, because CSS defined with 100% so that it is flexible to screensize
	let blocksize = canvasCSS.width.slice(0, -2);		// create out of canvas.width 1080px a string 1080
	canvas.width = canvas.height = blocksize;			// define canvas size based on current size of clock element shown on screen
	canvas_bgr.width = canvas_bgr.height = blocksize;
	getPropeties('clockface');							// get CSS properties for canvas
	
	setInterval(draw, 1000);							// draw the clock every second
}

init();