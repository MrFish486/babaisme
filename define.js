var __DEFAULT_COLOR_PROFILE = {"background" : "black", "text:baba" : "red", "text:is" : "white", "text:you" : "yellow", "water" : "blue", "wall" : "gray", "baba": "orange", "flag" : "lime", "text:stop" : "coral", "text:wall" : "brown", "text:win" : "aqua", "text:flag" : "yellowgreen", "unknown" : "green" };
Object.prototype.reverse = (obj)=>{
	let n={};
	for(var key in obj){
		n[obj[key]] = key;
	}
	return n;
};
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
			})
		})*/ // We don't need to keep reading pressed keys
		this.listen = (e)=>{this.parent_.tick(e)}
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
		this.__assignable = ["text:baba", "text:wall", "text:flag", "text:text"];
		this.__assignto = ["text:you", "text:stop", "text:win"];
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
	}
	render(canvas, debug = false){
		let c = canvas.getContext("2d");
		c.clearRect(0, 0, 500, 500);
		// To render : Background, Text, Water, Wall, Flag
		let xscale = canvas.width / this.stage.sizeframe.x;
		let yscale = canvas.height / this.stage.sizeframe.y;
		if(debug){console.log(`ys=${yscale},xs=${xscale}`)};
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(debug){console.log(`x=${x},y=${y},color=${this.colorprofile[this.stage.whatis(x, y)]},mat=${this.stage.whatis(x, y)}`)};
				c.beginPath();
				c.rect(y * yscale, x * xscale, yscale, xscale);
				c.fillStyle = this.colorprofile[this.stage.whatis(x, y)];
				c.fill();
				c.closePath();
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
		this.stage.solids = this.lookupprop("text:stop")
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
		// Handle pushing and moving tommorow (goodbye March 5th 2025)
		if(youexists){
			if(event_.code == "ArrowUp" && this.player.pos.x != 0){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x - 1, this.player.pos.y, "u") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x - 1, this.player.pos.y);
						this.stage.set(this.player.pos.x - 1, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowDown" && this.player.pos.x != this.stage.sizeframe.x - 1){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x + 1, this.player.pos.y, "d") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x + 1, this.player.pos.y);
						this.stage.set(this.player.pos.x + 1, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowLeft" && this.player.pos.y != 0){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				try{
					if(this.stage.push(this.player.pos.x, this.player.pos.y - 1, "l") == 5){
						this.player.under = this.stage.whatis(this.player.pos.x, this.player.pos.y - 1);
						this.stage.set(this.player.pos.x, this.player.pos.y - 1, this.lookupprop("text:you")[0].split("text:")[1]);
					}else{throw("")}
				}catch{this.stage.set(this.player.pos.x, this.player.pos.y, this.lookupprop("text:you")[0].split("text:")[1])}
			}else if(event_.code == "ArrowRight" && this.player.pos.y != this.stage.sizeframe.y - 1){ // It's 0-indexed!
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
	sanitize(){
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				this.stage.map[x][y] = parseInt(this.stage.map[x][y]);
			}
		}
	}
	checkwin(){
		if(this.lookupprop("text:win").includes("text:"+this.player.under)){
			this.player.removeeventlistener();
			this.player = new player(new vector(0, 0), {});
			this.player.parent_ = this;
			this.stagenum++;
		}
	}
}
class stage{
	constructor(map, materials){
		this.map = map;
		this.materials = materials;
		this.solids = [] // Definable
		this.pushable = ["text:baba", "text:is", "text:you", "text:flag", "text:water", "text:wall", "text:stop", "text:win"] // Static
		this.sizeframe = new vector(this.map.length, this.map[0].length);
		// material ids: "water", "wall", "flag", "text:baba", "text:is", "text:you"
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
		// 1: hit wall, 2: it's solid! 5: success
		if((x <= -1 && dir == "u") || (x >= this.sizeframe.x && dir == "d") || (y <= -1 && dir == "l") || (y >= this.sizeframe.y && dir == "r")){ // Check for wall
			return 1;
		}
		if(this.solids.includes("text:"+this.whatis(x, y))){
			return 2;
		}
		if(this.pushable.includes(this.whatis(x, y))){
			if(dir == "u" && x != 0){
				if(this.whatis(x - 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x - 1, y, mat);
					return 5; // 5 means pushed.
				}else{
					this.push(x - 1, y, "u");
					return this.push(x, y, "u");
				}
			}else if(dir == "d" && x != this.sizeframe.x){
				if(this.whatis(x + 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x + 1, y, mat);
					return 5;
				}else{
					this.push(x + 1, y, "d");
					return this.push(x, y, "d");
				}
			}else if(dir == "l" && y != 0){
				if(this.whatis(x, y - 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y - 1, mat);
					return 5;
				}else{
					this.push(x, y - 1, "l");
					return this.push(x, y, "l");
				}
			}else if(dir == "r" && y != this.sizeframe.y){
				if(this.whatis(x, y + 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y + 1, mat);
					return 5;
				}else{
					this.push(x, y + 1, "r");
					return this.push(x, y, "r");
				}
			}
			return 1;
		}
		return 5;
	}
	set(x, y, mat){
		this.map[x][y] = Object.reverse(this.materials)[mat];
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
