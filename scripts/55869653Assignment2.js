var dayTime = true;
var helpersOn = false;
var moveVehicle = false;
var randomSelectVehicle = 0;
const daySceneColor = 0xDCEE5F;
const nightSceneColor = 0x14242d;
const roomColor = 0x227b93;
const shapeColor = 0xff6c00;
const lightColor = 0xffffff;
const pointLightColor = 0xffb400;

// Setup the renderer and canvas element.
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(daySceneColor);
document.body.appendChild(renderer.domElement);

// Setup the scene and camera.
var scene = new THREE.Scene();
/*var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);

// Set the initial position of the camera.
camera.position.set(-10, 12, 40);
camera.lookAt(scene.position);*/

// Set up camera
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 1000;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
  0, // near plane
  1000 // far plane
);
camera.position.set(200, 210, 200);
camera.lookAt(0, 10, 0);




// Setup light sources.
var ambientLight= new THREE.AmbientLight(lightColor);

var spotLight = new THREE.SpotLight(lightColor);
spotLight.position.set(2000, 2000, 200);
//spotLight.angle = Math.PI / 4;
//spotLight.decay = 5;
//spotLight.distance = 200;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.radius = 2;
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 50;

var pointLight = new THREE.PointLight(pointLightColor, 1.5);
pointLight.position.set(200, 200, 200);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.radius = 20;

// Enable shadows.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add light sources to scene.
scene.add(ambientLight);
scene.add(spotLight);
//scene.add(pointLight);

// HTML elements for event listeners and DOM interaction.
var sceneZoomControl = document.getElementById('scene-zoom-control');
var sceneZoomValueText = document.getElementById('scene-zoom-value-text');
var moveVehicleButton = document.getElementById('move-vehicle-button');
var sceneToggleButton = document.getElementById('scene-toggle-button');


// Scene zoom setting and control event listener and function.
var zoomLevel = 1;

function updateZoomLevel(e) {
    zoomLevel = e.target.value;
    camera.zoom = zoomLevel;
    camera.updateProjectionMatrix();
    sceneZoomValueText.innerHTML = zoomLevel + 'x';
}

sceneZoomControl.addEventListener('input', function(e) {
    updateZoomLevel(e);
});

// Scene camera position control event listener and function.	
// Helpers toggle event listener.
moveVehicleButton.addEventListener('click', function(e) {
    moveVehicle = !moveVehicle;
    randomSelectVehicle = Math.floor((Math.random() * 3) + 1);
});

sceneToggleButton.addEventListener('click', function(e) {
    dayTime = !dayTime;
});

// Some IE versions needs the onChange event instead of onInput, so this is a fix for IE10 and IE11.
if (navigator.appVersion.indexOf("MSIE 10") !== -1 || (navigator.userAgent.indexOf("Trident") !== -1 && navigator.userAgent.indexOf("rv:11") !== -1)) {
    sceneZoomControl.addEventListener('change', function(e) {
        updateZoomLevel(e);
    });
}

// Set the initial slider values and text on screen.
sceneZoomControl.value = zoomLevel;
sceneZoomValueText.innerHTML = zoomLevel + 'x';

// Update the canvas size and aspect ratio on window resize.
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

//Scene definitions and functions
const car = createCar();
const bus = createBus();
const truck = createTruck();
const trafficLights1 = createTrafficLights();
const streetLights = createStreetLights();
const moonAndStars = createMoonAndStars();
car.position.set(-110, 0, -33);
bus.position.set(150, 0, 43);
truck.rotation.y = 1.5708;
truck.position.set(40, 0, -130);
moonAndStars.position.set(-200,200,200);
car.castShadow = true;
bus.castShadow = true;
truck.castShadow = true;
trafficLights1.castShadow = true;
streetLights.castShadow = true;

scene.add(car);
scene.add(bus);
scene.add(truck);
scene.add(trafficLights1);
scene.add(streetLights);
scene.add(moonAndStars);

//plane
const geometryPlane = new THREE.PlaneGeometry( innerHeight, innerWidth, 32 );
const materialPlane = new THREE.MeshBasicMaterial( {color: 0x34D831, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometryPlane, materialPlane );
plane.position.set(0, -1, 0);
plane.rotation.x = 1.5708; //90 degree rotation
plane.receiveShadow = true;
scene.add( plane );

//road1
const geometryRoad1 = new THREE.PlaneGeometry( 132, innerWidth);
const materialRoad1 = new THREE.MeshBasicMaterial( {color: 0x7E847D, side: THREE.DoubleSide} );
const road1 = new THREE.Mesh( geometryRoad1, materialRoad1);
road1.rotation.x = 1.5708;
road1.receiveShadow = true;
scene.add( road1 );

//road2
const geometryRoad2 = new THREE.PlaneGeometry( innerHeight, 132);
const materialRoad2 = new THREE.MeshBasicMaterial( {color: 0x7E847D, side: THREE.DoubleSide} );
const road2 = new THREE.Mesh( geometryRoad2, materialRoad2 );
road2.rotation.x = 1.5708;
road2.receiveShadow = true;
scene.add( road2 );

//building
const buildingFrontTexture = getBuildingFrontTexture();

const buildingBackTexture = getBuildingFrontTexture();

const buildingRightSideTexture = getBuildingSideTexture();

const buildingLeftSideTexture = getBuildingSideTexture();
    
buildingLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
buildingLeftSideTexture.rotation = Math.PI;
buildingLeftSideTexture.flipY = false;

const building = new THREE.Mesh(
    new THREE.BoxBufferGeometry(150, 160, 130),
    [
    new THREE.MeshLambertMaterial({ map: buildingLeftSideTexture }), //back
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ map: buildingLeftSideTexture }), //left side
    new THREE.MeshLambertMaterial({ map: buildingLeftSideTexture })
    ] 
  );

building.position.y = 40;
building.position.x = -180;
building.position.z = -180;
scene.add(building);

//creating car group
function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();

  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture })
  ]);
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}

//creating bus group
function createBus() {
  const bus = new THREE.Group();
    
  const backWheel = createBusWheels();
  backWheel.position.y = 17;
  backWheel.position.x = -18;
  bus.add(backWheel);

  const frontWheel = createBusWheels();
  frontWheel.position.y = 17;
  frontWheel.position.x = 84;
  bus.add(frontWheel);
    
  const busFrontTexture = getBusFrontTexture();

  const busBackTexture = getBusFrontTexture();

  const busRightSideTexture = getBusSideTexture();

  const busLeftSideTexture = getBusSideTexture();
    
  busLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  busLeftSideTexture.rotation = Math.PI;
  busLeftSideTexture.flipY = false;
    
  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(190, 60, 30),
    [
    new THREE.MeshLambertMaterial({ map: busLeftSideTexture }), //back
    new THREE.MeshLambertMaterial({ color: 0x72B8C1 }),
    new THREE.MeshLambertMaterial({ color: 0x72B8C1 }), // top
    new THREE.MeshLambertMaterial({ color: 0x72B8C1 }),
    new THREE.MeshLambertMaterial({ map: busLeftSideTexture }), //left side
    new THREE.MeshLambertMaterial({ map: busLeftSideTexture })
    ] 
  );
  main.position.y = 40;
  main.position.x = 40;
  bus.add(main);
    
    
  return bus;
}

//creating truck group
function createTruck() {
  const truck = new THREE.Group();
    
  const backWheel = createTruckWheels();
  backWheel.position.y = 17;
  backWheel.position.x = -18;
  truck.add(backWheel);

  const frontWheel = createTruckWheels();
  frontWheel.position.y = 17;
  frontWheel.position.x = 114;
  truck.add(frontWheel);
    
  const middleWheel = createTruckWheels();
  middleWheel.position.y = 17;
  middleWheel.position.x = 50;
  truck.add(middleWheel);
    
  const truckFrontTexture = getTruckFrontTexture();

  const truckBackTexture = getTruckFrontTexture();

  const truckRightSideTexture = getTruckSideTexture();

  const truckLeftSideTexture = getTruckSideTexture();
    
  truckLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  truckLeftSideTexture.rotation = Math.PI;
  truckLeftSideTexture.flipY = false;
    
  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(50, 60, 30),
    [
    new THREE.MeshLambertMaterial({ map: truckLeftSideTexture }), //back
    new THREE.MeshLambertMaterial({ color: 0xa52523 }),
    new THREE.MeshLambertMaterial({ color: 0xa52523 }), // top
    new THREE.MeshLambertMaterial({ color: 0xa52523 }),
    new THREE.MeshLambertMaterial({ map: truckLeftSideTexture }), //left side
    new THREE.MeshLambertMaterial({ map: truckLeftSideTexture })
    ] 
  );
  
  main.position.y = 40;
  main.position.x = -10;
  truck.add(main);
    
  const cargo = new THREE.Mesh(
    new THREE.BoxBufferGeometry(120, 60, 30),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  
  cargo.position.y = 40;
  cargo.position.x = 80;
  truck.add(cargo);
    
    
  return truck;
}

function createTrafficLights(){
    const trafficLights = new THREE.Group();
    
    const trafficLightPillar1 = createTrafficLightsPillars();
    const trafficLightPillar2 = createTrafficLightsPillars();
    const trafficLightPillar3 = createTrafficLightsPillars();
    const trafficLightPillar4 = createTrafficLightsPillars();
    const trafficGreen1 = createTrafficGreenLights();
    const trafficYellow1 = createTrafficYellowLights();
    const trafficRed1 = createTrafficRedLights();
    const trafficGreen2 = createTrafficGreenLights();
    const trafficYellow2 = createTrafficYellowLights();
    const trafficRed2 = createTrafficRedLights();
    const trafficGreen3 = createTrafficGreenLights();
    const trafficYellow3 = createTrafficYellowLights();
    const trafficRed3 = createTrafficRedLights();
    const trafficGreen4 = createTrafficGreenLights();
    const trafficYellow4 = createTrafficYellowLights();
    const trafficRed4 = createTrafficRedLights();
    const trafficBox1 = createTrafficBox();
    const trafficBox2 = createTrafficBox();
    const trafficBox3 = createTrafficBox();
    const trafficBox4 = createTrafficBox();
    
    trafficLightPillar1.position.set(100, 1, 100); //bottom
    trafficLightPillar2.position.set(100, 1, -100); //right
    trafficLightPillar3.position.set(-100, 1, -100); //top
    trafficLightPillar4.position.set(-100, 1, 100); //left
    
    trafficGreen1.position.set(100, 35,100);
    trafficYellow1.position.set(100, 39,100);
    trafficRed1.position.set(100, 43,100);
    trafficGreen2.position.set(100, 35,-100);
    trafficGreen2.rotation.z = 1.5708;
    trafficYellow2.position.set(100, 39,-100);
    trafficYellow2.rotation.z = 1.5708;
    trafficRed2.position.set(100, 43,-100);
    trafficRed2.rotation.z = 1.5708;
    trafficGreen3.position.set(-100, 35, -100);
    trafficYellow3.position.set(-100, 39, -100);
    trafficRed3.position.set(-100, 43, -100);
    trafficGreen4.position.set(-100, 35,100);
    trafficGreen4.rotation.z = 1.5708;
    trafficYellow4.position.set(-100, 39,100);
    trafficYellow4.rotation.z = 1.5708;
    trafficRed4.position.set(-100, 43,100);
    trafficRed4.rotation.z = 1.5708;
    
    trafficBox1.position.set(100, 38, 101);
    trafficBox2.position.set(101, 38, -99);
    trafficBox3.position.set(-100, 38, -101);
    trafficBox4.position.set(-102, 38, 100.4);
    
    trafficLights.add(trafficLightPillar1);
    trafficLights.add(trafficLightPillar2);
    trafficLights.add(trafficLightPillar3);
    trafficLights.add(trafficLightPillar4);
    
    trafficLights.add(trafficGreen1);
    trafficLights.add(trafficYellow1);
    trafficLights.add(trafficRed1);
    trafficLights.add(trafficGreen2);
    trafficLights.add(trafficYellow2);
    trafficLights.add(trafficRed2);
    trafficLights.add(trafficGreen3);
    trafficLights.add(trafficYellow3);
    trafficLights.add(trafficRed3);
    trafficLights.add(trafficGreen4);
    trafficLights.add(trafficYellow4);
    trafficLights.add(trafficRed4);
    trafficLights.add(trafficBox1);
    trafficLights.add(trafficBox2);
    trafficLights.add(trafficBox3);
    trafficLights.add(trafficBox4);
    
    return trafficLights;
}

function createWheels() {
    //cyclinder
  const geometry = new THREE.CylinderGeometry( 5, 5, 33, 33 );
  const material = new THREE.MeshBasicMaterial( {color: 0x333333} );
  const cylinder = new THREE.Mesh( geometry, material );
  cylinder.rotation.x = 1.5708; //90 degrees in radians
  return cylinder;

}

function createBusWheels() {
//cyclinder
  const geometry = new THREE.CylinderGeometry( 15, 15, 33, 33 );
  const material = new THREE.MeshBasicMaterial( {color: 0x333333} );
  const cylinder = new THREE.Mesh( geometry, material );
  cylinder.rotation.x = 1.5708; //90 degrees in radians
  return cylinder;

}

function createTruckWheels() {
//cyclinder
  const geometry = new THREE.CylinderGeometry( 15, 15, 33, 33 );
  const material = new THREE.MeshBasicMaterial( {color: 0x333333} );
  const cylinder = new THREE.Mesh( geometry, material );
  cylinder.rotation.x = 1.5708; //90 degrees in radians
  return cylinder;

}

function createTrafficLightsPillars(){
    const geometry = new THREE.CylinderGeometry( 2, 2, 60, 33 );
    const material = new THREE.MeshBasicMaterial( {color: 0xF9ED07} );
    const cylinder = new THREE.Mesh( geometry, material );
    return cylinder;
}

function createTrafficGreenLights(){
    const geometry = new THREE.CylinderGeometry( 2, 2, 2, 33 );
    const material = new THREE.MeshBasicMaterial( {color: 0x25F909} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotation.x = 1.5708; //90 degrees in radians
    return cylinder;
}

function createTrafficYellowLights(){
    const geometry = new THREE.CylinderGeometry( 2, 2, 2, 33 );
    const material = new THREE.MeshBasicMaterial( {color: 0xF79707} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotation.x = 1.5708; //90 degrees in radians
    return cylinder;
}

function createTrafficRedLights(){
    const geometry = new THREE.CylinderGeometry( 2, 2, 2, 33 );
    const material = new THREE.MeshBasicMaterial( {color: 0xF71504} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotation.x = 1.5708; //90 degrees in radians
    return cylinder;
}

function createTrafficBox(){
    const geometry = new THREE.BoxGeometry(5, 15, 3);
    const material = new THREE.MeshBasicMaterial( {color: 0x333333});
    const box = new THREE.Mesh( geometry, material );
    return box;
}

function createStreetLights(){
    const streetLights = new THREE.Group();
    
    const streetLightPillar1 = createStreetLightsPillars();
    const streetLightPillar2 = createStreetLightsPillars();
    const streetLightWhite1 = createStreetLightWhite();
    const streetLightWhite2 = createStreetLightWhite();
    
    streetLightPillar1.position.set(200,1,100);
    streetLightPillar2.position.set(100,1,-200);
    streetLightWhite1.position.set(200,152,100);
    streetLightWhite2.position.set(100,152,-200);
    
    streetLights.add(streetLightPillar1);
    streetLights.add(streetLightPillar2);
    streetLights.add(streetLightWhite1);
    streetLights.add(streetLightWhite2);
    
    return streetLights;
}

function createStreetLightsPillars(){
    const geometry = new THREE.CylinderGeometry( 4, 4, 300, 33 );
    const material = new THREE.MeshBasicMaterial( {color: 0xD7CDB9} );
    const cylinder = new THREE.Mesh( geometry, material );
    return cylinder;
}

function createStreetLightWhite(){
    const geometry = new THREE.BoxGeometry(15, 15, 5);
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff});
    const box = new THREE.Mesh( geometry, material );
    box.rotation.x = 1.5708; //90 degrees in radians
    
    return box;
}

function createMoonAndStars(){
    const moonAndStars = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(40,33,33);
    const material = new THREE.MeshBasicMaterial( {color: 0xB6B5B4} );
    const moon = new THREE.Mesh( geometry, material );
    //cylinder.rotation.x = 1.5708; //90 degrees in radians
    
    const geometry1 = new THREE.SphereGeometry(5,33,33);
    const material1 = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    const star1 = new THREE.Mesh( geometry1, material1 );
    
    const geometry2 = new THREE.SphereGeometry(4,33,33);
    const material2 = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    const star2 = new THREE.Mesh( geometry2, material2 );
    
    const geometry3 = new THREE.SphereGeometry(5,33,33);
    const material3 = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    const star3 = new THREE.Mesh( geometry3, material3 );
    
    star1.position.set(-100,100,100);
    star2.position.set(-90,10,70);
    star3.position.set(-50,50,50);
    
    moonAndStars.add(moon);
    moonAndStars.add(star1);
    moonAndStars.add(star2);
    moonAndStars.add(star3);
    
    return moonAndStars;   
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

function getBusFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#72B8C1";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getBusSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#72B8C1";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  //context.fillRect(1, 1, 1, 0);
  context.fillRect(30, 2, 100, 10);

  return new THREE.CanvasTexture(canvas);
}

function getTruckFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#a52523";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getTruckSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#a52523";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(1, 1, 1, 0);
  context.fillRect(30, 2, 100, 10);

  return new THREE.CanvasTexture(canvas);
}

function getBuildingFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getBuildingSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  //context.fillRect(1, 1, 1, 0);
  context.fillRect(30, 2, 100, 10);

  return new THREE.CanvasTexture(canvas);
}


var carDirection = new THREE.Vector3(0.3, 0, 0); // amount to move per frame
var busDirection = new THREE.Vector3(-0.3, 0, 0);
var truckDirection = new THREE.Vector3(0, 0, 0.3);

function moveTransport(){
    if(moveVehicle){
        if(randomSelectVehicle == 1){
            car.position.add(carDirection);
        }
        
        else if(randomSelectVehicle == 2){
            bus.position.add(busDirection);
        }
        
        else if(randomSelectVehicle == 3){
            truck.position.add(truckDirection);
        }
    }
}

function sceneToggle(){
    if(!dayTime)
    {
        renderer.setClearColor(nightSceneColor);
        ambientLight.intensity = 0.5;
		spotLight.intensity = 0.5;
		scene.add(pointLight);
    }
    
    else
    {
        renderer.setClearColor(daySceneColor);
        ambientLight.intensity = 1;
		spotLight.intensity = 0.75;
		scene.remove(pointLight);
    }
}
    
// Render the scene.
function animate() {
    moveTransport();
    sceneToggle();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();