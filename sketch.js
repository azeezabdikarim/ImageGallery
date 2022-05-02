let frames_passed = 0;
let cam;
let walk_pace = 0;
let img;
let front_wall_pictures = [];
let left_wall_pictures = [];
let right_wall_pictures = [];
// let pointLight_pos = 100;
// let z_camera_pos = 0;
let pointLight_pos = 1350;
let z_camera_pos = 1250;

let z_camera_max = 1350;
let z_camera_min = -350;

let wall_angle = 80;
let wall_length = 1000;
let wall_height = 200;
let hallway_width = 200;
let hallway_depth = 10;
let front_wall_width = 500;
let front_wall_height = 400;
let front_wall_pic_pos_x = (front_wall_width) + (hallway_width/2) - 80;

function preload(){
	
}

function setup() {
	createCanvas(1700, 900, WEBGL);
	let offsetY = -50;
	
	let front_wall_paths = ['Pics/duo.jpg', 'Pics/learning.jpg'];
	let left_wall_paths = ['Pics/warmtrash.jpg', 'Pics/greenswarm.jpg', 'Pics/sf.jpg'];//, 'Pics/sf.jpg','Pics/greenswarm.jpg'];
	let right_wall_paths = ['Pics/sfsunset.jpg', 'Pics/green.jpg','Pics/canals.jpg'];//, 'Pics/green.jpg', 'Pics/canals.jpg'];
	for (var i = 0; i < front_wall_paths.length; i++) {
		var temp_img = loadImage(front_wall_paths[i]);
		temp_img.resize(0, front_wall_height/2);
		front_wall_pictures.push(temp_img);
	}
	for (var i = 0; i < left_wall_paths.length; i++) {
		var temp_img = loadImage(left_wall_paths[i]);
		temp_img.resize(0, front_wall_height/2);
		left_wall_pictures.push(temp_img);
	}
	for (var i = 0; i < right_wall_paths.length; i++) {
		var temp_img = loadImage(right_wall_paths[i]);
		temp_img.resize(0, front_wall_height/2);
		right_wall_pictures.push(temp_img);
	}
	console.log(front_wall_pictures);
	console.log(left_wall_pictures);
	console.log(right_wall_pictures);
	


	cam = createCamera();
	cam.move(0,-100,-300);
}

function draw() {
	imageMode(CENTER);
	angleMode(DEGREES);
	// clear();
	background(10);
	
  	orbitControl();

	// drawAxis();

	let x_translate = 0;

	noStroke();
	// fill(91,152,94);
	pointLight(150,150,150,0,-100,-900);
	pointLight(200, 200,200,-80,-60,pointLight_pos);
	// pointLight(200, 200,200,-100,pointLight_pos);
	pointLight(200, 200,200,80,-60,pointLight_pos);
	ambientMaterial(91,152,94);
	rotateX(90);
	translate(0,0,-500);
	box(10000,10000,1000);
	translate(0,0,500);
	rotateX(-90);

	
	ambientMaterial(160,160,160);
	


	rotateY(wall_angle);
	translate(-wall_length/2,-wall_height/2,-hallway_width/2);
	rect(-wall_length/2,-wall_height/2, wall_length,wall_height);
	translate(0,0,1);

	hangPhotos(left_wall_pictures, wall_length, wall_height, .75);

	translate(0,0,-1);
	translate(wall_length/2,wall_height/2,hallway_width/2);

	rotateY(-wall_angle);
	rotateY(-wall_angle);
	translate(wall_length/2,-wall_height/2,-hallway_width/2);
	rect(-wall_length/2,-wall_height/2, wall_length,wall_height);
	translate(0,0,1);
	hangPhotos(right_wall_pictures, wall_length, wall_height, .75);
	translate(0,0,-1);
	translate(wall_length/2,wall_height/2,hallway_width/2);

	rotateY(wall_angle);

	let correct_y_axis = (wall_length - (cos(10)*wall_length) + 3 );
	translate(0, 0, -correct_y_axis); 

	let right_room_corner = hallway_width/2; //(wall_length*sin(90-wall_angle));
	translate(right_room_corner,-front_wall_height,0);
	rect(-3,0,front_wall_width, front_wall_height);//x and y should be 0,0 but they are hardcoded to account for small adjustments


	let left_room_corner = -front_wall_width - 46;
	translate(left_room_corner,0,0);
	rect(-front_wall_width,0,front_wall_width, front_wall_height);//x and y should be 0,0 but they are hardcoded to account for small adjustments

	translate(-(left_room_corner/2) -2, 0 ,0);
	

	let temp_img = front_wall_pictures[0];
	var scale = (front_wall_height*.5)/temp_img.height;
	translate(0,0,1);
	image(temp_img, +front_wall_pic_pos_x, front_wall_height/2, scale*temp_img.width, front_wall_height/2);
	temp_img = front_wall_pictures[1];
	image(temp_img, -front_wall_pic_pos_x, front_wall_height/2, scale*temp_img.width, front_wall_height/2);
	translate(0,0,-1);


  	walk();

  	//mobileMove();
	frames_passed++;
}

// function hangPhotos(photo_list, wall_length, wall_height) {
// 	let intervals = wall_length/16;
// 	let x_pos = intervals;

// 	photo_list.forEach(function(p) {
// 		image(p, x_pos, wall_height/2);
// 		x_pos += intervals;
// 		console.log();
// 	});
// }

function hangPhotos(photo_list, wall_length, wall_height, scale = 0.5) {
	let intervals = wall_length/(photo_list.length + 2);
	let wall_x = -(intervals/2);
	for (var i = 0; i < photo_list.length; i++) {
		let wall_img = photo_list[i];
		var height_scale = (wall_height*scale)/wall_img.height;
		var scaled_width = height_scale*wall_img.width
		
		image(wall_img, wall_x - (scaled_width), 0, scaled_width, wall_height*scale);

		wall_x = wall_x + intervals + (scaled_width/2);
	}

}


function keyTyped() {
  if (key === 'f') {
   	walk_pace = -1;
  } else if (key === 'b') {
   	walk_pace = 1;
  } else if (key === 's') {
   	walk_pace = 0;
  }
  // uncomment to prevent any default behavior
  // return false;
}

function walk(){
	if ((z_camera_pos <= z_camera_max) && (z_camera_pos >= z_camera_min)) {
		cam.move(0,0,walk_pace);
		z_camera_pos += walk_pace;
		pointLight_pos += walk_pace;
	} else if ((z_camera_pos >= z_camera_max)){
		walk_pace = 0;
		z_camera_pos = z_camera_max;
	} else if ((z_camera_pos <= z_camera_min)){
		walk_pace = 0;
		z_camera_pos = z_camera_min;
	}
}

function mobileMove(){
	let acc_x, acc_y, acc_z;

	acc_x+=accelerationX*0.05;
	acc_y+=accelerationY*0.05;
	acc_z+=accelerationZ*0.05;

	walk_pace = walk_pace*accelerationZ;
	// rotateX(x);
	rotateY(acc_y);
	// rotateZ(z);
}

function keyPressed() {
	if (value = 0) {
		keyTyped();
	}
}

function drawAxis(){
	stroke(250,0, 0);
	strokeWeight(3);
	line(-2000,0,0, 2000,0,0);
	stroke(0,250, 0);
	line(0,-2000,0,0,2000,0);
	stroke(0, 0,250);
	line(0,0,-2000, 0, 0, 2000);
}	
