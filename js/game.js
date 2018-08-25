var game = {
	// 开始初始化对象，预加载资源，并显示开始画面
	init: function () {
		// 获取游戏画布及绘图环境的引用
		game.canvas = document.getElementById("gamecanvas");
		game.context = game.canvas.getContext("2d");

		// 初始化对象
		levels.init();
		loader.init();

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

// 页面完全加载后初始化游戏
window.addEventListener("load", function () {
	game.init();
});