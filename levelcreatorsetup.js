__LoadObjects() // It... Well... Loads the objects.

__MatObj = {};
__MATERIALS.forEach((v, i)=>{
	__MatObj[i] = v;
	setTimeout(()=>{document.getElementById("material").innerHTML += `<option value=${v}>${v}</option>`},5);
});

f = new FileReader();
current = new stage(__EMPTY_MAP, __MatObj);
selected = "background";
cursor = new vector(0, 0);

setInterval(()=>{ // Set up render thread
		let canvas = document.getElementById("main");
		let c = canvas.getContext("2d");
		c.clearRect(0, 0, canvas.width, canvas.height);
		let xscale = canvas.width / current.sizeframe.x;
		let yscale = canvas.height / current.sizeframe.y;
		for(let x = 0; x < current.sizeframe.x; x++){
			for(let y = 0; y < current.sizeframe.y; y++){
				c.drawImage(__MATERIAL_CACHE[current.whatis(x, y)], y * xscale, x * yscale, xscale, yscale);
			}
		}
		for(let x = 0; x < current.sizeframe.x; x++){
			for(let y = 0; y < current.sizeframe.y; y++){
				if(cursor.x == x && cursor.y == y){
					c.beginPath();
					c.rect(y * xscale, x * yscale, xscale, yscale);
					c.strokeStyle = "red";
					c.lineWidth = '50px';
					c.stroke();
					c.closePath();
				}
			}
		}

}, 100);

setInterval(()=>{ // Render current material
	selected = document.getElementById("material").value;
	document.getElementById("selected").width = 50;
	document.getElementById("selected").getContext("2d").drawImage(__MATERIAL_CACHE[selected], 0, 0, 50, 50);
}, 10);

document.onkeydown = e=>{ // Trap arrow keys (to stop scrolling)
	e = e || window.event;
	if(e.keyCode >= 37 && e.keyCode <= 40){
		return false;
	}
};

document.addEventListener('keydown', e=>{
	if(e.code == "ArrowUp" && cursor.x != 0){
		cursor.x--;
		return;
	}else if(e.code == "ArrowDown" && cursor.x != current.sizeframe.x - 1){
		cursor.x++;
		return;
	}else if(e.code == "ArrowLeft" && cursor.y != 0){
		cursor.y--;
		return;
	}else if(e.code == "ArrowRight" && cursor.y != current.sizeframe.y - 1){
		cursor.y++;
		return;
	}else if(e.code == "Space"){
		console.log(cursor.x, cursor.y, selected);
		current.set(cursor.x, cursor.y, selected);
		return;
	}else if(e.code == "KeyE"){
		document.getElementById("material").value = current.whatis(cursor.x, cursor.y);
	}else if(e.code == "KeyQ"){
		current.set(cursor.x, cursor.y, "background");
	}
});

setInterval(()=>{
	document.getElementById("sizedisplay").innerHTML = `(${document.getElementById("size").value})`
});
setTimeout(()=>{
	document.getElementById("download").onclick=()=>{
		let r = e=>{if(e==','){return ',\n\t\t'}else{return e}}
		let b = new Blob([`{\n\t"map" : ${JSON.stringify(current.map)},\n\t"mat" : ${JSON.stringify(current.materials).split('').map(r).join('')},\n\t"size":${document.getElementById("size").value}\n}`], {'type' : 'text/plain'});
		let l = document.createElement('a');
		l.href = URL.createObjectURL(b);
		l.download = "level.json";
		l.click();
		URL.revokeObjectURL(link.href);
	}
	document.getElementById("upload").onchange=()=>{
		f.readAsText(document.getElementById("upload").files[0]);
		setTimeout(()=>{
			let p = JSON.parse(f.result);
			current = new stage(p.map, p.mat);
			document.getElementById("size").value = p.size;
		},5);
	}
	document.getElementById("size").onchange=()=>{
		let a = []
		for(let x = 0; x < document.getElementById("size").value; x++){
			a.push([])
			for(let y = 0; y < document.getElementById("size").value; y++){
				a[x].push(0);
			}
		}
		current = new stage(a, __MatObj);
	}
}, 5)
