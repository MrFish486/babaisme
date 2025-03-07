var __DEFAULT_COLOR_PROFILE = {"background" : "black", "text:baba" : "red", "text:is" : "white", "text:you" : "yellow", "water" : "blue", "wall" : "gray", "baba": "orange", "flag" : "lime", "unknown" : "green" };
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
		document.addEventListener('keydown', (e)=>{this.parent_.tick(e)}); // Because this.parent_ isn't defined yet.
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
		this.__assignto = ["text:you"];
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
	render(canvas, debug=false){
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
				this.player.under = this.stage.whatis(this.player.pos.x - 1, this.player.pos.y);
				this.stage.set(this.player.pos.x - 1, this.player.pos.y, "baba");
			}else if(event_.code == "ArrowDown" && this.player.pos.x != this.stage.sizeframe.x){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				this.player.under = this.stage.whatis(this.player.pos.x + 1, this.player.pos.y);
				this.stage.set(this.player.pos.x + 1, this.player.pos.y, "baba");
			}else if(event_.code == "ArrowLeft" && this.player.pos.y != 0){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				this.player.under = this.stage.whatis(this.player.pos.x, this.player.pos.y - 1);
				this.stage.set(this.player.pos.x, this.player.pos.y - 1, "baba");
			}else if(event_.code == "ArrowRight" && this.player.pos.y != this.stage.sizeframe.y){
				this.stage.set(this.player.pos.x, this.player.pos.y, this.player.under);
				this.player.under = this.stage.whatis(this.player.pos.x, this.player.pos.y + 1);
				this.stage.set(this.player.pos.x, this.player.pos.y + 1, "baba");
			}
		}
	}

}
class stage{
	constructor(map, materials){
		this.map = map;
		this.materials = materials;
		this.solids = ["wall"];
		this.pushable = ["text:baba", "text:is", "text:you", "text:flag", "text:water", "text:wall"]
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
			return "unknown"
		}
	}
	push(x, y, dir){
		if(this.pushable.includes(this.whatis(x, y))){
			if(dir == "u" && x != 0){
				if(this.whatis(x - 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x - 1, y, mat);
				}else{
					this.push(x - 1, y, "u");
					this.push(x, y, "u");
				}
			}else if(dir == "d" && x != this.sizeframe.x){
				if(this.whatis(x + 1, y) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x + 1, y, mat);
				}else{
					this.push(x + 1, y, "d");
					this.push(x, y, "d");
				}
			}else if(dir == "l" && y != 0){
				if(this.whatis(x, y - 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y - 1, mat);
				}else{
					this.push(x, y - 1, "l");
					this.push(x, y, "l");
				}
			}else if(dir == "r" && y != this.sizeframe.y){
				if(this.whatis(x, y + 1) == "background"){
					let mat = this.whatis(x, y);
					this.set(x, y, "background");
					this.set(x, y + 1, "r");
				}else{
					this.push(x, y + 1, "r");
					this.push(x, y, "r");
				}
			}
		}
		return;
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
