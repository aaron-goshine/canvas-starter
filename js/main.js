let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let markerTypes = {
  'prediction': {
    'color': 'purple'
  },
  'result': {
    'color': 'green'
  },
  'maker': {
    'color': 'blue'
  }

};

// setInterval(drawStage, 100);

function generateNextLocalion () {
  let x = canvas.width * Math.random();
  let y = canvas.height * Math.random();
  return { 'x': x, 'y': y };
}

function snapToGrid (point) {
  let x = point.x - (point.x % 10);
  let y = point.y - (point.y % 10);
  return { x: x, y: y };
}

function drawMarker (ctx, point, type) {
  ctx.fillStyle = markerTypes[type].color;
  point = snapToGrid(point);
  ctx.fillRect(point.x - 5, point.y - 5, 10, 10);
}

let marks = 0;
let cPoints = [];
canvas.addEventListener('click', function (event) {
  var rect = canvas.getBoundingClientRect();
  let mp = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  cPoints.push(mp);

  if (marks < 3) {
    drawMarker(ctx, mp, 'prediction');
  }

  if (marks === 3) {
    let tx = 0;
    let ty = 0;

    cPoints.forEach(function (d, i) {
      tx += d.x;
      ty += d.y;
    });

    let amp = {
      x: tx / cPoints.length,
      y: ty / cPoints.length
    };

    let np = generateNextLocalion();
    drawMarker(ctx, np, 'result');
    drawMarker(ctx, amp, 'maker');
    np = snapToGrid(np);
    amp = snapToGrid(amp);
    ctx.beginPath();
    ctx.moveTo(np.x, np.y);
    ctx.lineTo(amp.x, amp.y);
    ctx.stroke();
    let distance = calulateDistance(np, amp);
    console.log(distance);
  }

  marks++;
  if (marks > 4) {
    cPoints = [];
    marks = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

function calulateDistance (p1, p2) {
  let d = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
  return Math.sqrt(d);
}
