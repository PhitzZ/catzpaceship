document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            moveCraft('left');
        } else {
            moveCraft('right');
        }
    } else {
        if (yDiff > 0) {
            firePly();
        }
    }

    xDown = null;
    yDown = null;
}

function moveCraft(direction) {
    if (gameState) {
        let currentLeft = parseInt(ply.css('left'));
        let moveAmount = 20;
        
        if (direction === 'left') {
            ply.css('left', Math.max(0, currentLeft - moveAmount));
        } else {
            ply.css('left', Math.min(dW - ply.width(), currentLeft + moveAmount));
        }
    }
}

$(document).on('mousemove touchmove', function(e) {
    if (gameState) {
        let pageX = e.type === 'touchmove' ? e.originalEvent.touches[0].pageX : e.pageX;
        ply.css({
            left: Math.min(Math.max(pageX - ply.width() / 2, 0), dW - ply.width())
        });
    }
});

$(document).on('click touchstart', function(e) {
    if (gameState) {
        firePly();
        e.preventDefault();
    }
});



ply = $(".p");
over = $(".o");

pre = () => {
  dW = $(document).width();
  dH = $(document).height();
  inMove = false;
  timerAlive = false;
  inFire = false;
  hLock = false;
  gameState = false;
  $(".shot").prop("volume", 0.3);
  $(".blop").prop("volume", 0.4);
  $(".bgm").prop("volume", 0.15);
  $(".wow").prop("volume", 0.6);
  $(".good").prop("volume", 0.3);
  $(".thehell").prop("volume", 0.15);
  loadAstStar();
};

init = () => {
  score = 0;
  health = 100;
  cQ = 0;
  qDone = false;
  bhSpawn = false;
  hp();
  gameRunner();
  ai();
  quests = [
  ["Mission 1: Feed 100 catz", 100, false],
  ["Mission 2: Feed 200 catz, for a Whiskaz!", 200, false],
  ["Mission 3: Feed 300 catz", 300, false],
  ["Mission 4: Feed 400 catz", 400, false],
  ["Mission 5: Feed 500 catz, for a Reward.", 500, false],
  ["Final Mission: Feed 1000 catz, for a Whiskaz!", 1000, false]];

  questing();
};

$(window).on("resize", () => {
  dW = $(document).width();
  dH = $(document).height();
});

scores = () => {
  score++;
  $(".s").text(score);
  questing();
};

resetObj = () => {
  for (i = 0; i < quests.length; i++) {
    quests[i][2] = false;
  }
  bhSpawn = false;
  $(".bh").fadeOut(1000);
  score = -1;
  cQ = 0;
  scores();
};

questing = () => {
  var qo = $(".qo");
  if (qDone == false) {
    if (quests[cQ][2] == false) {
      if (cQ != 0) {
        var prev = quests[cQ - 1][0];
        qo.html("<del>" + prev + "</del>" + "</br></br><ins>" + quests[cQ][0] + "</ins>");
      } else {
        qo.html("<ins>" + quests[cQ][0] + "</ins>");
      }
      if (score == quests[cQ][1]) {
        if (score == quests[5][1] || score == quests[1][1]) {
          blackHole();
          $(".wow").get(0).play();
        }
        if (score == quests[4][1]) {
          health = 100;
          $(".good").get(0).play();
          hp();
        }
        quests[cQ][2] = true;
        if (cQ == quests.length - 1) {
          qDone = true;
          qo.text("All objectives complete.");
        } else {
          cQ++;
        }
      }
    }
  }
};

hp = a => {
  if (a == true) {
    health = (health - asteroids.length / 5).toFixed();
    over.show();
    over.fadeOut(300);
    if (health <= 0) {
      health = 100;
      resetObj();
      hp();
    }
  }
  $(".hb .h").css("width", +health + "%");
  $(".hb .h").text(health);
};

removeClass = () => {
  var movement = ["left", "right"];
  for (i = 0; i < movement.length; i++) {
    $(".craft").removeClass(movement[i]);
  }
};

firePly = () => {
  inFire = true;
  aniShot();
  $(".l").css("visibility", "visible");
  $(".shot").get(0).pause();
  $(".shot").get(0).currentTime = 0;
  $(".shot").get(0).play();
};

$(document).mousemove(e => {
  if (gameState == true) {
    ply.css({
      left: e.pageX - ply.width() / 2 });
  }
});

$(document).click(() => {
  if (gameState == true) {
    firePly();
  }
});


followShip = () => {
  var laser = $(".l");
  if (inFire == false) {
    laser.css({
      top: ply.offset().top + ply.height() / 2,
      left: ply.offset().left + ply.width() / 2 - laser.width() / 2,
      "visibility": "hidden" });

  } else {
    aniShot();
  }
};

loadAstStar = () => {
  asteroids = new Array();
  stars = new Array();
  sizes = new Array();
  speeds = new Array();
  $(".rock").each(function (i) {
    asteroids.push($(this));
  });
  $(".rock1").each(function (i) {
    asteroids.push($(this));
  });
  $(".rock2").each(function (i) {
    asteroids.push($(this));
  });
  $(".rock3").each(function (i) {
    asteroids.push($(this));
  });
  $(".rock4").each(function (i) {
    asteroids.push($(this));
  });
  $(".star").each(function (i) {
    stars.push($(this));
    sizes.push(Math.random());
    speeds.push(Math.random() * dH / 80);
  });
  posAstStar(asteroids, true);
  posAstStar(stars, false);
  init();
};

posAstStar = (o, ig) => {
  $(o).each(function (i) {
    var constrains = dW - $(this).width();
    var left = Math.random() * constrains;
    $(this).css({
      left: left,
      top: $(this).height() * -1 - 80 });

    if (ig == false) {
      $(this).css("transform", "scale(" + sizes[i] + "," + sizes[i] + ")");
    }
  });
  if (ig == false) {
    astRdy = true;
  }
};

aniAst = () => {
  $(asteroids).each(function (i) {
    var o = asteroids[i];
    var oT = o.offset().top;
    if (oT <= dH) {
      o.css({
        top: oT + Math.random() * speeds[i] });

    } else {
      var constrains = dW - $(o).width();
      var left = Math.random() * constrains;
      o.css({
        left: left,
        top: o.height() * -1,
        opacity: 1 });

      hp(true);
    }
  });
};

aniStar = () => {
  $(stars).each(function (i) {
    var o = stars[i];
    var oT = o.offset().top;
    if (oT <= dH) {
      o.css({
        top: oT + Math.random() * speeds[i] * 1.5 });

    } else {
      o.css({
        left: Math.random() * dW,
        top: o.height() * -1,
        opacity: 1 });

    }
  });
};

aniShot = () => {
  var l = $(".l");
  var lT = l.offset().top;
  if (lT > 0 - l.height()) {
    l.css({
      top: lT - dH / 20 });

  } else {
    inFire = false;
  }
};

resetAst = (o, left) => {
  o.animate({
    opacity: 0 },
  150, function () {
    o.css({
      left: left,
      top: o.height() * -1 - 80,
      opacity: 1 });

  });
};

colCheck = () => {
  var l = $(".l");
  $(asteroids).each(function (i) {
    var o = $(this);
    var oTh = o.offset().top + o.height() / 2;
    var pT = ply.offset().top;
    var bH = $(".bh");
    var constrains = dW - $(o).width();
    var left = Math.random() * constrains;
    if (parseFloat(oTh.toFixed(0)) >= parseFloat(pT.toFixed(0)) && parseFloat(oTh.toFixed(0)) - speeds[i] <= parseFloat(pT.toFixed(0))) {
      if (o.offset().left < ply.offset().left.toFixed() && o.offset().left + o.width() > ply.offset().left.toFixed()) {
        hp(true);
      }
    }
    if (bhSpawn == true) {
      if (bH.offset().top < o.offset().top && bH.offset().top + bH.height() > o.offset().top && bH.offset()) {
        if (o.offset().left + o.width() / 2 > bH.offset().left - o.width() / 2 && o.offset().left < bH.offset().left + bH.width()) {
          scores();
          resetAst(o, left);
        }
      }
    }
    if (o.offset().top < l.offset().top && o.offset().top + o.height() > l.offset().top && o.offset()) {
      if (o.offset().left < l.offset().left + l.width() && o.offset().left + o.width() > l.offset().left) {
        if (inFire == true) {
          resetAst(o, left);
          scores();
          inFire = false;
          followShip();
        }
      }
    }
  });
};

ai = () => {
  if (gameState == false) {
    var rM = Math.floor(Math.random() * asteroids.length);
    if (asteroids[rM].offset().top > 0) {
      ply.animate({
        left: asteroids[rM].offset().left + asteroids[1].width() / 2 },
      350, function () {
        firePly();
        ai();
      });
    } else {
      window.requestAnimationFrame(ai);
    }
  }
};

blackHole = () => {
  $("html").append("<div class='bh'></div>");
  var o = $(".bh");
  $(".bh").css({
    top: dH / 2 - o.height() / 2,
    left: dW / 2 - o.width() / 2 });

  $(".bh").fadeIn(1000);
  $(".blop").get(0).play();
  bhSpawn = true;
  setTimeout(() => {
    bhSpawn = false;
    $(".bh").fadeOut(1000);
  }, 30000);
};

$(".menu .b").click(() => {
  $(".menu").fadeOut(1000);
  gameState = true;
  $(".bgm").loop = true;
  $(".bgm").get(0).play();
  resetObj();
});

gameRunner = () => {
  if (astRdy == true) {
    aniAst();
    aniStar();
    colCheck();
  }
  followShip();
  window.requestAnimationFrame(gameRunner);
};

pre();
