var __DEFAULT_COLOR_PROFILE = {"background" : "black", "text:baba" : "red", "text:is" : "white", "text:you" : "yellow", "water" : "blue", "wall" : "gray", "baba": "orange", "flag" : "lime", "unknown" : "blue" };
class player{
	constructor(pos, controls){
		this.pos = pos;
		this.controls = controls;
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
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.__assignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x - 2, y);
						}
					}else if(this.stage.whatis(x + 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x + 2, y);
						}
					}else if(this.stage.whatis(x, y - 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y - 2);
						}
					}else if(this.stage.whatis(x, y + 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y + 2);
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
		for(let y = 0; y < this.stage.sizeframe.y; y++){
			for(let x = 0; x < this.stage.sizeframe.x; x++){
				if(debug){console.log(`x=${x},y=${y},color=${this.colorprofile[this.stage.whatis(x, y)]},mat=${this.stage.whatis(x, y)}`)};
				c.beginPath();
				c.rect(x * xscale, y * yscale, xscale, yscale);
				c.fillStyle = this.colorprofile[this.stage.whatis(x, y)];
				c.fill();
				c.closePath();
			}
		}
	}
	probe(){
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.__assignable.includes(this.stage.whatis(x, y))){
					if(this.stage.whatis(x - 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x - 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x - 2, y);
						}
					}else if(this.stage.whatis(x + 1, y) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x + 2, y))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x + 2, y);
						}
					}else if(this.stage.whatis(x, y - 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y - 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y - 2);
						}
					}else if(this.stage.whatis(x, y + 1) == "text:is"){
						if(this.__assignto.includes(this.stage.whatis(x, y + 2))){
							this.definitions[this.stage.whatis(x, y)] = this.stage.whatis(x, y + 2);
						}
					}
				}
			}
		}
	}
	tick(event_){ // Again, baba only ticks on moves.
		for(let x = 0; x < this.stage.sizeframe.x; x++){
			for(let y = 0; y < this.stage.sizeframe.y; y++){
				if(this.stage.whatis(x, y) == "baba"){
					this.player.pos = new vector(x, y);
				}
			}

		}
		// Handle pushing and moving tommorow (goodbye March 5th 2025)
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
			if(this.materials[this.map[x][y]] == undefined){
				return "unknown";
			}
			return this.materials[this.map[x][y]];
		}catch{
			return "unknown"
		}
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
