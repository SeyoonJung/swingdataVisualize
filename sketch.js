let table;
let cycleList;
let clicked = -1;
let myFont, img;
let state = 0;
let bottomBars = [];
let slider;

let button1, button2, button3, button0;

function preload() {
  table = loadTable("data.csv", "csv");
  myFont = loadFont("notosans.otf");
  img1 = loadImage("b1.png");
  img2 = loadImage("b2.png");
  img3 = loadImage("b3.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  cycleList = [];
  for (let i = 1; i < table.getRowCount(); i++) {
    let dateY = table.getString(i, 0);
    let dateM = table.getString(i, 1);
    let dateD = table.getString(i, 2);
    let time = table.getString(i, 3);
    let timeuse = table.getString(i, 5);
    let cost = table.getString(i, 6);
    let timekor = table.getString(i, 8);

    let cycles = new cycleData(
      dateY,
      dateM,
      dateD,
      time,
      timeuse,
      cost,
      timekor
    );
    cycleList.push(cycles);
  }

  resetBottomBars();

  button0 = createImg("9.png");
  button0.mousePressed(state1);
  button0.position(0, 91);
  button0.size(60, 118);

  button0 = createImg("10.png");
  button0.mousePressed(state2);
  button0.position(0, 241);
  button0.size(60, 118);

  button0 = createImg("11.png");
  button0.mousePressed(state3);
  button0.position(0, 391);
  button0.size(60, 118);

  button0 = createImg("all.png");
  button0.mousePressed(state0);
  button0.position(0, 541);
  button0.size(60, 118);

  /*button0 = createImg("reset.png");
  button0.mousePressed(setup);
  button0.position(0, 692);
  button0.size(60, 118);*/

  slider = createSlider(0, 900, 300);
  slider.position(65, 60);
  slider.style("width", "300px");
  slider.style("color", "black");
}
function draw() {
  background(255);

  for (let i = 0; i < cycleList.length; i++) {
    if (
      (state == 1 && cycleList[i].dateM == 9) ||
      (state == 2 && cycleList[i].dateM == 10) ||
      (state == 3 && cycleList[i].dateM == 11) ||
      state == 0
    ) {
      cycleList[i].move();
      cycleList[i].checkEdge();
      cycleList[i].update();
      cycleList[i].render1();

      if (cycleList[i].isClicked == true) {
        push(); //텍스트 박스 사각형 구간
        strokeWeight(0.9);
        fill(255);
        rect(cycleList[i].xPos + 10, cycleList[i].yPos - 6, 150, 45);
        pop();

        push();
        noStroke();
        textFont(myFont, 16); //정보 텍스트 구간
        fill(0);
        text(
          cycleList[i].dateM + "월" + cycleList[i].dateD + "일",
          cycleList[i].xPos + 13,
          cycleList[i].yPos + 10
        );
        text(cycleList[i].time, cycleList[i].xPos + 83, cycleList[i].yPos + 10);
        text(
          cycleList[i].timekor + "초",
          cycleList[i].xPos + 13,
          cycleList[i].yPos + 33
        );
        text(
          cycleList[i].cost + "₩",
          cycleList[i].xPos + 83,
          cycleList[i].yPos + 33
        );
        pop();
      }
    }
    let val = slider.value(); //슬라이더로 cs값을 조절해 파티클 공간 구역을 조절한다.
    cycleList[i].cs = val;
  }

  for (let i = 0; i < bottomBars.length; i++) {
    push();
    //하단차트함수,파티클크기변경구간
    if (bottomBars[i].isClicked == true) {
      bottomBars[i].costforBar += 5;
      bottomBars[i].timeuse += 4; //클릭하면 파티클 커지는 함수
      if (bottomBars[i].dateM == 9) fill(174, 254, 219, 255);
      else if (bottomBars[i].dateM == 10) fill(82, 27, 255, 200);
      else if (bottomBars[i].dateM == 11) fill(0, 231, 228, 250);
      if (bottomBars[i].timeuse > size[i] * 2.6)
        bottomBars[i].timeuse = size[i] * 2.6; //파티클 크기 제한 구간(timeuse로 파티클 크기를 결정하는데, size함수로 원래 값을 저장해놓아 마우스 휠로 자유롭게 변형할 수 있게 설정해놓았다.)
      if (bottomBars[i].costforBar > barSize[i] * 2)
        bottomBars[i].costforBar = barSize[i] * 2;
    }

    if (bottomBars[i].isClicked == false && bottomBars[i].timeuse > size[i]) {
      bottomBars[i].timeuse -= 6; //파티클 크기 원상복귀 구간
      if (bottomBars[i].timeuse == size[i]) bottomBars[i].timeuse = size[i];
    } //파티클 크기 원상복귀하면 멈추는 구간

    if (
      bottomBars[i].isClicked == false &&
      bottomBars[i].costforBar > barSize[i]
    ) {
      bottomBars[i].costforBar -= 9;
      if (bottomBars[i].costforBar == barSize[i])
        bottomBars[i].costforBar = barSize[i];
    } //차트 사이즈 원상복귀하면 멈추는 구간
    if (bottomBars[i].isClicked == false) {
      if (bottomBars[i].dateM == 9) fill(174, 254, 219, 170);
      else if (bottomBars[i].dateM == 10) fill(82, 27, 255, 90);
      else if (bottomBars[i].dateM == 11) fill(0, 231, 228, 90);
    }
    let px = windowWidth / bottomBars.length; //차트 길이 결정 함수
    
    push();
    noStroke();
    fill(255, 140);
    rect(i * px, height - 60, px, 60); //차트 반투명 사각형 그리는 구간
    pop();

    noStroke();
    rect(
      i * px,
      height - bottomBars[i].costforBar,
      px,
      bottomBars[i].costforBar
    ); // 차트 색깔 사각형 그리는 구간
    pop(); //push는 반복문 바로앞에 있다
    fill(255, 0, 0);

    push();
    strokeWeight(0.9);
    noFill();
    rect(i * px, height - 60, px, 60); //차트 선 그리는 구간
    pop();

    fill(255, 200); //상단바 불투명 사각형 구간
    strokeWeight(1);
    rect(0, 0, windowWidth, 50);
    rect(0, 90, 63, 120);
    rect(0, 240, 63, 120);
    rect(0, 390, 63, 120);
    rect(0, 540, 63, 120);
    //rect(0, 690, 63, 120);

    push(); //상단바 글씨 구간
    noStroke();
    textFont(myFont, 28);
    fill(0);
    text("swing 월별 사용내역", 10, 36);

    if (state == 0) text("→9~11월", windowWidth - 130, 36);
    if (state == 1) text("→9월", windowWidth - 81, 36);
    if (state == 2) text("→10월", windowWidth - 96, 36);
    if (state == 3) text("→11월", windowWidth - 96, 36);//우상단  텍스트 구간
    pop();
  }
}

function resetBottomBars() {//문제의 resetBootomBars 펑션, draw에 하위 반복문이 몇개 더 있어 렉걸리게 한다. 클래스로 바꿀 예정
  bottomBars = []; //차트 월별 설정값 저장 배열
  size = []; //파티클 원래 사이즈값 저장 배열
  barSize = []; //차트사이즈 결정하는 cost값 저장배열
  for (let i = 0; i < cycleList.length; i++) {
    if (state == 0) {
      bottomBars.push(cycleList[i]);
      size.push(cycleList[i].timeuse);
      barSize.push(cycleList[i].costforBar);
    } else if (state == 1) {
      if (cycleList[i].dateM == 9) {
        bottomBars.push(cycleList[i]);
        size.push(cycleList[i].timeuse);
        barSize.push(cycleList[i].costforBar);
      }
    } else if (state == 2) {
      if (cycleList[i].dateM == 10) {
        bottomBars.push(cycleList[i]);
        size.push(cycleList[i].timeuse);
        barSize.push(cycleList[i].costforBar);
      }
    } else if (state == 3) {
      if (cycleList[i].dateM == 11) {
        bottomBars.push(cycleList[i]);
        size.push(cycleList[i].timeuse);
        barSize.push(cycleList[i].costforBar);
      }
    }
  }
}
function mousePressed() {
  for (let i = 0; i < cycleList.length; i++) {
    let p = dist(cycleList[i].xPos, cycleList[i].yPos, mouseX, mouseY);
    cycleList[i].isClicked = false;
    if (p < 20) {
      clicked = i;//마우스를 클릭하는 객체에 clicked 값을 기입, isClicked 활성화
    }
  }
  cycleList[clicked].isClicked = true; //오류뜨는 것은 중복선택시 하나만 선택하게 해놓았기때문
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  if (clicked > -1) {
    cycleList[clicked].xPos = mouseX;
    cycleList[clicked].yPos = mouseY;
  }
}

function mouseReleased() {
  clicked = -1;
  for (let i = 0; i < cycleList.length; i++) {
    cycleList[i].isClicked = false; //마우스를 놓으면 사이클리스트의 isClicked 모든 값을 비활성화
  }
}
function keyReleased() {//개발 과정 중 편하게 화면전환을 하기 위해 0,1,2,3 키로 각 스테이트를 조절했다.
  if (keyCode == 51) {
    state = 3;
  }
  if (keyCode == 50) {
    state = 2;
  }
  if (keyCode == 49) {
    state = 1;
  }
  if (keyCode == 48) {
    state = 0;
  }
  resetBottomBars();
}

function state0() {//완성본 화면전환 방법. 각 버튼이 각 스테이트 펑션을 호출한다. 동시에 resetBottomBars를 호출해 필요한 데이터만 수신하게 한다.
  state = 0;
  resetBottomBars();
}
function state1() {
  state = 1;
  resetBottomBars();
}
function state2() {
  state = 2;
  resetBottomBars();
}
function state3() {
  state = 3;
  resetBottomBars();
}

class cycleData {
  constructor(_dateY, _dateM, _dateD, _time, _timeuse, _cost, _timekor) {
    this.dateY = _dateY;
    this.dateM = _dateM;
    this.dateD = _dateD;
    this.time = _time;
    this.timeuse = _timeuse / 2.6;
    this.cost = _cost;
    this.timekor = _timekor;

    this.xPos = random(100, windowWidth - 100);
    this.yPos = random(100, windowHeight - 100);//파티클이 화면에 랜덤으로 전개되게 한다.
    this.speed = createVector(random(-1, 1), random(-1, 1));//파티클이 이동할 수 있게 랜덤으로 벡터값을 가지게 한다.
    this.vx = 0;//
    this.vy = 0;//파티클 물리값 요소 함수

    this.isClicked = false;//파티클 클릭 boolean 함수

    this.costforBar = this.cost / 33;//차트를 화면 상에 짧게 그리기 위해 cost값을 나눈것을 불러온다.
    this.img = img1;
    if (this.dateM == 10) this.img = img2;
    else if (this.dateM == 11) this.img = img3;//dateM값에 따라 월별로 서로 다른 이미지를 불러온다.
    this.cs = 300; // 파티클 구역 크기 기본 설정값
  }
  render1() {
    image(this.img, this.xPos, this.yPos, this.timeuse, this.timeuse);//파티클 객체, xPos,yPos 벡터값을 가지며 timeuse 값으로 크기가 결정된다.
  }
  move() {//파티클이 이동할 수 있게 랜덤으로 벡터값을 가지게 한다.
    this.xPos = this.xPos += this.speed.x;
    this.yPos = this.yPos += this.speed.y;
  }
  update() {
    let ax = 0;
    let ay = 0;

    for (let i = 0; i < cycleList.length; i++) {//파티클 객체 물리값을 계산하는 구간
      if (cycleList[i] == this) continue;
      let d = dist(cycleList[i].xPos, cycleList[i].yPos, this.xPos, this.yPos);
      if (d < this.timeuse / 2 + cycleList[i].timeuse / 2) {
        let v = this.timeuse / 2 + cycleList[i].timeuse / 2 - d;
        ax += v * (this.xPos - cycleList[i].xPos);
        ay += v * (this.yPos - cycleList[i].yPos);
      }
    }

    let len = dist(0, 0, ax, ay);
    if (len > 0.1) {
      ax /= len / random(0.02, 0.12);
      ay /= len / random(0.02, 0.12);
    }
    this.vx += ax;
    this.vy += ay;

    this.xPos += this.vx;
    this.yPos += this.vy;

    this.vx *= 0.9889;
    this.vy *= 0.9889;//파티클 객체 물리값 계산 구간
  }
  checkEdge() {
    let d = dist(this.xPos, this.yPos, width / 2, height / 2);
    if (d > this.cs + 0.3) {
      let x = ((this.xPos - width / 2) / d) * this.cs; //cs값으로 파티클 공간 구역을 설정한다.
      let y = ((this.yPos - height / 2) / d) * this.cs;
      this.xPos = width / 2 + x;
      this.yPos = height / 2 + y;
    }
    if (this.xPos > windowWidth) this.xPos = windowWidth;
    if (this.yPos > windowHeight) this.xPos = windowHeight;
  }
}
