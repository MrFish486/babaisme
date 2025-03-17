var __DEFAULT_COLOR_PROFILE = {"background" : "black", "text:baba" : "red", "text:is" : "white", "text:you" : "yellow", "water" : "blue", "wall" : "gray", "baba": "orange", "flag" : "lime", "text:stop" : "coral", "text:wall" : "brown", "text:win" : "aqua", "text:flag" : "yellowgreen", "unknown" : "green"}; // DISCONTINUED!!
var __MATERIALS = ["background", "baba", "flag", "lump", "text:baba", "text:flag", "text:is", "text:lump", "text:stop", "text:wall", "text:win", "text:you", "unknown", "wall", "water", "keke", "text:keke", "bababehindwall", "text:moveleft", "text:moveright", "pokey", "text:kill", "text:pokey", "text:push", "text:rock", "rock", "text:movedown", "text:moveup", "text:loop", "text:game", "text:sink", "text:water", "bababehindwater"];
var __MATERIAL_CACHE = {};

parseFile = (f)=> {
	return new Promise((resolve, reject)=>{
		let c = '';
		let r = new FileReader();
		r.onload = (e)=>{
			resolve(e.target.result.split("/\r\n|\n/"));
		};
		r.onerror = (e)=>{
			reject(e);
		}
		r.readAsText(f);
	});
}

__LoadObjects = ()=>{
	__MATERIALS.forEach((v, i)=>{
		let f = new Image();
		f.src = `./svg/${v}.svg`;
		__MATERIAL_CACHE[v] = f;
	})
};

__GetFile = n=>{
	var t;
	fetch(n).then(r=>r.text()).then(w=>t=w).catch(console.error);
	return t;
}
Object.prototype.reverse = (obj)=>{
	let n={};
	for(var key in obj){
		n[obj[key]] = key;
	}
	return n;
};
class request{
	constructor(orgin, dir){
		this.orgin = orgin;
		this.dir = dir;
	}
	apply(stage_){
		stage_.push(this.orgin.x, this.orgin.y, this.dir);
	}
}
class player{
	constructor(pos, controls){
		this.pos = pos;
		this.controls = controls;
		this.under = "background";
		/*this.pressed = {};
		Object.keys(this.controls).forEach((v, i)=>{
			document.addEventListener('keydown', (e)=>{
				if(e.code == v){
					this.pressed[controls[v]] = true;
				}
			})
		})
		Object.keys(this.controls).forEach((v, i)=>{
			document.addEventListener('keyup', (e)=>{
				if(e.code == v){
					this.pressed[controls[v]] = false;
				}
			current.map = p.map;
			current.materials = p.mat;
			})
		})*/ // We don't need to keep reading pressed keys
		this.listen = e=>{this.parent_.tick(e)}
		document.addEventListener('keydown', this.listen); // Because this.parent_ isn't defined yet.
	}
	removeeventlistener(){
		document.removeEventListener('keydown', this.listen);
	}
}
class game{
	constructor(stages, stagenum, player, colorprofile){
		// Note: babaisyou only ticks on player movement.
		this.stages = stages;
		this.player = player;
		this.player.parent_ = this;
		this.stagenum = stagenum;
		this.stage = stages[stagenum];
		this.colorprofile = colorprofile;
		this.definitions = {}; // Things such as {"baba":"you"}, list of things: "baba", "you", "flag", "wall", "text"
		this.__assignable = ["text:baba", "text:wall", "text:flag", "text:text", "text:lump", "text:keke", "text:pokey", "text:rock", "text:game", "text:water"];
		this.__assignto = ["text:you", "text:stop", "text:win", "text:moveleft", "text:moveright", "text:kill", "text:push", "text:movedown", "text:moveup", "text:loop", "text:sink"];
		this.__assignable.forEach((v, i)=>{
			this.definitions[v] = []
		})
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.__assignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x - 2, y));
						}
					}else if(this.stage.whatis(x + 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x + 2, y));
						}
					}else if(this.stage.whatis(x, y - 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x, y - 2));
						}
					}else if(this.stage.whatis(x, y + 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x, y + 2));
						}
					}
				}
			}
		}
		this.stage.dynamicPushable = [];
		Object.keys(this.definitions).forEach((v, i)=>{
			if(this.definitions[v].includes("text:push")){
				this.stage.dynamicPushable.push(v.split("text:")[1]);
			}
		});
	}
	render(canvas, debug = false){
		let c = canvas.getContext("2d");
		c.clearRect(0, 0, canvas.width, canvas.height);
		// To render : Background, Text, Water, Wall, Flag
		let xscale = canvas.width / this.stage.sizeframe.x;
		let yscale = canvas.height / this.stage.sizeframe.y;
		if(debug){console.log(`ys=${yscale},xs=${xscale}`)};
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(debug){console.log(`x=${x},y=${y},color=${this.colorprofile[this.stage.whatis(x, y)]},mat=${this.stage.whatis(x, y)}`)};
				if(this.stage.whatis(x, y) == "baba" && this.player.under == "wall"){
					c.drawImage(__MATERIAL_CACHE["bababehindwall"], y * yscale, x * xscale, xscale, yscale);
				}else if(this.stage.whatis(x, y) == "baba" && this.player.under == "water"){
					c.drawImage(__MATERIAL_CACHE["bababehindwater"], y * yscale, x * xscale, xscale, yscale);
				}else{
					c.drawImage(__MATERIAL_CACHE[this.stage.whatis(x, y)], y * yscale, x * xscale, xscale, yscale);
				}
				/*
					c.beginPath();
					c.rect(y * yscale, x * xscale, yscale, xscale);
					c.fillStyle = this.colorprofile[this.stage.whatis(x, y)];
					c.fill();
					c.closePath();
				*/
			}
		}
		if(__GRID){
			for(let x = 0; x < this.stage.sizeframe.x; x++){
				for(let y = 0; y < this.stage.sizeframe.y; y++){
					c.beginPath();
					c.rect(y * xscale, x * yscale, xscale, yscale);
					c.strokeStyle = "red";
					c.strokeWidth = 5;
					c.stroke();
					c.closePath();
				}
			}
		}
	}
	probe(){
		this.definitions = {};
		this.__assignable.forEach((v, i)=>{
			this.definitions[v] = []
		})
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.__assignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x - 2, y));
						}
					}else if(this.stage.whatis(x + 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x + 2, y));
						}
					}else if(this.stage.whatis(x, y - 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x, y - 2));
						}
					}else if(this.stage.whatis(x, y + 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)].push(this.stage.whatis(x, y + 2));
						}
					}
				}
			}
		}
		this.stage.solids = this.lookupprop("text:stop");
		this.stage.dynamicPushable = this.lookupprop("text:push").map(a=>a.split("text:")[1]);
	}
	isdef(prop, val){
		return this.definitions[prop].includes[val];
	}
	lookupprop(val){ // Returns a list of keys that include value
		let re = [];
		Object.keys(this.definitions).forEach((v, i)=>{
			if(this.definitions[v].includes(val)){
				re.push(v);
			}
		});
		return re;
	}
	tick(event_){ // Again, baba only ticks on moves.
		if(event_.code == "KeyZ"){
			if(__UNDO()){
				new Audio("./audio/sfx/pulselowhard.wav").play();
			}
			return;
		}else if(event_.code == "ArrowUp" || event_.code == "ArrowDown" || event_.code == "ArrowLeft" || event_.code == "ArrowRight"){
			__VERSIONS.push(JSON.parse(JSON.stringify({map : this.stage.map, under : this.player.under})));
		}
		baba.probe();
		let youexists = false;
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.lookupprop("text:you").includes("text:"+this.stage.whatis(x, y))){
					youexists = true;
					this.player.pos = new vector(x, y);
				}
			}

		}
		// Move the movey things
		if(event_.code != ""){
			let requests = []
			for(let x = 0; x < this.stage.sizeframe.x; x++){
				for(let y = 0; y < this.stage.sizeframe.y; y++){
					if(this.lookupprop("text:moveleft").includes("text:" + this.stage.whatis(x, y))){
						requests.push(new request(new vector(x, y), "l"));
					}else if(this.lookupprop("text:moveright").includes("text:" + this.stage.whatis(x, y))){
						requests.push(new request(new vector(x, y), "r"));
					}else if(this.lookupprop("text:movedown").includes("text:" + this.stage.whatis(x, y))){
						requests.push(new request(new vector(x, y), "d"));
					}else if(this.lookupprop("text:moveup").includes("text:" + this.stage.whatis(x, y))){
						requests.push(new request(new vector(x, y), "u"));
					}
				}
			}
			requests.forEach((v, i)=>{
				try{
					v.apply(this.stage);
				}catch{}
			});
		}
		// Handle pushing and moving tommorow (goodbye March 5th 2025)
		if(youexists && this.lookupprop("text:kill").includes("text:" + this.player.under)){
			new Audio("./audio/sfx/fail.wav").play();
			this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
			youexists = false;
			return;
		}else if(youexists && this.lookupprop("text:sink").includes("text:" + this.stage.whatis(this.player.pos.x, this.player.pos.y)) && this.player.under == "water"){
			new Audio("./audio/sfx/fail.wav").play();
			this.stage.set(this.player.pos.x, this.player.pos.y, "water")
			youexists = false;
			return;
		}
		if(youexists){
			if(event_.code == "ArrowUp" && this.player.pos.x != 0){
				new Audio("./audio/sfx/pulsehighsoft.wav").play();
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x - 1, this.player.pos.y, "u") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x - 1, this.player.pos.y);
						this.stage.set(this.player.pos.x - 1, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowDown" && this.player.pos.x != this.stage.sizeframe.x - 1){
				new Audio("./audio/sfx/pulsehighsoft.wav").play();
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x + 1, this.player.pos.y, "d") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x + 1, this.player.pos.y);
						this.stage.set(this.player.pos.x + 1, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowLeft" && this.player.pos.y != 0){
				new Audio("./audio/sfx/pulsehighsoft.wav").play();
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x, this.player.pos.y - 1, "l") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x, this.player.pos.y - 1);
						this.stage.set(this.player.pos.x, this.player.pos.y - 1, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowRight" && this.player.pos.y != this.stage.sizeframe.y - 1){ // It's 0-indexed!
				new Audio("./audio/sfx/pulsehighsoft.wav").play();
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x, this.player.pos.y + 1, "r") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x, this.player.pos.y + 1);
						this.stage.set(this.player.pos.x, this.player.pos.y + 1, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}
		}
	}
	checkwin(){
		this.tick({"code":""});
		if(this.stagenum == this.stages.length - 1){
			return 1;
		}
		if(this.lookupprop("text:win").includes("text:"+this.player.under)){
			new Audio("./audio/sfx/success.wav").play();
			this.player.removeeventlistener();
			this.player = new player(new vector(0, 0), {});
			this.player.parent_ = this;
			this.stagenum++;
		}else if(this.lookupprop("text:win").includes("text:" + this.stage.whatis(this.player.pos.x, this.player.pos.y))){
			new Audio("./audio/sfx/success.wav").play();
			this.player.removeeventlistener();
			this.player = new player(new vector(0, 0), {});
			this.player.parent_ = this;
			this.stagenum++;
		}
	}
}
class stage{
	constructor(map, materials, name){
		this.name = name;
		this.map = map;
		this.materials = materials;
		this.solids = [] // Definable
		this.pushable = ["text:baba", "text:is", "text:you", "text:flag", "text:water", "text:wall", "text:stop", "text:win", "text:lump", "text:keke", "text:moveleft", "text:moveright", "text:pokey", "text:kill", "text:rock", "text:push", "baba", "keke", "text:game", "text:loop", "text:sink"] // Static (NOTE: keke and baba are in here so that they don't cause keydown violations on ticks)
		this.dynamicPushable = [];
		this.solidsStatic = ["unknown"];
		this.lastpush = undefined;
		this.pushcount = 0;
		this.sizeframe = new vector(this.map.length, this.map[0].length);
		// material ids: "water", "wall", "flag", "text:baba", "text:is", "text:you"
	}
	sanitize(){
		for(let x = 0; x < this.sizeframe.x; x++){
			for(let y = 0; y < this.sizeframe.y; y++){
				this.map[x][y] = parseInt(this.map[x][y]);
			}
		}
	}
	whatis(x, y){
		try{
			if(this.materials[this.map[x][y]] == undefined){
				return "unknown";
			}
			return this.materials[this.map[x][y]];
		}catch{
			return "unknown";
		}
	}
	push(x, y, dir){
		// 1: hit wall, 2: it's solid! 5: success, 6: no / edge
		if((x <= -1 && dir == "u") || (x >= this.sizeframe.x && dir == "d") || (y <= -1 && dir == "l") || (y >= this.sizeframe.y && dir == "r")){ // Check for wall
			return 1;
		}
		//Here's an idea: First, try to trace a straight path from x,y to the edge. If there it hits unknown without finding any background, then it returns 2.
		if(this.solids.concat(this.solidsStatic).includes("text:" + this.whatis(x, y))){
			return 2;
		}
		if(this.pushable.concat(this.dynamicPushable).includes(this.whatis(x, y))){
			if(dir == "u"){
				if(this.whatis(x - 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x - 1, y, mat);
					return 5; // 5 means pushed.
				}else{
					if(this.push(x - 1, y, "u") == 5){
						this.push(x, y, "u");
						return 5;
					}else{
						return 1;
					}
				}
			}else if(dir == "d"){
				if(this.whatis(x + 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x + 1, y, mat);
					return 5;
				}else{
					if(this.push(x + 1, y, "d") == 5){
						this.push(x, y, "d");
						return 5;
					}else{
						return 1;
					}
				}
			}else if(dir == "l"){
				if(this.whatis(x, y - 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y - 1, mat);
					return 5;
				}else{
					if(this.push(x, y - 1, "l") == 5){
						this.push(x, y, "l");
						return 5;
					}else{
						return 1;
					}
				}
			}else if(dir == "r"){
				if(this.whatis(x, y + 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y + 1, mat);
					return 5;
				}else{
					if(this.push(x, y + 1, "r") == 5){
						this.push(x, y, "r")
						return 5;
					}else{
						return 1;
					}
				}
			}
			return 1;
		}
		return 5;
	}
	set(x, y, mat){
		this.map[x][y] = Object.reverse(this.materials)[mat];
	}
	replace(matfrom, matto){
		for(let x = 0;x < this.sizeframe.x;x++){
			for(let y = 0;y < this.sizeframe.y;y++){
				if(this.whatis(x, y) == matfrom){
					this.set(x, y, matto);
				}
			}
		}
	}
}
class vector{
	constructor(x, y){
		if(y == undefined){
			this.x = x[0];
			this.y = x[1];
		}else{
			this.x = x;
			this.y = y;
		}
	}
	add(vec){
		this.x += vec.x;
		this.y += vec.y;
	}
	sub(vec){
		this.x -= vec.x;
		this.y -= vec.y;
	}
	mul(vec){
		this.x *= vec.x;
		this.y *= vec.y;
	}
	div(vec){
		this.x /= vec.x;
		this.y /= vec.y;
	}
	op(vec, op){
		this.x = eval(`${this.x}${op}${vec.x}`)
		this.y = eval(`${this.y}${op}${vec.y}`)
		}
}
