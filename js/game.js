var game = {
	// 开始初始化对象，预加载资源，并显示开始画面
	init: function () {
		// 获取游戏画布及绘图环境的引用
		game.canvas = document.getElementById("gamecanvas");
		game.context = game.canvas.getContext("2d");

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
}

// 页面完全加载后初始化游戏
window.addEventListener("load", function () {
	game.init();
});