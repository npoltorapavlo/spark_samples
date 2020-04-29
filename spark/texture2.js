class Shader {
  constructor(vertexSource, fragmentSource, attributes, dispatcher) {
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;
    this.attributes = attributes;

    dispatcher.emit('init', this.init.bind(this));
  }

  static createShader(source, type, stage) {
    let gl = stage.gl;

    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Could not initialise vertex shader");
    }

    return shader;
  }

  init(stage) {
    let gl = stage.gl;

    this.vertexShader = Shader.createShader(this.vertexSource, gl.VERTEX_SHADER, stage);
    this.fragmentShader = Shader.createShader(this.fragmentSource, gl.FRAGMENT_SHADER, stage);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);

    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      console.error("Could not link program");
    }

    this.attributes.forEach(a => this[a] = gl.getAttribLocation(this.shaderProgram, a));
  }

  use(stage) {
    let gl = stage.gl;

    gl.useProgram(this.shaderProgram);
    this.attributes.forEach(a => gl.enableVertexAttribArray(this[a]));
  }
}

const solidColorVertexShader = "attribute vec2 position;\n" +
  "attribute vec3 color;\n" +
  "varying vec4 vColor;\n" +
  "void main(void) {\n" +
  "  gl_Position = vec4(position, 0.0, 1.0);\n" +
  "  vColor = vec4(color, 1.0);\n" +
  "}\n";

const solidColorFragmentShader = "varying vec4 vColor;\n" +
  "void main(void) {\n" +
  "  gl_FragColor = vColor;\n" +
  "}\n";

class SolidColorShader extends Shader {
  constructor(dispatcher) {
    super(solidColorVertexShader, solidColorFragmentShader, ["position", "color"], dispatcher);
  }

  use(stage) {
    super.use(stage);

    let gl = stage.gl;

    gl.vertexAttribPointer(this["position"], 2, gl.FLOAT, false, 5*4, 0);
    gl.vertexAttribPointer(this["color"], 3, gl.FLOAT, false, 5*4, 2*4);
  }
}

class Element {
  constructor(x, y, w, h, dispatcher) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    dispatcher.on('drawFrame', this.draw.bind(this));
    dispatcher.emit('init', this.init.bind(this));
  }

  init(stage) {}

  draw(stage) {}
}

class Rectangle extends Element {
  constructor(shader, x, y, w, h, dispatcher) {
    super(x, y, w, h, dispatcher);
    this.shader = shader;
  }

  init(stage) {
    let gl = stage.gl;

    this.top = 1 - this.y / stage.h * 2;
    this.bottom = 1 - (this.y + this.h) / stage.h * 2;
    this.left = this.x / stage.w * 2 - 1;
    this.right = (this.x + this.w) / stage.w * 2 - 1;

    this.vbo = gl.createBuffer();
    this.vertices = [
      this.left, this.top, 1.0, 0.0, 0.0,
      this.right, this.top, 0.0, 1.0, 0.0,
      this.right, this.bottom, 0.0, 0.0, 1.0,
      this.left, this.bottom, 1.0, 1.0, 1.0,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.ebo = gl.createBuffer();
    this.elements = [
      0, 1, 2,
      2, 3, 0
    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  draw(stage) {
    let gl = stage.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);

    this.shader.use(stage);

    gl.drawElements(gl.TRIANGLES, this.elements.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

class Stage {
  constructor(w, h, dispatcher) {
    this.w = w;
    this.h = h;
    this.dispatcher = dispatcher;
    this.gl = sparkgles2.init({width: w, height: h, title: "test", fullscreen: false});

    let self = this;
    this.dispatcher.on('init', listener => listener(self));
  }

  startLoop() {
    this._looping = true;
    if (!this._awaitingLoop) {
      this.loop()
    }
  }

  stopLoop() {
    this._looping = false
  }

  loop() {
    let self = this;
    let lp = function () {
      self._awaitingLoop = false;
      if (self._looping) {
        self.drawFrame();
        if (self.changes) {
          setImmediate(lp);
        } else {
          setTimeout(lp, 32);
        }
        self._awaitingLoop = true
      }
    };
    setTimeout(lp, 32)
  }

  drawFrame() {
    let gl = this.gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.dispatcher.emit('drawFrame', this);
  }
}

const EventEmitter = require('events');
let dispatcher = new EventEmitter();

new Stage(1280, 720, dispatcher).startLoop();

let solidShader = new SolidColorShader(dispatcher);

new Rectangle(solidShader, 0, 0, 128, 72, dispatcher);
