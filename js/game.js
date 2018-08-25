var game = {
	// 开始初始化对象，预加载资源，并显示开始画面
	init: function () {
		// 获取游戏画布及绘图环境的引用
		game.canvas = document.getElementById("gamecanvas");
		game.context = game.canvas.getContext("2d");

		// 初始化对象
		levels.init();

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

// 页面完全加载后初始化游戏
window.addEventListener("load", function () {
	game.init();
});