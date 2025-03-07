var you = new player(new vector(0, 0), {"ArrowUp":"up"}); // Make player

var baba = new game(__BUILTIN_STAGES.concat(_USER_STAGES), 0, you, __DEFAULT_COLOR_PROFILE); // Make game

setTimeout(()=>{ // Display color profile
	Object.keys(baba.colorprofile).forEach((v, i)=>{
		document.getElementById(v).style.backgroundColor = baba.colorprofile[v];

	});
}, 5); // Changed to 5; it sometimes didn't run in time.

setInterval(()=>{ // Set up render thread
	baba.render(document.getElementById("main"));
}, 100);

setInterval(()=>{
	baba.stage = baba.stages[baba.stagenum];
})

document.onkeydown = (e)=>{ // Trap arrow keys (to stop scrolling)
	e = e || window.event;
	if(e.keyCode >= 37 && e.keyCode <= 40){
		return false;
	}
};
