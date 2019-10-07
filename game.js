//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({width: 440, height: 440, backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var cols, rows;
var cell_width = 40;
var grid = [];
var maze = [];

cols = Math.floor(renderer.width/cell_width);
rows = Math.floor(renderer.height/cell_width);

var wallTexture = PIXI.Texture.from("wall1.png");
var dirtTexture = PIXI.Texture.from("dirt1.png");

//Cell constructor
function Cell(c , r, type)
{
	this.col = c;
	this.row = r;
	this.sprite = new PIXI.Sprite(type);
	if(type == wallTexture)
	{
		this.walkable = false;
	}
	else
	{
		this.walkable = true;
	}

	this.show = function()
	{
		var x = this.col*cell_width;
		var y = this.row*cell_width;

		this.sprite.x = x;
		this.sprite.y = y;
		stage.addChild(this.sprite);
	}

	this.set = function(type)
	{
		this.sprite = type;
		if(type == wallTexture)
		{
			this.walkable = false;
		}
		else
		{
			this.walkable = true;
		}
	}
}

function Point(x, y)
{
	this.x = x
	this.y = y;
}

//set walls as default tiles
function allwalls()
{
	for (var r = 0; r < rows+1; r++)
	{
		for (var c = 0; c < cols+1; c++)
		{
			var cell = new Cell(c, r, wallTexture);
			cell.show();
		}
	}
}

function generate()
{
	var width = cols+1;
	var height = rows+1;	

	const NORTH = "N";
	const SOUTH = "S";
	const EAST = "E";
	const WEST = "W";

	var start = new Point(8,8);

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
		console.log("x:"+pos.x);
		console.log("y:"+pos.y);
				
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
			console.log("possible:" + possibleDir)
			console.log("max: " + (possibleDir.length));
			console.log("move:" + move);
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
		grid[x]=[];
		for ( var y = 0; y < width; y++ )
		{
			if(maze[x][y] == true)
			{
				var cell = new Cell(x, y, dirtTexture);
				grid[x][y] = cell;
				grid[x][y].show();
			}
			else
			{
				var cell= new Cell(x, y, wallTexture);
				grid[x][y]= cell;
				grid[x][y].show();
			}
		}
	}
}

function randInt(min, max)
{
	return Math.floor(Math.random() * max) + min;
}

//allwalls();
generate();

console.log("rows:" + rows);
console.log("cols:" + cols);
console.log("grids:" + grid.length);

function keydownEventHandler(e)
{
	//w key
	if(e.keyCode == 87)
	{
		robot.position.y -= 10;
	}
	//s key
	if(e.keyCode == 83)
	{
		robot.position.y += 10;
	}
	//a key
	if(e.keyCode == 65)
	{
		robot.position.x -= 10;
	}
	//d key
	if(e.keyCode == 68)
	{
		robot.position.x += 10;
	}
}

function animate()
{
	requestAnimationFrame(animate);
	renderer.render(stage);

}

animate();
document.addEventListener('keydown', keydownEventHandler);