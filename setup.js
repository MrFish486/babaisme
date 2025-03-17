var __VERSIONS = []

var you = new player(new vector(0, 0), {}); // Make player

var baba = new game(__BUILTIN_STAGES.concat(_USER_STAGES), 0, you, __DEFAULT_COLOR_PROFILE); // Make game

var __GRID = false;

__UNDO = ()=>{
	if(__VERSIONS.length != 0){
		let e = __VERSIONS.pop();
		baba.stage.map = e.map;
		baba.player.under = e.under;
		return true;
	}else{
		return false;
	}
}

__LoadObjects() // It... Well... Loads the objects.

/*
setTimeout(()=>{ // Display color profile, NO LONGER IN USE
	Object.keys(baba.colorprofile).forEach((v, i)=>{
		document.getElementById(v).style.backgroundColor = baba.colorprofile[v];

	});
}, 5); // Changed to 5; it sometimes didn't run in time.
*/

// Stage specific setup
baba.stages[1].pushable.splice(baba.stages[1].pushable.indexOf("baba"), 1); // Remove "baba" from pushable (on level where baba is win)

document.addEventListener("keydown", e=>{
	if(e.code == "KeyG"){
		__GRID = true;
	}
});

document.addEventListener("keyup", e=>{
	if(e.code == "KeyG"){
		__GRID = false;
	}
});

setInterval(()=>{ // Set up render thread
	baba.checkwin();
	baba.render(document.getElementById("main"));
	document.getElementById("level.name").innerHTML = baba.stage.name;
}, 100);

setInterval(()=>{ // Constantly switch to current stage
	if(baba.stage != baba.stages[baba.stagenum]){
		baba.stage = baba.stages[baba.stagenum];
		__VERSIONS = [];
	}
});

document.onkeydown = (e)=>{ // Trap arrow keys (to stop scrolling)
	e = e || window.event;
	if(e.keyCode >= 37 && e.keyCode <= 40){
		return false;
	}
};

//Handle controls
setTimeout(()=>{
	document.getElementById("next").onclick = ()=>{
		if(baba.stagenum == baba.stages.length - 1){
			return 1;
		}
		baba.player.removeeventlistener();
		baba.player = new player(new vector(0, 0), {});
		baba.player.parent_ = baba;
		baba.stagenum++;
	}
	document.getElementById("prev").onclick = ()=>{
		if(baba.stagenum == 0){
			return 1;
		}
		baba.player.removeeventlistener();
		baba.player = new player(new vector(0, 0), {});
		baba.player.parent_ = baba;
		baba.stagenum--;
		return 0;
	}
	document.getElementById("upld").onchange = ()=>{
		parseFile(document.getElementById("upld").files[0]).then(e=>{
			let p = JSON.parse(e[0]);
			baba.stages[-1] = new stage(p.map, p.mat, p.name);
			baba.stagenum = -1;
		});
	}
	document.getElementById("music").hidden = true;
}, 5);

setInterval(()=>{
	if(baba.lookupprop("text:loop").includes("text:game")){
		baba.tick({"code":"gameisloop"});
	}
},1000) // Setup "game is loop" thread

playmusic = ()=>{
	document.getElementById("music").children[0] = ["./audio/music/baba.wav", "./audio.music/keke.wav"][Math.floor(Math.random())];
	document.getElementById("music").play();
}
