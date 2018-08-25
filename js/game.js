var game = {
	// 开始初始化对象，预加载资源，并显示开始画面
	init: function () {
		// 获取游戏画布及绘图环境的引用
		game.canvas = document.getElementById("gamecanvas");
		game.context = game.canvas.getContext("2d");

		// 初始化对象
		levels.init();
		loader.init();
		mouse.init();

		// 隐藏所有的游戏图层，显示开始画面
		game.hideScreens();
		game.showScreen("gamestartscreen");
	},

	hideScreens: function () {
		var screens = document.getElementsByClassName("gamelayer");

		// 迭代所有游戏图层并将其显示设置为无
		for (let i = screens.length - 1; i >= 0; i--) {
			var screen = screens[i];

			screen.style.display = "none";
		}
	},

	hideScreen: function (id) {
		var screen = document.getElementById(id);

		screen.style.display = "none";
	},

	showScreen: function (id) {
		var screen = document.getElementById(id);

		screen.style.display = "block";
	},

	showLevelScreen: function () {
		game.hideScreens();
		game.showScreen("levelselectscreen");
	},

	// 存储当前游戏状态 - intro, wait-for-firing, firing, fired, load-next-hero, success, failure 
	mode: "intro",

	// X & Y 弹弓的坐标 
	slingshotX: 140,
	slingshotY: 280,

	// X & Y 带子附着在弹弓上的点的坐标 
	slingshotBandX: 140 + 55,
	slingshotBandY: 280 + 23,

	// 标记以检查游戏是否已结束 
	ended: false,

	// 比赛得分 
	score: 0,

	// X 用于从左到右平移屏幕的轴偏移 
	offsetLeft: 0,

	start: function () {
		game.hideScreens();

		// 显示游戏画布和分数 
		game.showScreen("gamecanvas");
		game.showScreen("scorescreen");

		game.mode = "intro";
		game.currentHero = undefined;

		game.offsetLeft = 0;
		game.ended = false;

		game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);

	},

	// 画面最大平移速度，单位为像素每帧
	maxSpeed: 3,

	// 画面中心移动到newCenter
	// (或者至少尽可能接近)
	panTo: function (newCenter) {

		// 最小和最大平移偏移量
		var minOffset = 0;
		var maxOffset = game.currentLevel.backgroundImage.width - game.canvas.width;

		// 屏幕的当前中心是左侧偏移的屏幕宽度的一半
		var currentCenter = game.offsetLeft + game.canvas.width / 2;

		// 如果新中心和当前中心之间的距离> 0且我们没有平移到最小和最大偏移限制，请保持平移
		if (Math.abs(newCenter - currentCenter) > 0 && game.offsetLeft <= maxOffset && game.offsetLeft >= minOffset) {
			//我们将在每个tick中从newCenter到currentCenter的距离减半
			//这将允许缓和
			var deltaX = (newCenter - currentCenter) / 2;

			//但是如果delta X真的很高，屏幕会过快播放，所以如果它大于maxSpeed
			if (Math.abs(deltaX) > game.maxSpeed) {
				// Limit delta x to game.maxSpeed (并保持delta X的标志)
				deltaX = game.maxSpeed * Math.sign(deltaX);
			}

			// 如果我们几乎达到了目标，那么就转到这个结果
			if (Math.abs(deltaX) <= 1) {
				deltaX = (newCenter - currentCenter);
			}

			// 最后将调整后的deltaX添加到offsetX，以便我们按deltaX移动屏幕
			game.offsetLeft += deltaX;

			// 并确保我们不超过最小或最大限制
			if (game.offsetLeft <= minOffset) {
				game.offsetLeft = minOffset;

				// 让调用函数知道我们已尽可能接近newCenter
				return true;
			} else if (game.offsetLeft >= maxOffset) {
				game.offsetLeft = maxOffset;

				// 让调用函数知道我们已尽可能接近newCenter
				return true;
			}

		} else {
			// 让调用函数知道我们已尽可能接近newCenter
			return true;
		}
	},

	handleGameLogic: function () {
		if (game.mode === "intro") {
			if (game.panTo(700)) {
				game.mode = "load-next-hero";
			}
		}

		if (game.mode === "wait-for-firing") {
			if (mouse.dragging) {
				game.panTo(mouse.x + game.offsetLeft);
			} else {
				game.panTo(game.slingshotX);
			}
		}

		if (game.mode === "load-next-hero") {
			//首先计算英雄和敌人并填充各自的数组
			//检查是否还有活着的敌人，如果没有，则结束等级（成功）
			//检查是否还有其他英雄要加载，如果没有结束关卡（失败）
			//加载英雄并将模式设置为等待射击
			game.mode = "wait-for-firing";
		}

		if (game.mode === "firing") {
			//如果鼠标按钮关闭，请允许英雄被拖动并瞄准
			//如果没有，将英雄射向空中
		}

		if (game.mode === "fired") {
			//当他飞过时，平移到当前英雄的位置
			//等到英雄停止移动或超出范围
		}


		if (game.mode === "level-success" || game.mode === "level-failure") {
			//首先平移到左边
			//然后将游戏显示为已结束并显示结束屏幕
		}

	},

	animate: function () {

		// 处理平移，游戏状态和控制流程 
		game.handleGameLogic();

		//使用视差滚动绘制背景 
		//首先绘制背景图像，偏移offsetLeft一小部分距离（1/4） 
		//分数越大，背景越接近 
		game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft / 4, 0, game.canvas.width, game.canvas.height, 0, 0, game.canvas.width, game.canvas.height);
		// 然后绘制前景图像，偏移整个offsetLeft距离 
		game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, game.canvas.width, game.canvas.height, 0, 0, game.canvas.width, game.canvas.height);


		// 绘制弹弓的底部，偏移整个offsetLeft距离 
		game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);

		// 画出弹弓的前部，偏移整个offsetLeft距离 
		game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);

		if (!game.ended) {
			game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
		}
	},
};

var levels = {
	// 关卡数据
	data: [{   // 第一关
		foreground: "desert-foreground",
		background: "clouds-background",
		entities: []
	}, {   // 第二关
		foreground: "desert-foreground",
		background: "clouds-background",
		entities: []
	}],

	// 初始化关卡选择画面
	init: function () {
		var levelSelectScreen = document.getElementById("levelselectscreen");

		// 单机按钮时加载关卡
		var buttonClickHandler = function () {
			game.hideScreen("levelselectscreen");

			// Level label values are 1, 2. Levels are 0, 1
			levels.load(this.value - 1);
		};


		for (let i = 0; i < levels.data.length; i++) {
			var button = document.createElement("input");

			button.type = "button";
			button.value = (i + 1); // Level labels are 1, 2
			button.addEventListener("click", buttonClickHandler);

			levelSelectScreen.appendChild(button);
		}

	},

	// 为某一关加载所有的数据和图像
	load: function (number) {
		// 声明一个新的当前关卡对象 
		game.currentLevel = { number: number };
		game.score = 0;

		document.getElementById("score").innerHTML = "Score: " + game.score;
		var level = levels.data[number];

		// 加载背景、前景和弹弓图像 
		game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
		game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
		game.slingshotImage = loader.loadImage("images/slingshot.png");
		game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");

		// 一旦所有的图像加载完成，就调用game.start()函数 
		loader.onload = game.start;
	}
};

var loader = {
	loaded: true,
	loadedCount: 0, // 已加载的资源数 
	totalCount: 0, // 需要被加载的资源总数 

	init: function () {
		// 检查浏览器支持的声音格式 
		var mp3Support, oggSupport;
		var audio = document.createElement("audio");

		if (audio.canPlayType) {
			// 当前canPlayType()方法返回""、"maybe"或"probably" 
			mp3Support = "" !== audio.canPlayType("audio/mpeg");
			oggSupport = "" !== audio.canPlayType("audio/ogg; codecs=\"vorbis\"");
		} else {
			// audio标签不被支持 
			mp3Support = false;
			oggSupport = false;
		}

		// 检查ogg、mp3,如果都不支持，就将soundFileExtn设置为undefined 
		loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
	},

	loadImage: function (url) {
		this.loaded = false;
		this.totalCount++;

		game.showScreen("loadingscreen");

		var image = new Image();

		image.addEventListener("load", loader.itemLoaded, false);
		image.src = url;

		return image;
	},

	soundFileExtn: ".ogg",

	loadSound: function (url) {
		this.loaded = false;
		this.totalCount++;

		game.showScreen("loadingscreen");

		var audio = new Audio();

		audio.addEventListener("canplaythrough", loader.itemLoaded, false);
		audio.src = url + loader.soundFileExtn;

		return audio;
	},

	itemLoaded: function (ev) {
		// Stop listening for event type (load or canplaythrough) for this item now that it has been loaded 
		ev.target.removeEventListener(ev.type, loader.itemLoaded, false);

		loader.loadedCount++;

		document.getElementById("loadingmessage").innerHTML = "Loaded " + loader.loadedCount + " of " + loader.totalCount;

		if (loader.loadedCount === loader.totalCount) {
			// Loader has loaded completely.. 
			// Reset and clear the loader 
			loader.loaded = true;
			loader.loadedCount = 0;
			loader.totalCount = 0;

			// Hide the loading screen 
			game.hideScreen("loadingscreen");

			// and call the loader.onload method if it exists 
			if (loader.onload) {
				loader.onload();
				loader.onload = undefined;
			}
		}
	}
};

var mouse = {
	x: 0,
	y: 0,
	down: false,
	dragging: false,

	init: function () {
		var canvas = document.getElementById("gamecanvas");

		canvas.addEventListener("mousemove", mouse.mousemovehandler, false);
		canvas.addEventListener("mousedown", mouse.mousedownhandler, false);
		canvas.addEventListener("mouseup", mouse.mouseuphandler, false);
		canvas.addEventListener("mouseout", mouse.mouseuphandler, false);
	},

	mousemovehandler: function (ev) {
		var offset = game.canvas.getBoundingClientRect();

		mouse.x = ev.clientX - offset.left;
		mouse.y = ev.clientY - offset.top;

		if (mouse.down) {
			mouse.dragging = true;
		}

		ev.preventDefault();
	},

	mousedownhandler: function (ev) {
		mouse.down = true;

		ev.preventDefault();
	},

	mouseuphandler: function (ev) {
		mouse.down = false;
		mouse.dragging = false;

		ev.preventDefault();
	}
};

// 页面完全加载后初始化游戏
window.addEventListener("load", function () {
	game.init();
});