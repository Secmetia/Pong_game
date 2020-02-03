window.onload = function init() {
  const [gl, aspect] = setupWebGL();
  const gos = new GameObjects(gl);
  const gui = new GUI(aspect);
  start(gos.gameObjects);
  render(gl, gos.gameObjects, gui);
};


class Script {
  constructor() {
    this.gameObject = -1;
    this.gameObjects = {};
  }
  start() { }
  update() {

  }
  onCollision() { }
}
var blueloc = 0;
var redloc = 0;
var loc = 0;

var velocity = [-0.010, 0, 0.000];
class BlueCubeScript extends Script {
  constructor() {
    super();
  }
  start() {
    this.initialTranslation = this.gameObject.transform.translation;
  }

  update() {
    // update function runs for each draw operation
    /* this.gameObject.transform.rotation = mult(
       rotateY(1),
       this.gameObject.transform.rotation
     );
 */



    var dt = GameTime.deltaTime;
    var scaledVelocity = scale(dt, velocity);
    var changeMatrix = translate(scaledVelocity);
    this.gameObject.transform.translation = mult(
      changeMatrix,
      this.gameObject.transform.translation

    );
    /*
        this.gameObject.transform.scaling = mult(
          scalem(0.99, 0.99, 0.99),
          this.gameObject.transform.scaling
        );
    */
    const t = this.gameObject.transform.translation;
    const x = t[0][3];
    const y = t[1][3];
    const z = t[2][3];

    if (x > 10 || z > 10) {
      this.gameObject.transform.translation = this.initialTranslation;
      this.gameObject.transform.scaling = mat4();
    }
    var bluepad = this.gameObjects["blueCube"];
    var redpad = this.gameObjects["redCube"];

    document.onkeydown = function (event) {
      var key_press = String.fromCharCode(event.keyCode);
      var key_code = event.keyCode;
      if (key_press == "W" && blueloc > -9.5) {
        blueloc -= 0.25
        bluepad.transform.translation = translate(-9.5, 0, blueloc);
        blueloc -= 0.25
        bluepad.transform.translation = translate(-9.5, 0, blueloc);
      }
      if (key_press == "S" && blueloc < 4.5) {
        blueloc += 0.25
        bluepad.transform.translation = translate(-9.5, 0, blueloc);
        blueloc += 0.25
        bluepad.transform.translation = translate(-9.5, 0, blueloc);
      }
    }

    window.onmousemove = logMouseMove;

    function logMouseMove(e) {
      e = event || window.event;

      if (e.clientY < 250 && redloc < 0 && redloc > -3) {
        redloc -= 0.05
        redpad.transform.translation = translate(9.5, 0, redloc);
        redloc -= 0.05
        redpad.transform.translation = translate(9.5, 0, redloc);
      }
      else if (e.clientY > 310 && redloc > 0 && redloc < 3) {
        redloc += 0.05
        redpad.transform.translation = translate(9.5, 0, redloc);
        redloc += 0.05
        redpad.transform.translation = translate(9.5, 0, redloc);
      }

      /*else if (e.clientY<250 && redloc<=-3 && redloc >-6){
        redloc -=0.075
        redpad.transform.translation = translate(9.5,0,redloc);
        redloc -=0.075
        redpad.transform.translation = translate(9.5,0,redloc);
      }
        else if( e.clientY>310 && redloc >3 && redloc <6){
                redloc +=0.075
                redpad.transform.translation = translate(9.5,0,redloc);
                redloc +=0.075
                redpad.transform.translation = translate(9.5,0,redloc); }*/

      else if (e.clientY < 260 && redloc > -9.5) {
        redloc -= 0.1
        redpad.transform.translation = translate(9.5, 0, redloc);
        redloc -= 0.1
        redpad.transform.translation = translate(9.5, 0, redloc);


      }
      else if (e.clientY > 350 && redloc < 4.5) {
        redloc += 0.1
        redpad.transform.translation = translate(9.5, 0, redloc);
        redloc += 0.1
        redpad.transform.translation = translate(9.5, 0, redloc);

      }
    }


  }

  onCollision(other) {
    var ourball = this.gameObjects["Ball"];
    ourball.transform.scaling = scalem(1, 1, 0.2);

    if (other.name === "blueCube") {

      velocity[0] = 0.01
      velocity[2] = (Math.random() * (0.01 - (-0.01)) + (-0.01)).toFixed(3)
    }
    else if (other.name === "redCube") {
      velocity[0] = -0.01
      velocity[2] = (Math.random() * (0.01 - (-0.01)) + (-0.01)).toFixed(3)
    }

    else if (other.name === "Left" || other.name === "Right") {
      velocity[0] = 0;
      velocity[2] = 0;
    }
    else if (other.name === "Top" || other.name === "Bottom") {
      velocity[2] = velocity[2] * (-1);
    }
  }
}

class GameObjects {
  constructor(gl) {
    const gameObjects = {};
    this.gameObjects = gameObjects;

    gameObjects["blueCube"] = new Cube(
      "blueCube",
      gl,
      vec4(1.0, 0.0, 1.0, 1.0),


      new Transform({ translation: translate(-9.5, 0, blueloc) })
    );
   


    gameObjects["redCube"] = new Cube(
      "redCube",
      gl,
      vec4(1.0, 0.5, 0.0, 1.0),

      new Transform({ translation: translate(9.5, 0, redloc) })
    );

    gameObjects["Ball"] = new Cube(
      "Ball",
      gl,
      vec4(0.5, 0.5, 0., 1.0),
      
      new Transform({ scaling: scalem(1, 1, 0.2), translation: translate(loc, 0, 0) })

    );
    const script = new BlueCubeScript();
    script.gameObject = gameObjects["Ball"];
    script.gameObjects = this.gameObjects;
    gameObjects["Ball"].component.script = script;



    //// The simulation ground
    gameObjects["ground"] = new Cube(
      "ground",
      gl,
      vec4(0.0, 1.0, 0.0, 1.0),
      new Transform({ scaling: scalem(20, 0.1, 3.5), translation: translate(0, 0, -9) })
    );
    //// borders

    gameObjects["Top"] = new Cube(
      "Top",
      gl,
      vec4(0.0, 0.0, 1.0, 1.0),

      new Transform({ scaling: scalem(19.9, 1, 0.1), translation: translate(0, 0, -10) })
    );
    gameObjects["Bottom"] = new Cube(
      "Bottom",
      gl,
      vec4(0.0, 0.0, 1.0, 1.0),
      new Transform({ scaling: scalem(19.9, 1, 0.1), translation: translate(0, 0, 10) })
    );
    gameObjects["Left"] = new Cube(
      "Left",
      gl,
      vec4(0.0, 0.0, 1.0, 1.0),
      new Transform({ scaling: scalem(0.1, 1, 3.37), translation: translate(-10, 0, -8) })
    );
    gameObjects["Right"] = new Cube(
      "Right",
      gl,
      vec4(0.0, 0.0, 1.0, 1.0),
      new Transform({ scaling: scalem(0.1, 1, 3.37), translation: translate(10, 0, -8) })
    );
  }
}

function mults(scalar, transform) {
  return mult(scalem(scalar, scalar, scalar), transform);
}

//// time functionality
class GameTime {
  static deltaTime = 0;
  static timestamp = -1;

  static updateTimestamp(timestamp) {
    if (GameTime.timestamp < 0) GameTime.timestamp = timestamp;
    GameTime.deltaTime = timestamp - GameTime.timestamp;
    GameTime.timestamp = timestamp;
  }
}

//// camera parameters

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

//// a class that represents the gameobject transform matrices
class Transform {
  constructor({
    scaling = mat4(),
    rotation = mat4(),
    translation = mat4()
  } = {}) {
    this.scaling = scaling;
    this.rotation = rotation;
    this.translation = translation;
  }
  modelMatrix() {
    return mult(this.translation, mult(this.rotation, this.scaling));
  }
}

class NaiveCollider {
  constructor(gameObject, vertices) {
    this.vertices = vertices;
    this.gameObject = gameObject;
  }

  detectsCollisionWith(other) {
    // iterate over vertices of the other, if any vertice is inside
    // then we have a collision
    const otherVertices = other.transformedVertices();
    const inverseTransform = inverse4(this.gameObject.transform.modelMatrix());

    for (const otherVertice of otherVertices) {
      if (this.includes(mult(inverseTransform, otherVertice))) return true;
    }
    return false;
  }

  transformedVertices() {
    const vertices = [];
    const modelMatrix = this.gameObject.transform.modelMatrix();
    for (const vertice of this.vertices) {
      vertices.push(mult(modelMatrix, vertice));
    }
    return vertices;
  }
}

class NaiveBoxCollider extends NaiveCollider {
  constructor(gameObject, vertices) {
    super(gameObject, vertices);
  }
  includes(v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    if (-0.25 <= x && x <= 0.25 && 0 <= y && y <= 1 && 0 <= z && z <= 4.5) {
      return true;
    }
    return false;
  }
}

//// base class for game objects
class GameObject {
  constructor(name, gl, transform) {
    this.component = {};

    //// WebGL rendering context
    this.gl = gl;
    this.name = name;

    //// the program objects obtained from shaders
    ////this.program = initShaders(gl, "vertex-shader", "fragment-shader");

    //// Model view projection matrices
    this.transform = transform;
    this.viewMatrix = mat4();
    this.projectionMatrix = mat4();
    this.vertexShader = "";
    this.fragmentShader = "";

    this.collider = -1;
    this.collidesWith = [];

    this.updateFunction = -1;
    this.startFunction = -1;
  }

  _compileShader(type, src) {
    const shader = this.gl.createShader(type, src);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  //// prepares a program object from shaders
  createProgram() {
    const vertexShader = this._compileShader(
      this.gl.VERTEX_SHADER,
      this.vertexShader
    );
    const fragmentShader = this._compileShader(
      this.gl.FRAGMENT_SHADER,
      this.fragmentShader
    );

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
    }
    return this.program;
  }

  detectsCollisionWith(other) {
    if (this.collider === -1) return false;
    if (other.collider === -1) return false;
    if (this.collider.detectsCollisionWith(other.collider)) return true;

    return false;
  }
}

//// Cube is a game object
class Cube extends GameObject {
  constructor(name, gl, color, transform) {
    super(name, gl, transform);
    //// webgl stuff
    this.createVertexShader();
    this.createFragmentShader();
    this.program = this.createProgram();

    //// Model buffers and attributes
    [this.pointsArray, this.colorsArray] = cubePointsAndColors(color);
    this.numVertices = 36;
    this.collisionRadius = mult(translate(0, 0.5, 0), scalem(0.5, 0.5, 0.5));
    this.initAttributeBuffers();

    this.collider = new NaiveBoxCollider(this, cubeVertices());

    //// Uniform Locations
    this.modelViewProjectionMatrixLoc = gl.getUniformLocation(
      this.program,
      "modelViewProjectionMatrix"
    );
  }

  createVertexShader() {
    this.vertexShader = ` 

    precision mediump int;
    precision mediump float;

    // Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform
uniform mat4 u_VM_transform;  // View, model transform
    
// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;
uniform vec3 u_Ambient_color;
    
// Original model data
attribute vec3 a_Vertex;
attribute vec3 a_Color;
attribute vec3 a_Vertex_normal;


// Data (to be interpolated) that is passed on to the fragment shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;



      attribute  vec4 vPosition;
      attribute  vec4 vColor;
      varying vec4 fColor;

      uniform mat4 modelViewProjectionMatrix;

      void main()
      {
        // Perform the model and view transformations on the vertex and pass this
        // location to the fragment shader.
        v_Vertex = vec3( u_VM_transform * vec4(a_Vertex, 1.0) );
      
        // Perform the model and view transformations on the vertex's normal vector
        // and pass this normal vector to the fragment shader.
        v_Normal = vec3( u_VM_transform * vec4(a_Vertex_normal, 0.0) );
      
        // Pass the vertex's color to the fragment shader.
        v_Color = vec4(a_Color, 1.0);
      
        // Transform the location of the vertex for the rest of the graphics pipeline
       // gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);


        gl_Position = modelViewProjectionMatrix * vPosition;
        fColor = vColor;
      }
    `;
    return this.vertexShader;
  }

  createFragmentShader() {
    this.fragmentShader = `

    precision mediump int;
    precision mediump float;

    // Light model
    uniform vec3 u_Light_position;
    uniform vec3 u_Light_color;
    uniform float u_Shininess;
    uniform vec3 u_Ambient_color;
    
// Data coming from the vertex shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;


      #ifdef GL_ES
      precision highp float;
      #endif


      varying vec4 fColor;

      void
      main()
      { vec3 to_light;
        vec3 vertex_normal;
        vec3 reflection;
        vec3 to_camera;
        float cos_angle;
        vec3 diffuse_color;
        vec3 specular_color;
        vec3 ambient_color;
        vec3 color;

        // Calculate the ambient color as a percentage of the surface color
  ambient_color = u_Ambient_color * vec3(v_Color);

  // Calculate a vector from the fragment location to the light source
  to_light = u_Light_position - v_Vertex;
  to_light = normalize( to_light );

  // The vertex's normal vector is being interpolated across the primitive
  // which can make it un-normalized. So normalize the vertex's normal vector.
  vertex_normal = normalize( v_Normal );

  // Calculate the cosine of the angle between the vertex's normal vector
  // and the vector going to the light.
  cos_angle = dot(vertex_normal, to_light);
  cos_angle = clamp(cos_angle, 0.0, 1.0);

  // Scale the color of this fragment based on its angle to the light.
  diffuse_color = vec3(v_Color) * cos_angle;

  // Calculate the reflection vector
  reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;

  // Calculate a vector from the fragment location to the camera.
  // The camera is at the origin, so negating the vertex location gives the vector
  to_camera = -1.0 * v_Vertex;

  // Calculate the cosine of the angle between the reflection vector
  // and the vector going to the camera.
  reflection = normalize( reflection );
  to_camera = normalize( to_camera );
  cos_angle = dot(reflection, to_camera);
  cos_angle = clamp(cos_angle, 0.0, 1.0);
  cos_angle = pow(cos_angle, u_Shininess);

  // The specular color is from the light source, not the object
  if (cos_angle > 0.0) {
    specular_color = u_Light_color * cos_angle;
    diffuse_color = diffuse_color * (1.0 - cos_angle);
  } else {
    specular_color = vec3(0.0, 0.0, 0.0);
  }

  color = ambient_color + diffuse_color + specular_color;

  //gl_FragColor = vec4(color, fColor);


          gl_FragColor = fColor;
      }
    `;
    return this.fragmentShader;
  }
  initAttributeBuffers() {
    //// color attribute
    this.cBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      flatten(this.colorsArray),
      this.gl.STATIC_DRAW
    );
    this.vColor = this.gl.getAttribLocation(this.program, "vColor");

    //// position attribute
    this.vBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      flatten(this.pointsArray),
      this.gl.STATIC_DRAW
    );
    this.vPosition = this.gl.getAttribLocation(this.program, "vPosition");
  }

  draw() {
    //// switch to this objects program
    this.gl.useProgram(this.program);

    //// color attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.vertexAttribPointer(this.vColor, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vColor);

    //// position attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
    this.gl.vertexAttribPointer(this.vPosition, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vPosition);

    //// compute modelViewProjectionMatrix
    const modelViewProjectionMatrix = mult(
      this.projectionMatrix,
      mult(this.viewMatrix, this.transform.modelMatrix())
    );
    //// gpu modelViewProjectionMatrix
    this.gl.uniformMatrix4fv(
      this.modelViewProjectionMatrixLoc,
      false,
      flatten(modelViewProjectionMatrix)
    );

    //// draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);

    //// disable vaa's
    this.gl.disableVertexAttribArray(this.vColor);
    this.gl.disableVertexAttribArray(this.vPosition);
  }
} // class Cube

function start(gameObjects) {
  for (const gameObject of Object.values(gameObjects)) {
    if (gameObject.component.script) gameObject.component.script.start();
  }
}

function render(gl, gameObjects, gui, timestamp) {
  ////// GameEngine related
  //// update game time
  if (timestamp) GameTime.updateTimestamp(timestamp);

  //// detect all collisions
  const objects = Object.values(gameObjects);
  for (const object of objects) object.collidesWith = [];
  for (let i = 0; i < objects.length; i++) {
    const current = objects[i];
    for (let j = i + 1; j < objects.length; j++) {
      const other = objects[j];
      if (
        current.detectsCollisionWith(other) ||
        other.detectsCollisionWith(current)
      ) {
        current.collidesWith.push(other);
        other.collidesWith.push(current);
      }
    }
  }

  //// handle all collisions
  for (const gameObject of Object.values(gameObjects)) {
    if (gameObject.component.script) {
      for (const other of gameObject.collidesWith) {
        gameObject.component.script.onCollision(other);
      }
    }
  }

  //// update all objects
  for (const gameObject of Object.values(gameObjects)) {
    if (gameObject.component.script) gameObject.component.script.update();
  }

  ////// WebGL related
  //// clear the background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //// camera settings
  eye = sphericalEye(
    gui.radius.slider.value,
    gui.theta.slider.value * (Math.PI / 180),
    gui.phi.slider.value * (Math.PI / 180)
  );
  const viewMatrix = lookAt(eye, at, up);
  const projectionMatrix = perspective(
    gui.fovy.slider.value,
    gui.aspect.slider.value,
    gui.near.slider.value,
    gui.far.slider.value
  );

  //// draw all objects
  for (const gameObject of Object.values(gameObjects)) {
    gameObject.viewMatrix = viewMatrix;
    gameObject.projectionMatrix = projectionMatrix;
    gameObject.draw();
  }

  //// call self for recursion
  requestAnimFrame(timestamp => render(gl, gameObjects, gui, timestamp));
}

function setupWebGL() {
  const canvas = document.getElementById("canvas1");
  const gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.error("Could not set up WebGL");
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  aspect = canvas.width / canvas.height;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  return [gl, aspect];
}

class Slider {
  constructor(id, min, max, step, value, divId) {
    //// create - get elements
    this.div = document.getElementById(divId);
    this.labelSpan = document.createElement("span");
    this.slider = document.createElement("input");

    //// set up elements
    this.labelSpan.setAttribute("id", id + "LabelSpan");
    this.labelSpan.innerHTML = value;

    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("min", min);
    this.slider.setAttribute("max", max);
    this.slider.setAttribute("step", step);
    this.slider.setAttribute("id", id);
    this.slider.setAttribute("value", value);
    this.slider.oninput = function (event) {
      document.getElementById(id + "LabelSpan").innerHTML = event.target.value;
    };

    //// build the hierarchy
    this.div.appendChild(document.createTextNode(this.slider.id + " "));
    this.div.appendChild(document.createTextNode(this.slider.min));
    this.div.appendChild(this.slider);
    this.div.appendChild(document.createTextNode(this.slider.max + " ("));
    this.div.appendChild(this.labelSpan);
    this.div.appendChild(document.createTextNode(")"));
  }
}

class Text {
  constructor(text, divId) {
    document
      .getElementById(divId)
      .appendChild(
        document
          .createElement("span")
          .appendChild(document.createTextNode(text))
      );
  }
}
class Br {
  constructor(divId) {
    document.getElementById(divId).appendChild(document.createElement("br"));
  }
}
class Hr {
  constructor(divId) {
    document.getElementById(divId).appendChild(document.createElement("hr"));
  }
}
class GUI {
  constructor(aspect) {
    new Hr("cam-props");
    new Text("Camera Position", "cam-props");
    new Br("cam-props");
    this.radius = new Slider("radius", 0.05, 100, 1, 17, "cam-props");
    new Br("cam-props");
    this.theta = new Slider("theta", -90, 90, 1, -55, "cam-props");
    new Br("cam-props");
    this.phi = new Slider("phi", -90, 90, 1, -90, "cam-props");

    new Hr("cam-props");
    new Text("Camera Projection", "cam-props");
    new Br("cam-props");
    this.near = new Slider("near", 0.01, 3, 0.01, 0.1, "cam-props");
    new Br("cam-props");
    this.far = new Slider("far", 3, 1000, 1, 1000, "cam-props");
    new Br("cam-props");
    this.fovy = new Slider("fovy", 10, 120, 1, 90, "cam-props");
    new Br("cam-props");
    this.aspect = new Slider("aspect", 0.01, 10, 0.1, aspect, "cam-props");
    new Hr("cam-props");
  }
}

////
function cubeVertices() {
  return [
    vec4(-0.5, 0, 5.5, 1.0),
    vec4(-0.5, 1, 5.5, 1.0),
    vec4(0.5, 1, 5.5, 1.0),
    vec4(0.5, 0, 5.5, 1.0),
    vec4(-0.5, 0, -0.5, 1.0),
    vec4(-0.5, 1, -0.5, 1.0),
    vec4(0.5, 1, -0.5, 1.0),
    vec4(0.5, 0, -0.5, 1.0)
  ];
}

function cubePointsAndColors(color) {
  const points = [];
  const colors = [];
  const vertices = cubeVertices();
  const colorList = [color, color, color, color, color, color, color, color];

  // each 3 index is a triangle. each 6 index is a face.
  // prettier-ignore
  const indices = [1, 0, 3, 1, 3, 2, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 6, 5, 1, 6, 1, 2, 4, 5, 6, 4, 6, 7, 5, 4, 0, 5, 0, 1];
  for (let i of indices) {
    points.push(vertices[i]);
    colors.push(colorList[i]);
  }
  return [points, colors];
}

////
function sphericalEye(radius, theta, phi) {
  return vec3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );
}
