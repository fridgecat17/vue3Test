<template>
  <div ref="statsDivRef" class="stats"></div>
  <div ref="threeRef"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  MeshLambertMaterial,
  PlaneGeometry,
  Mesh,
  ConeGeometry,
  DoubleSide,
  BoxGeometry,
  SphereGeometry,
  Vector2,
  Raycaster,
  SpotLight,
  PointLight,
  AmbientLight
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'

export default defineComponent({
  setup() {
    const threeRef = ref<HTMLDivElement>()
    const statsDivRef = ref<HTMLDivElement>()
    const statsRef = ref<Stats>()
    function initStats() {
      statsRef.value = new Stats()
      statsRef.value?.showPanel(0)
      statsDivRef.value?.appendChild(statsRef.value.dom)
    }

    function init() {
      const scene = new Scene()
      const axes = new AxesHelper(20)
      scene.add(axes)

      const renderer = new WebGLRenderer({
        logarithmicDepthBuffer: true,
        antialias: true, // true/false表示是否开启反锯齿
        alpha: true, // true/false 表示是否可以设置背景色透明
        precision: 'mediump', // highp/mediump/lowp 表示着色精度选择
        premultipliedAlpha: true // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
        // preserveDrawingBuffer: false, // true/false 表示是否保存绘图缓冲
        // physicallyCorrectLights: true, // true/false 表示是否开启物理光照
      })
      renderer.setClearColor(new Color(0xeeeeee))
      renderer.setSize(1000, 400)

      const planeGeometry = new PlaneGeometry(200, 200)
      const planeMaterial = new MeshLambertMaterial({ color: 0xffffff })
      const plane = new Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.x = 0
      plane.position.y = 0
      plane.position.z = 0
      //地面接受阴影
      plane.receiveShadow = true
      scene.add(plane)

      //盒子几何体
      const cubeGeometry = new BoxGeometry(4, 4, 4)
      const cubeMaterial = new MeshLambertMaterial({ color: 0xff0000 })
      const cube = new Mesh(cubeGeometry, cubeMaterial)
      cube.name = 'cube-box'
      //cube.rotation.x=-0.5*Math.PI

      // 三角形几何体
      const coneGeometry = new ConeGeometry(5, 10, 30)
      const conerMaterial = new MeshLambertMaterial({
        color: 'orange',
        side: DoubleSide
      })
      const coneMesh = new Mesh(coneGeometry, conerMaterial)
      coneMesh.position.x = 0
      coneMesh.position.y = 0
      coneMesh.position.z = 0
      coneMesh.name = 'coneMe'
      scene.add(coneMesh)

      //开启阴影
      cube.castShadow = true
      cube.position.x = 14
      cube.position.y = 2
      cube.position.z = 2
      scene.add(cube)

      //球形几何体
      const sphereGeometry = new SphereGeometry(4, 20, 20)
      const sphereMaterial = new MeshLambertMaterial({ color: 0x77777ff })
      const sphere = new Mesh(sphereGeometry, sphereMaterial)
      sphere.castShadow = true
      sphere.position.x = 2
      sphere.position.y = 2
      sphere.position.z = 2
      sphere.name = 'ball'
      scene.add(sphere)
      //光源效果 点光源
      let spotLight = new PointLight(0xffffff, 1)
      spotLight.position.set(-10, 30, -10)
      spotLight.shadow.camera.near = 1
      spotLight.shadow.camera.far = 5000
      scene.add(spotLight)
      const ambientLight = new AmbientLight(0xffffff)
      scene.add(ambientLight)

      const camera = new PerspectiveCamera(65, 1000 / 400, 0.1, 1000)
      camera.position.x = -20
      camera.position.y = 10
      camera.position.z = 0
      camera.lookAt(0, 0, 0)
      threeRef.value?.appendChild(renderer.domElement)
      //渲染器开启阴影
      renderer.shadowMap.enabled = true
      //renderer.render(scene,camera)

      // 相机控件
      // const orbitcontrols = new OrbitControls(
      //   camera,
      //   renderer?.domElement
      // )
      // orbitcontrols.enableDamping = false;
      // orbitcontrols.screenSpacePanning = false; // 定义平移时如何平移相机的位置 控制不上下移动
      // orbitcontrols.minDistance = 2;
      // orbitcontrols.maxDistance = 1000;
      // orbitcontrols.addEventListener('change', ()=>{
      //   renderer.render(scene, camera);
      // })

      let intersects = [] //几何体合集
      let geometrys = [] //几何体合集
      const pointer = new Vector2()
      document.addEventListener('click', meshOnClick)
      let raycaster = new Raycaster()
      function meshOnClick(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        geometrys = []
        //geometrys为需要监听的Mesh合集，可以通过这个集合来过滤掉不需要监听的元素例如地面天空
        scene.traverse((e) => {
          if (e instanceof Mesh && e != plane) {
            geometrys.push(e)
          }
        })
        //true为不拾取子对象
        intersects = raycaster.intersectObjects(geometrys, true)
        //被射线穿过的几何体为一个集合，越排在前面说明其位置离端点越近，所以直接取[0]
        if (intersects.length > 0) {
          //alert(intersects[0].object.name);
          console.log(intersects[0].object)
        } else {
          //若没有几何体被监听到，可以做一些取消操作
        }
      }
      // 通过wsad控制物体移动
      // 监听键盘是否按下
      let keyCodeW = false
      let keyCodeS = false
      let keyCodeA = false
      let keyCodeD = false
      let keyJump = false
      let timer1 = null
      document.addEventListener(
        'keydown',
        (e) => {
          var ev = e || window.event
          switch (ev.keyCode) {
            case 87:
              keyCodeW = true
              break
            case 83:
              keyCodeS = true
              break
            case 65:
              keyCodeA = true
              break
            case 68:
              keyCodeD = true
              break
            case 32:
              keyJump = true
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
            case 87:
              keyCodeW = false
              break
            case 83:
              keyCodeS = false
              break
            case 65:
              keyCodeA = false
              break
            case 68:
              keyCodeD = false
              break
            case 32:
              keyJump = false
              break
            default:
              break
          }
        },
        false
      )
      // 控制 移动
      function onCodeMove(mesh) {
        if (keyCodeW) {
          mesh.position.x += 1
          camera.position.x += 1
          spotLight.position.x += 1
          mesh.rotation.y = Math.PI * 0.5
        }
        if (keyCodeA) {
          mesh.position.z -= 1
          camera.position.z -= 1
          spotLight.position.z -= 1
          mesh.rotation.y = Math.PI
        }
        if (keyCodeS) {
          mesh.position.x -= 1
          camera.position.x -= 1
          spotLight.position.x -= 1
          mesh.rotation.y = Math.PI * 1.5
        }
        if (keyCodeD) {
          mesh.position.z += 1
          camera.position.z += 1
          spotLight.position.z += 1
          mesh.rotation.y = Math.PI * 2
        }

        if (keyJump) {
          if (timer1) {
            // clearTimeout(timer1)
          } else {
            mesh.position.y += 5
            camera.position.y += 5
            timer1 = setTimeout(() => {
              mesh.position.y = 0
              camera.position.y = 10
              timer1 = null
            }, 100)
          }
        }

        if (keyCodeW && keyCodeD) {
          mesh.rotation.y = Math.PI * 0.25
        }
        if (keyCodeW && keyCodeA) {
          mesh.rotation.y = Math.PI * 0.75
        }
        if (keyCodeA && keyCodeS) {
          mesh.rotation.y = Math.PI * 1.25
        }
        if (keyCodeS && keyCodeD) {
          mesh.rotation.y = Math.PI * 1.75
        }
      }
      let step = 0

      //gui控件
      const controls = {
        rotationSpeed: 0.02,
        bouncingSpeed: 0.03,
        //添加对象
        addCube: function () {
          //盒子几何体
          const cubeGeometry = new BoxGeometry(4, 4, 4)
          const cubeMaterial = new MeshLambertMaterial({ color: 0xffff00 })
          const cube = new Mesh(cubeGeometry, cubeMaterial)
          //cube.rotation.x=-0.5*Math.PI
          //开启阴影
          cube.castShadow = true
          cube.position.x = -30 + Math.round(Math.random() * 50)
          cube.position.y = Math.round(Math.random() * 10)
          cube.position.z = -20 + Math.round(Math.random() * 50)
          console.log(cube.position)
          //设置Cube的名称
          cube.name = 'cube-' + scene.children.length
          scene.add(cube)
          this.numberOfObjects = scene.children.length
        },
        //删除对象
        removeCube: function () {
          //过滤非Mesh 对象的，
          const meshList = scene.children.filter((e) => {
            if (e instanceof Mesh && e.name.startsWith('cube-')) {
              return true
            }
            return false
          })
          console.log(meshList)
          scene.remove(meshList[meshList.length - 1])
          this.numberOfObjects = scene.children.length
        },
        //对象数据
        numberOfObjects: scene.children.length
      }
      const gui = new dat.GUI()
      gui.add(controls, 'rotationSpeed', 0, 0.05)
      gui.add(controls, 'bouncingSpeed', 0, 0.05)
      gui.add(controls, 'addCube')
      gui.add(controls, 'removeCube')
      // 监听
      gui.add(controls, 'numberOfObjects').listen()
      rendererScene()

      function rendererScene() {
        statsRef.value?.begin()
        scene.traverse((e) => {
          if (e instanceof Mesh && e != plane && e != coneMesh) {
            e.rotation.x += controls.rotationSpeed
            e.rotation.y += controls.rotationSpeed
            e.rotation.z += controls.rotationSpeed
          }
        })
        cube.rotation.x += 0.02
        cube.rotation.y += 0.02
        cube.rotation.z += 0.02
        step += 0.02
        sphere.position.x = 20 + 10 * Math.cos(step)
        sphere.position.y = 2 + 10 * Math.abs(Math.cos(step))
        onCodeMove(coneMesh)
        //
        requestAnimationFrame(rendererScene)
        renderer.render(scene, camera)
        statsRef.value?.end()
      }
    }

    function clear() {
      const dg = document.querySelector('.dg')
      if (dg) {
        dg.innerHTML = ''
      }
    }

    onMounted(() => {
      clear()
      init()
      initStats()
    })
    return {
      statsDivRef,
      threeRef
    }
  }
})
</script>
<style scoped>
.stats {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
