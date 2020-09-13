let slider;
let button1;
let button2;
function setup()
{
	slider = createSlider(10, 1000, 500);
	slider.position(0, 550);
	slider.style("width", "500px");
	button1 = createButton("play/pause");
	button1.mousePressed(toggle_play);
	button1.position(0,520);
	button2 = createButton("reset");
	button2.mousePressed(reset_cells);
	button2.position(100, 520);
	createCanvas(500, 500);
	background(200);
	cells = new Array(25);
	cellhp = new Array(25);
	for(i = 0; i < 25; i++)
	{
		cells[i] = new Array(25);
		cellhp[i] = new Array(25);
		for (j = 0; j < 25; j++)
		{
			cells[i][j] = 0;
			cellhp[i][j] = 0;
		}
	}
}

function toggle_play()
{
	playing = (playing + 1 )% 2;
}

function draw_grid(size)
{
	stroke(0);
	strokeWeight(2);
	for(var i = size; i < width; i += size)
	{
		line(0, i, width, i);
		line(i, 0, i, height);
	}
}

function draw_cells()
{
	var size = width / 25 - 4;
	background(220);
	strokeWeight(0);
	for (y in cells)
	{
		for (x in cells[y])
		{
			if (cells[y][x] == 0)
				fill(255);
			if (cells[y][x] == 1)
				fill(0);
			var px = 2 + (x * width / 25);
			var py = 2 + (y * height / 25);
			rect(px, py , size, size);
		}
	}
}

function draw_edge(playcolor)
{
	stroke(playcolor);
	strokeWeight(4);
	line(0, 0, width, 0);
	line(0, 0, 0, height);
	line(width, height, width, 0);
	line(width, height, 0, height);
}

var gsize = 20;
var cells;
var cellhp;
var playing = 0;
var play_delay = 500;
var ticktime = 0;

function calc_cellhp()
{
	var count = 0;
	for (y = 0 ; y < 25; y++)
	{
		for (x = 0; x < 25; x++)
		{
			count++;
			if (x - 1 >= 0 && cells[y][x-1] == 1)
				cellhp[y][x] += 1;
			if (x + 1 < 25 && cells[y][x+1] == 1)
				cellhp[y][x] += 1;
			if (y - 1 >= 0 && cells[y-1][x] == 1)
				cellhp[y][x] += 1;
			if (y + 1 < 25 && cells[y+1][x] == 1)
				cellhp[y][x] += 1;
			if (x - 1 >= 0 && y - 1 >= 0 && cells[y-1][x-1] == 1)
				cellhp[y][x] += 1;
			if (x + 1 < 25 && y - 1 >= 0 &&  cells[y-1][x+1] == 1)
				cellhp[y][x] += 1;
			if (x - 1 >= 0 && y + 1 < 25 && cells[y+1][x-1] == 1)
				cellhp[y][x] += 1;
			if (y + 1 < 25 && y + 1 < 25 && cells[y+1][x+1] == 1)
				cellhp[y][x] += 1;
		}
	}
	//console.log("counter: "+count);
}

function update_cells()
{
	console.log(cellhp[1][1]);
	for (y = 0; y < 25; y++)
	{
		for (x = 0; x < 25; x++)
		{
			var hp = cellhp[y][x];
			cellhp[y][x] = 0;
			if (cells[y][x] == 1)
			{
				if (hp < 2 || hp > 3)
					cells[y][x] = 0;
			}
			else
			{
				if (hp == 3)
					cells[y][x] = 1;
			}
		}
	}
}

function reset_cells()
{
	for (i in cells)
	{
		for (j in cells)
		{
			cells[i][j] = 0;
		}
	}
}

function tick()
{
	
	ticktime = millis();
	calc_cellhp();
	update_cells();
}

function draw()
{
	var playcolor = color(255 - (playing * 255), 255 * playing,0);
	play_delay = slider.value();
	draw_cells();
	draw_grid(gsize);
	draw_edge(playcolor);
	if (playing)
	{
		if (millis() - ticktime > play_delay)	
		{
			tick();
		}
	}
}

function mouseClicked()
{
	if (mouseX < 1 || mouseY < 1 || mouseX >= width || mouseY >= height)
		return ;
	var x = int(mouseX / gsize);
	var y = int(mouseY / gsize);
	cells[y][x] = (cells[y][x] + 1) % 2;
}

function touchEnded()
{
	if (mouseX < 1 || mouseY < 1 || mouseX >= width || mouseY >= height)
		return ;
	var x = int(mouseX / gsize);
	var y = int(mouseY / gsize);
	cells[y][x] = (cells[y][x] + 1) % 2;
}

function keyPressed()
{
	if (key == " ")
		playing = (playing + 1) % 2;
	if (key == "c")
		reset_cells();
}
