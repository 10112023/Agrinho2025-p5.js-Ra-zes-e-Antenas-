function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
// Jogo:"Raízes e Antenas" 
let frutas = [];
let cestos = [];
let pontos = 0;
let tempo = 30;
let jogoAtivo = true;
let tiposFrutas = ["🍎", "🍌", "🍇"];
let contagemFrutas = { "🍎": 0, "🍌": 0, "🍇": 0 };
let nivel = 1;
let chuva = [];
let pragas = [];

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  gerarFrutas();
  gerarCestos();
  gerarObstaculos();
  setInterval(() => {
    if (jogoAtivo && tempo > 0) tempo--;
    if (tempo === 0) proximoNivel();
  }, 1000);
}

function draw() {
  background(240, 255, 240);
  textSize(20);
  fill(0);
  text(`Nível ${nivel} - Colha e conecte!`, width / 2, 30);
  text(`Tempo: ${tempo}s`, width / 2, 60);
  text(`Pontos: ${pontos}`, width / 2, 90);
  text(`🍎 ${contagemFrutas["🍎"]}  🍌 ${contagemFrutas["🍌"]}  🍇 ${contagemFrutas["🍇"]}`, width / 2, 120);

  // Frutas
  for (let fruta of frutas) {
    text(fruta.tipo, fruta.x, fruta.y);
    fruta.y += fruta.vel;
  }

  // Colisão automática com o cesto
  for (let i = frutas.length - 1; i >= 0; i--) {
    let f = frutas[i];
    let c = cestos[0];
    if (f.x > c.x && f.x < c.x + c.w && f.y > c.y && f.y < c.y + c.h) {
      frutas.splice(i, 1);
      pontos++;
      contagemFrutas[f.tipo]++;
    }
  }

  frutas = frutas.filter(f => f.y < height);

  // Obstáculos - chuva
  fill(0, 150, 255);
  for (let gota of chuva) {
    ellipse(gota.x, gota.y, 5, 10);
    gota.y += 3;
    if (dist(gota.x, gota.y, cestos[0].x + 30, cestos[0].y + 15) < 20) {
      pontos = max(0, pontos - 1);
      gota.y = height + 10;
    }
  }
  chuva = chuva.filter(g => g.y < height);

  // Obstáculos - pragas
  fill(80);
  for (let p of pragas) {
    text("🐛", p.x, p.y);
    p.y += 1.5;
    if (dist(p.x, p.y, cestos[0].x + 30, cestos[0].y + 15) < 20) {
      pontos = max(0, pontos - 2);
      p.y = height + 10;
    }
  }
  pragas = pragas.filter(p => p.y < height);

  // Cestos
  for (let cesto of cestos) {
    fill(160, 82, 45);
    rect(cesto.x, cesto.y, cesto.w, cesto.h);
    fill(255);
    text("🧺", cesto.x + cesto.w / 2, cesto.y + cesto.h / 2);
  }

  if (!jogoAtivo && nivel > 3) {
    fill(0, 150, 0);
    textSize(24);
    text("🌾 Colheita finalizada! Cidade cheia e feliz! 🎉", width / 2, height - 30);
    noLoop();
  }
}

function keyPressed() {
  let move = 20;
  if (keyCode === LEFT_ARROW) cestos[0].x -= move;
  if (keyCode === RIGHT_ARROW) cestos[0].x += move;
}

function gerarFrutas() {
  setInterval(() => {
    if (jogoAtivo) {
      let tipo = random(tiposFrutas);
      frutas.push({ tipo: tipo, x: random(20, width - 20), y: 0, vel: random(1, 2 + nivel) });
    }
  }, 1000);
}

function gerarCestos() {
  cestos.push({ x: width / 2 - 30, y: height - 50, w: 60, h: 30 });
}

function gerarObstaculos() {
  setInterval(() => {
    if (jogoAtivo) {
      chuva.push({ x: random(width), y: 0 });
    }
  }, 2500);

  setInterval(() => {
    if (jogoAtivo && nivel > 1) {
      pragas.push({ x: random(width), y: 0 });
    }
  }, 4000);
}

function proximoNivel() {
  if (nivel < 3) {
    nivel++;
    tempo = 30;
  } else {
    jogoAtivo = false;
  }
}
