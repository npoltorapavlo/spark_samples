var optimus;
var optimusApp;
var optimusTexture;

function drawOptimusTexture(scene, gl, w, h, cmd)
{
  if (!optimus)
    optimus = require('optimus');

  if (!optimusApp)
  {
    optimus.setScene(scene);
    optimusApp = optimus.createApplication({
      id: "1101",
      priority: 10,
      x: 0, y: 0, w: w, h: h,
      cx: 0, cy: 0, sx: 1.0, sy: 1.0, r: 0, a: 1,
      interactive: true,
      painting: true,
      clip: false,
      mask: false,
      draw: true,
      launchParams: {"cmd": cmd}
    });
  }

  optimusApp.ready.then(function () {
    optimusTexture = gl.createWebGLTexture(optimusApp.texture());
    console.log("optimusTexture="+optimusTexture._);

    gl.bindTexture(gl.TEXTURE_2D, optimusTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }).catch(e => {
    console.error(`optimus error: ${e}`);
  });

  // optimusApp.setFocus(true);
}




var external;
var westerosTexture;
var westerosScreenshot;

function drawWesterosTexture(scene, gl, w, h, cmd)
{
  if (!external)
  {
    external = scene.create({
      t: "external",
      parent: scene.root,
      cmd: cmd,
      w: w,
      h: h
    });
  }

  external.ready.then(function () {
    westerosScreenshot = external.screenshot("image/image");
    westerosTexture = gl.createWebGLTexture(westerosScreenshot.texture());
    console.log("westerosTexture="+westerosTexture._);

    gl.bindTexture(gl.TEXTURE_2D, westerosTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }).catch(e => {
    console.error(`external error: ${e}`);
  });
}




var image;
var imageTexture;

function drawImageTexture(scene, gl, url)
{
  if (!image)
    image = scene.create({t:"image", url:url});

  image.ready.then(function () {
    imageTexture = gl.createWebGLTexture(image.texture());
    console.log("imageTexture="+imageTexture._);

    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }).catch(e => {
    console.error(`image error: ${e}`);
  });
}




var noiseTexture;

function drawNoiseTexture(gl, w, h)
{
  noiseTexture = gl.createTexture();
  console.log("noiseTexture="+noiseTexture._);
  gl.bindTexture(gl.TEXTURE_2D, noiseTexture);

  const noise = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h * 4; i+=4)
  {
    const v = Math.round(Math.floor(Math.random() * 256));
    noise[i] = v;
    noise[i+1] = v;
    noise[i+2] = v;
    noise[i+3] = 255;
  }

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, noise);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}




var fragmentShader;
var vertexShader;
var shaderProgram;
var pyramidVertexPositionBuffer;

var fragmentShaderTex;
var vertexShaderTex;
var shaderProgramTex;
var texVertexPositionBuffer;

function drawTriangle(gl, w, h, texture)
{
  if (!fragmentShader)
  {
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, "void main(void) {\n" +
      "  gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);\n" +
      "}\n");
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Could not initialise shaders");
    }
  }

  if (!vertexShader)
  {
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, "attribute vec3 aPos;\n" +
      "\n" +
      "void main(void) {\n" +
      "  gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n" +
      "}");
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Could not initialise shaders");
    }
  }

  if (!shaderProgram)
  {
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Could not initialise shaders");
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");
  }

  if (!pyramidVertexPositionBuffer)
  {
    pyramidVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    var vertices = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.0,  0.5, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    pyramidVertexPositionBuffer.itemSize = 3;
    pyramidVertexPositionBuffer.numItems = 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  // ===========================

  if (!fragmentShaderTex)
  {
    fragmentShaderTex = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderTex, "varying vec2 vTextureCoord;\n" +
      "uniform sampler2D uSampler;\n" +
      "void main(void) {\n" +
      "  vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));" +
      "  gl_FragColor = vec4(textureColor.rgb, textureColor.a);\n" +
      "}\n");
    gl.compileShader(fragmentShaderTex);
    if (!gl.getShaderParameter(fragmentShaderTex, gl.COMPILE_STATUS)) {
      console.error("Could not initialise shaders");
    }
  }

  if (!vertexShaderTex)
  {
    vertexShaderTex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderTex, "attribute vec3 aPos;\n" +
      "attribute vec2 aTextureCoord;\n" +
      "varying vec2 vTextureCoord;\n" +
      "\n" +
      "void main(void) {\n" +
      "  gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n" +
      "  vTextureCoord = aTextureCoord;\n" +
      "}");
    gl.compileShader(vertexShaderTex);
    if (!gl.getShaderParameter(vertexShaderTex, gl.COMPILE_STATUS)) {
      console.error("Could not initialise shaders");
    }
  }

  if (!shaderProgramTex)
  {
    shaderProgramTex = gl.createProgram();
    gl.attachShader(shaderProgramTex, vertexShaderTex);
    gl.attachShader(shaderProgramTex, fragmentShaderTex);

    gl.linkProgram(shaderProgramTex);

    if (!gl.getProgramParameter(shaderProgramTex, gl.LINK_STATUS)) {
      console.error("Could not initialise shaders");
    }

    shaderProgramTex.vertexPositionAttribute = gl.getAttribLocation(shaderProgramTex, "aPos");
    shaderProgramTex.textureCoordAttribute = gl.getAttribLocation(shaderProgramTex, "aTextureCoord");
    shaderProgramTex.samplerUniform = gl.getUniformLocation(shaderProgramTex, "uSampler");
  }

  if (!texVertexPositionBuffer)
  {
    texVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexPositionBuffer);
    var vertices = [
      0.0, 0.0,  // lower-left corner
      1.0, 0.0,  // lower-right corner
      0.5, 1.0   // top-center corner
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    texVertexPositionBuffer.itemSize = 2;
    texVertexPositionBuffer.numItems = 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  // ===========================

  gl.viewport(0, 0, w, h);

  if (texture)
  {
    gl.useProgram(shaderProgramTex);
    gl.enableVertexAttribArray(shaderProgramTex.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgramTex.textureCoordAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramTex.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramTex.textureCoordAttribute, texVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgramTex.samplerUniform, 0);
  }
  else
  {
    gl.useProgram(shaderProgram);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  }

  gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Test...

  // gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // gl.deleteBuffer(pyramidVertexPositionBuffer);
  // pyramidVertexPositionBuffer = null;

  // gl.deleteProgram(shaderProgram);
  // shaderProgram = null;

  // gl.useProgram(null);
}




var glw = 1280;
var glh = 720;

var options = {width: glw, height: glh, title: "Triangle", fullscreen: false};
var gl = sparkgles2.init(options);

drawOptimusTexture(sparkscene, gl, 640, 360, "westeros_test");
drawWesterosTexture(sparkscene, gl, 640, 360, "westeros_test");
drawNoiseTexture(gl, 10, 10);
drawImageTexture(sparkscene, gl, "https://i.stack.imgur.com/BgHVZ.png")

function draw() {
  gl.clearColor(Math.random(), Math.random(), Math.random(), 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // drawTriangle(gl, glw, glh); // plain color
  drawTriangle(gl, glw, glh, optimusTexture||westerosTexture||imageTexture||noiseTexture);
}

function webGLStart() {
  draw();
  setInterval(function(){
    draw();
  }, 500)
}

webGLStart();
