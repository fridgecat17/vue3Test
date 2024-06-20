<template>
  <div ref="threeRef" class="three">
    <div class="score-container">
      <div id="score">{{ scoreText }}</div>
    </div>
    <div class="health">
      <div v-for="(item,index) in health" :key="index" class="iconBox">
        <div class="icon"></div>
      </div>
    </div>
    <div v-if="gameOver" class="option">
      <el-container>
        <el-header>{{ titleText }}</el-header>
        <el-main>
          <div class="btn" @click="reStart">RESTART</div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  BoxHelper,
  ConeGeometry,
  Box3,
  MeshLambertMaterial,
  BufferGeometry,
  AxesHelper,
  Mesh,
  Clock,
  BoxGeometry,
  LineBasicMaterial,
  Vector3,
  Line,
  AmbientLight
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const threeRef = ref<HTMLDivElement>()
const scoreText = ref('Score:0')
const titleText = ref('GAME OVER !')
const clock = new Clock;
let renderer,scene,camera,movingCube,controls
let crash:boolean = false,
    keyCodeW:boolean = false,
    keyCodeS:boolean = false,
    keyCodeA:boolean = false,
    keyCodeD:boolean = false,
    gameOver = ref(false),
    health = ref(5),
    collideMeshList = [],
    cubes = [],
    score:number = 0,
    id:number = 0,
    crashId:string = '',
    lastCrashId:string = ''

function init() {
  scene = new Scene()
  // 坐标线
  // const axes = new AxesHelper(20)
  // scene.add(axes)
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const gltfLoader = new GLTFLoader();
  camera = new PerspectiveCamera(45, screenWidth / screenHeight, 1, 20000);
  camera.position.set(0, 170, 400)
  // 渲染器
  renderer = new WebGLRenderer({
    // logarithmicDepthBuffer: true,
    antialias: true, // true/false表示是否开启反锯齿
    alpha: true, // true/false 表示是否可以设置背景色透明
    precision: 'mediump', // highp/mediump/lowp 表示着色精度选择
    premultipliedAlpha: true, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
    // preserveDrawingBuffer: false, // true/false 表示是否保存绘图缓冲
    physicallyCorrectLights: true, // true/false 表示是否开启物理光照
  })
  renderer.setSize(screenWidth * 0.75, screenHeight * 0.75);
  threeRef.value?.appendChild(renderer.domElement)
  //渲染器开启阴影
  renderer.shadowMap.enabled = true
  //renderer.render(scene,camera)
  controls = new OrbitControls(camera, renderer.domElement)
  
  // 加入两条直线
  var geometry = new BufferGeometry();
  var points = []
  const material = new LineBasicMaterial({
      color: 0x6699FF, linewidth: 5, fog: true
  });
  points.push(new Vector3(-250, -1, -3000));
  points.push(new Vector3(-300, -1, 200));
  geometry.setFromPoints(points)
  const line1 = new Line(geometry, material);
  scene.add(line1);
  geometry = new BufferGeometry();
  points = []
  points.push(new Vector3(250, -1, -3000));
  points.push(new Vector3(300, -1, 200));
  geometry.setFromPoints(points)
  const line2 = new Line(geometry, material);
  scene.add(line2);

  // 加入控制的cube
  const cubeGeometry = new BoxGeometry(30, 20, 30, 5, 5, 5)
  const cubeMaterial = new MeshLambertMaterial({ color: 0x00ff00, wireframe: true })
  movingCube = new Mesh(cubeGeometry, cubeMaterial)
  movingCube.position.set(0, 50, 250)
  scene.add(movingCube)
  const ambientLight = new AmbientLight(0xffffff)
  scene.add(ambientLight)
}
function reStart() {
  score = 0
  health.value = 5
  cubes.forEach(item => {
    scene.remove(item)
  })
  collideMeshList = []
  cubes = []
  gameOver.value = false
  animate()
}
// 监听键盘按键
function listen() {
  document.addEventListener(
    'keydown',
    (e) => {
      var ev = e || window.event
      switch (ev.keyCode) {
        case 87: case 38:
          keyCodeW = true
          break
        case 83: case 40:
          keyCodeS = true
          break
        case 65: case 37:
          keyCodeA = true
          break
        case 68: case 39:
          keyCodeD = true
          break
        default:
          break
      }
    },
    false
  )
  document.addEventListener(
    'keyup',
    (e) => {
      var ev = e || window.event
      switch (ev.keyCode) {
        case 87: case 38:
          keyCodeW = false
          break
        case 83: case 40:
          keyCodeS = false
          break
        case 65: case 37:
          keyCodeA = false
          break
        case 68: case 39:
          keyCodeD = false
          break
        default:
          break
      }
    },
    false
  )
}
function animate() {
  if (!gameOver.value) {
    requestAnimationFrame(animate)
    update()
    renderer.render(scene, camera)
  }
}
function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  if (keyCodeA) {
      if (movingCube.position.x > -230)
          movingCube.position.x -= moveDistance;
      if (camera.position.x > -150) {
          camera.position.x -= moveDistance * 0.6;
          if (camera.rotation.z > -5 * Math.PI / 180) {
              camera.rotation.z -= 0.2 * Math.PI / 180;
          }
      }
  }
  if (keyCodeD) {
      if (movingCube.position.x < 230)
          movingCube.position.x += moveDistance;
      if (camera.position.x < 150) {
          camera.position.x += moveDistance * 0.6;
          if (camera.rotation.z < 5 * Math.PI / 180) {
              camera.rotation.z += 0.2 * Math.PI / 180;
          }
      }
  }
  if (keyCodeW) {
    movingCube.position.z -= moveDistance;
  }
  if (keyCodeS) {
    if (movingCube.position.z < 250) {
      movingCube.position.z += moveDistance;
    }
  }

  if (!(keyCodeA || keyCodeD)) {
      delta = camera.rotation.z;
      camera.rotation.z -= delta / 10;
  }
  crash = false
  for(let index = 0;index<collideMeshList.length;index++) {
    const cubeBox = new Box3().setFromObject(movingCube)
    const boxMeshBox = new Box3().setFromObject(collideMeshList[index])
    if (cubeBox.intersectsBox(boxMeshBox)) {
      crash = true
      crashId = collideMeshList[index].name
      break
    }
  }

  if (crash) {
      //            message.innerText = "crash";
      movingCube.material.color.setHex(0x346386);
      // console.log("Crash");
      if (crashId !== lastCrashId) {
          // score -= 100;
          health.value--;
          lastCrashId = crashId;
      }

      // document.getElementById('explode_sound').play()
  } else {
      //            message.innerText = "Safe";
      movingCube.material.color.setHex(0x00ff00);
  }

  if (Math.random() < 0.03 && cubes.length < 20) {
      makeRandomCube();
  }

  for (let i = 0; i < cubes.length; i++) {
      if (cubes[i].position.z > camera.position.z) {
          scene.remove(cubes[i]);
          cubes.splice(i, 1);
          collideMeshList.splice(i, 1);
      } else {
          cubes[i].position.z += 10;
      }
      //                renderer.render(scene, camera);
  }
  score += 0.1;
  scoreText.value = "Score:" + Math.floor(score);
  if (health.value == 0) gameOver.value = true
}
// 返回一个介于min和max之间的随机数
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// 返回一个介于min和max之间的整型随机数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function makeRandomCube() {
  let a = 1 * 40,
      b = getRandomInt(2, 3) * 50,
      c = 1 * 20;
  let geometry = new ConeGeometry(a, b, c);
  let material = new MeshBasicMaterial({
      color: 0xff0000
  });
  material.transparent = true
  material.opacity = 0.8

  var box = new Mesh(geometry, material);
  // var box = new BoxHelper(object);
  //            box.material.color.setHex(Math.random() * 0xffffff);
  // box.material.color.setHex(0xff0000);

  box.position.x = getRandomArbitrary(-250, 250);
  box.position.y = 1 + b / 2;
  box.position.z = getRandomArbitrary(-800, -1800);
  cubes.push(box);
  box.name = "box_" + id;
  id++;
  collideMeshList.push(box);
  scene.add(box);
}
onMounted(() => {
  init()
  listen()
  animate()
})
</script>
<style lang="scss" scoped>
.stats {
  position: absolute;
  left: 0;
  top: 0;
}
.three {
  position: relative;
  background-color: #000;
  overflow: hidden;
}

canvas {
  display: block;
  margin: 0 auto;
  top: 50px;
}
.option {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  background: #000;
  border: 10px solid #fff;
  border-radius: 15px;
  position: absolute;
  .el-container {
    height: 100%;
    width: 100%;
    .el-header {
      margin-top: 2%;
      font-size: 4vw;
      text-align: center;
      color: #fff;
      font-weight: bolder;
    }
    .el-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn {
        font-size: 1.5vw;
        background: #fff;
        border: 5px solid #fff;
        border-radius: 30px;
        color: #000;
        padding: 5px 25px;
      }
      .btn:hover {
        cursor: pointer;
        background: #F56C6C;
        color: #fff;
      }
    }
  }
}
.score-container {
  position: absolute;
  top: 2%;
  left: 4%;
  transition: transform 0.5s 4s;
}

.score-container #score {
  color: white;
  font-size: 8vh;
  font-family: 'Exo', sans-serif;
  font-weight: 700;
}
.health {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 7%;
  right: 4%;
  transition: transform 0.5s 4s;
  .iconBox {
    margin-left: 20px;
  }
  .icon {
    position: relative;
    top: 0px;
    left: 50%;
    width: 20px;
    height: 20px;
    background: red;
    transform: rotate(-45deg);
  }
  .icon:after{
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: red;
  }
  .icon:before{
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: red;
  }
}
</style>
