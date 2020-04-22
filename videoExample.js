px.import({ scene:   'px:scene.1.js',
            keys:    'px:tools.keys.js'
}).then( function importsAreReady(imports) {

  let scene = imports.scene;
  let keys  = imports.keys;

  let videoObject = scene.create({
    t: "video",
    parent: scene.root,
    x: 0, y: 0, w: 1280, h: 720,
    url: "https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564674844-disney.mp4",
    autoPlay: "false"
  });
  videoObject.cx = 1280/2;
  videoObject.cy = 720/2;

  var videoAnimation = null;

  var videoPaused = true;

  scene.root.on('onPreKeyDown', function(e) {
    if (e.keyCode == keys.A ) {
      videoAnimation = videoObject.animate({r:360},5,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, -1);
    } else if (e.keyCode == keys.B ) {
      if (videoAnimation) {
        videoAnimation.cancel();
        videoAnimation = null;
      }
    }
    else if (e.keyCode == keys.C ) {
      if (videoAnimation) {
        videoAnimation.cancel();
        videoAnimation = null;
      }
      videoObject.r = 0;
    }
    else if (e.keyCode == keys.R ) {
      videoObject.position = 0;
    }
    else if (e.keyCode == keys.D ) {
      console.log(videoObject.duration);
    }
    else if (e.keyCode == keys.P ) {
      if (videoPaused) {
        videoObject.play();
      } else {
        videoObject.pause();
      }
      videoPaused = !videoPaused;
    }
  });

}).catch( function importFailed(err){
  console.error("Import failed for picturepile.js: " + err)
});

