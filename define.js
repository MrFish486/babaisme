var __DEFAULT_COLOR_PROFILE = {"background" : "black", "text:baba" : "red", "text:is" : "white", "text:you" : "yellow", "water" : "blue", "wall" : "gray", "baba": "orange", "flag" : "lime" };
class player{
	constructor(pos, controls){
		this.pos = pos;
		this.controls = controls;
		Object.keys(this.controls).forEach((v, i)=>{
			document.addEventListener('keydown', (e)=>{
				if(code == v){
					this.pressed[controls[v]] = true;
				}
			})
		})
		Object.keys(this.controls).forEach((v, i)=>{
			document.addEventListener('keyup', (e)=>{
				if(code == v){
					this.pressed[controls[v]] = false;
				}
			})
		})
	}
}
class game{
	probe(){
		for(let x = 0; x < this.stage.w; x++){
			for(let y = 0; y < this.stage.h; y++){
				if(this.__asignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x - 2, y);
						}
					}else if(this.stage.whatis(x + 1, y) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x + 2, y);
						}
					}else if(this.stage.whatis(x, y - 1) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y - 2);
						}
					}else if(this.stage.whatis(x, y + 1) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y + 2);
						}
					}
				}
			}
		}
	}
	constructor(stages, stagenum, player, colorprofile){
		// Note: babaisyou only ticks on player movement.
		this.stages = stages;
		this.stagenum = stagenum;
		this.currentstage = stages[stagenum];
		this.colorprofile = colorprofile;
		this.definitions = {}; // Things such as {"baba":"you"}, list of things: "baba", "you", "flag", "wall", "text"
		this.__assignable = ["baba", "wall", "flag", "text"];
		this.__assignto = ["you"];
		this.probe();
		for(let x = 0; x < this.stage.sizeframe.w; x++){
			for(let y = 0; y < this.stage.sizeframe.h; y++){
				if(this.__asignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x - 2, y);
						}
					}else if(this.stage.whatis(x + 1, y) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x + 2, y);
						}
					}else if(this.stage.whatis(x, y - 1) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y - 2);
						}
					}else if(this.stage.whatis(x, y + 1) == "is"){
						if(this.__asignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y + 2);
						}
					}
				}
			}
		}
	}
	render(canvas){
		let c = canvas.getContext("2d");
		// To render : Background, Text, Water, Wall, Flag
		let xscale = canvas.width / this.stage.sizeframe.w;
		let yscale = canvas.height / this.stage.sizeframe.h;
		for(let x = 0; x < this.stage.sizeframe.w; x++){
			for(let y = 0; y < this.stage.sizeframe.h; y++){
				c.beginPath();
				c.rect(x * xscale, y * yscale, xscale, yscale);
				c.fillStyle = this.colorprofile[this.stage.whatis(x, y)];
				c.fill();
			}
		}
	}
}
class stage{
	constructor(map, materials){
		this.map = map;
		this.materials = materials;
		this.solids = ["wall"];
		this.sizeframe = new vector(this.map.length, this.map[0].length);
		// material ids: "water", "wall", "flag", "text:baba", "text:is", "text:you"
	}
	whatis(x, y){
		try{
			return this.materials[this.map[x][y]];
		}catch{}
	}
	cango(x, y){
		return !this.solids.includes(this.whatis(x, y));
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
