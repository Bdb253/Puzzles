//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({width: 440, height: 440, backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.sortableChildren = true;


PIXI.Loader.shared.add("spriteSheet.json").load(setup);

PIXI.sound.add('wrongWay', 'wrongWay.wav');

var cell_width = 40;
var cols = Math.floor(renderer.width/cell_width);
var rows = Math.floor(renderer.height/cell_width);
var width = cols+1;
var height = rows+1;	

var grid = [];
var maze = [];

var start = new Point(8,8);
var playerPos = start;


function setup()
{
	let sheet = PIXI.Loader.shared.resources["spriteSheet.json"].spritesheet;
	
	generate();
	
	//Cell constructor
	function Cell(c , r, type)
	{
		this.col = c;
		this.row = r;
		this.type = type;

		if(type == "wall")
		{
			this.sprite = new PIXI.Sprite(sheet.textures["wall1.png"]);
			this.walkable = false;
		}
		else if (type == "dirt")
		{
			this.sprite = new PIXI.Sprite(sheet.textures["dirt1.png"]);
			this.walkable = true;
		}
		else if(type == "trap")
		{
			this.sprite = new PIXI.AnimatedSprite(sheet.animations["trap"]);
			this.sprite.animationSpeed = 0.015;
			this.walkable = true;
		}

		this.show = function()
		{
			var x = this.col*cell_width;
			var y = this.row*cell_width;

			this.sprite.x = x;
			this.sprite.y = y;
			this.sprite.zIndex = 5;
			stage.addChild(this.sprite);
		}
	}

	function generate()
	{
		const NORTH = "N";
		const SOUTH = "S";
		const EAST = "E";
		const WEST = "W";

		for(var x = 0; x < height; x++)
		{
			maze[x] = [];
			for(var y = 0; y  < width; y++)
			{
				maze[x][y] = false;
			}
		}
		maze[start.x][start.y]=true;


		var back;
		var move;
		var possibleDir;
		var pos = start;

		var moves = [];
		moves.push(pos.y+(pos.x*width));
		while(moves.length)
		{
			possibleDir = "";
					
			if ((pos.x + 2 < height ) && (maze[pos.x + 2][pos.y] == false) && (pos.x + 2 != true) && (pos.x + 2 != height - 1) )
			{
				possibleDir += SOUTH;
			}
			
			if ((pos.x - 2 >= 0 ) && (maze[pos.x - 2][pos.y] == false) && (pos.x - 2 != true) && (pos.x - 2 != height - 1) )
			{
				possibleDir += NORTH;
			}
			
			if ((pos.y - 2 >= 0 ) && (maze[pos.x][pos.y - 2] == false) && (pos.y - 2 != true) && (pos.y - 2 != width - 1) )
			{
				possibleDir += WEST;
			}
			
			if ((pos.y + 2 < width ) && (maze[pos.x][pos.y + 2] == false) && (pos.y + 2 != true) && (pos.y + 2 != width - 1) )
			{
				possibleDir += EAST;
			}
			
			if ( possibleDir.length > 0 )
			{
				move = randInt(0, (possibleDir.length));
				switch ( possibleDir.charAt(move) )
				{
					case NORTH: 
						maze[pos.x - 2][pos.y] = true;
						maze[pos.x - 1][pos.y] = true;
						pos.x -=2;
						break;
					
					case SOUTH: 
						maze[pos.x + 2][pos.y] = true;
						maze[pos.x + 1][pos.y] = true;
						pos.x +=2;
						break;
					
					case WEST: 
						maze[pos.x][pos.y - 2] = true;
						maze[pos.x][pos.y - 1] = true;
						pos.y -=2;
						break;
					
					case EAST: 
						maze[pos.x][pos.y + 2] = true;
						maze[pos.x][pos.y + 1] = true;
						pos.y +=2;
						break;        
				}
				
				moves.push(pos.y + (pos.x * width));
			}
			else
			{
				back = moves.pop();
				pos.x = Math.floor(back / width);
				pos.y = back % width;
			}
		}

		for ( var x = 0; x < height; x++ )
		{
			grid[x]=[]
			for ( var y = 0; y < width; y++ )
			{
				if(maze[x][y] == true)
				{
					var chance = randInt(0, 4)
					if(x == start.x && y == start.y)
					{
						var cell = new Cell(x, y, "dirt");
						cell.show()
						grid[x].push(cell);
					}
					else if(chance == 0)
					{
						var cell = new Cell(x, y, "trap");
						cell.show()
						grid[x].push(cell);
					}
					else
					{
						var cell = new Cell(x, y, "dirt");
						cell.show()
						grid[x].push(cell);
					}
				}
				else
				{
					var cell= new Cell(x, y, "wall");
					cell.show();
					grid[x].push(cell);
				}
			}
		}
	}

	var player = new PIXI.Sprite(sheet.textures["char.png"]);

	player.position.x = start.x * cell_width;
	player.position.y = start.y * cell_width;
	player.zIndex = 15;
	stage.addChild(player);

}

//Point data structure
function Point(x, y)
{
	this.x = x
	this.y = y;
}

function randInt(min, max)
{
	return Math.floor(Math.random() * max) + min;
}


function keydownEventHandler(e)
{
	//w key
	if(e.keyCode == 87)
	{
		//console.log("x:" + playerPos.x);
		//console.log('y:' + playerPos.y);
		//console.log(grid[playerPos.x][playerPos.y-1]);
		if(grid[playerPos.x][playerPos.y-1].walkable)
		{
			player.position.y -= 40;
			//var newy = player.position.y - 40;
			//createjs.Tween.get(player.position).to({x: player.position.x, y: newy}, 1000);
			playerPos.y-=1;
		}
		else
		{
			PIXI.sound.play('wrongWay');
		}
	}
	//s key
	if(e.keyCode == 83)
	{
		//console.log("x:" + playerPos.x);
		//console.log('y:' + playerPos.y);
		//console.log(grid[playerPos.x][playerPos.y+1]);
		if(grid[playerPos.x][playerPos.y+1].walkable)
		{
			player.position.y += 40;
			playerPos.y+=1;
		}
		else
		{
			PIXI.sound.play('wrongWay');
		}
	}
	//a key
	if(e.keyCode == 65)
	{
		//console.log("x:" + playerPos.x);
		//console.log('y:' + playerPos.y);
		//console.log(grid[playerPos.x-1][playerPos.y]);
		if(grid[playerPos.x-1][playerPos.y].walkable)
		{
			player.position.x -= 40;
			playerPos.x -=1;
		}
		else
		{
			PIXI.sound.play('wrongWay');
		}
	}
	//d key
	if(e.keyCode == 68)
	{
		//console.log("x:" + playerPos.x);
		//console.log('y:' + playerPos.y);
		//console.log(grid[playerPos.x+1][playerPos.y]);
		if(grid[playerPos.x+1][playerPos.y].walkable)
		{
			player.position.x += 40;
			playerPos.x+=1;
		}
		else
		{
			PIXI.sound.play('wrongWay');
		}
	}
}

function animate()
{
	requestAnimationFrame(animate);
	renderer.render(stage);

	for ( var x = 0; x < height; x++ )
	{
		for ( var y = 0; y < width; y++ )
		{
			//console.log("x: "+ x + ", y: " + y + "type: " + grid[x][y].type);
			if(grid[x][y].type == "trap")
			{
				grid[x][y].sprite.play();
			}
		}
	}
}

animate();
document.addEventListener('keydown', keydownEventHandler);