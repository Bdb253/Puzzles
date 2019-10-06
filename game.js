//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x3344ee});
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

//set walls as default tiles
function allwalls()
{
	for (var r = 0; r < rows; r++)
	{
		grid[r]=[];
		for (var c = 0; c < cols; c++)
		{
			var cell = new Cell(c, r, wallTexture);
			grid[r].push(cell);
		}
	}
}

function generate(){
	var moves = [];
	for(var i = 0; i < rows; i ++)
	{
		maze[i] = [];
		for(var j = 0; j < cols; j ++)
		{
			maze[i][j] = 1;
		}
	}
	var posX = 1;
    var posY = 1;
	maze[posX][posY] = 0; 
	moves.push(posY + posY * cols);
	while(moves.length > 0)
	{
		if(moves.length)
		{       
			var possibleDirections = "";
			if(posX+1 > 0 && posX + 1 < rows - 1 && maze[posX + 1][posY] == 1){
				possibleDirections += "S";
			}
			if(posX-1 > 0 && posX - 1 < rows - 1 && maze[posX - 1][posY] == 1){
				possibleDirections += "N";
			}
			if(posY-1 > 0 && posY - 1 < cols - 1 && maze[posX][posY - 1] == 1){
				possibleDirections += "W";
			}
			if(posY+1 > 0 && posY + 1 < cols - 1 && maze[posX][posY + 1] == 1)
			{
				possibleDirections += "E";
			} 
			if(possibleDirections){
				//var move = game.rnd.between(0, possibleDirections.length - 1);
				var move = Math.floor(Math.random() * (possibleDirections.length - 1));
				//console.log(move);
				switch (possibleDirections[move])
				{
					case "N": 
						maze[posX - 2][posY] = 0;
						maze[posX - 1][posY] = 0;
						posX -= 2;
						break;
					case "S":
						maze[posX + 2][posY] = 0;
						maze[posX + 1][posY] = 0;
						posX += 2;
						break;
					case "W":
						maze[posX][posY - 2] = 0;
						maze[posX][posY - 1] = 0;
						posY -= 2;
						break;
					case "E":
						maze[posX][posY + 2]=0;
						maze[posX][posY + 1]=0;
						posY += 2;
						break;         
				}
				moves.push(posY + posX * cols);     
			}
			else
			{
				var back = moves.pop();
				posX = Math.floor(back / cols);
				posY = back % cols;
			}
			drawMaze(posX, posY)                                      
		}
	}
}

function drawMaze(x, y)
{
	for(i = 0; i < rows; i ++)
	{
		grid[i]=[];
		for(j = 0; j < cols; j ++)
		{
			if(maze[i][j] == 1)
			{
				var cell = new Cell(j, i, wallTexture);
				grid[i].push(cell);
			}
			else
			{
				var cell = new Cell(j, i, dirtTexture);
				grid[i].push(cell);

			}
		}
   }
}

generate();

//show all cells
for (var r = 0; r < rows; r++)
{
	for (var c = 0; c < cols; c++)
		{
			grid[r][c].show();
		}
}

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