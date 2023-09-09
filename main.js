import * as THREE from "./build/three.module.js"
import { OrbitControls } from "./jsm/controls/OrbitControls.js"

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init); // "load"：ページが読み込み終わったら第二引数の関数を呼ぶ

function init() {
    // シーンを追加
    scene = new THREE.Scene();
    
    // カメラを追加
    // PerspectiveCamera(視野角,アスペクト比,開始距離,終了距離)
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, +500);
    
    // レンダラーを追加
    renderer = new THREE.WebGLRenderer({alpha: true}); // alpha: 透明度 trueにすることで透明になる
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // デバイスによって解像度を整える
    document.body.appendChild(renderer.domElement);
    
    // テクスチャーを追加
    let textures = new THREE.TextureLoader().load("images/earth.jpg")
    // ジオメトリを作成
    // SphereGeometry(半径, ポリゴンの数:wide segment, ポリゴンの分割数: height segment)
    let ballGeometory = new THREE.SphereGeometry(100, 64, 32);
    // マテリアルを作成
    let ballMaterial = new THREE.MeshPhysicalMaterial({map: textures});
    // メッシュ化
    let ballMesh = new THREE.Mesh(ballGeometory, ballMaterial);
    scene.add(ballMesh);
    
    // 平行光源を追加
    // DirectionalLight(色, 強さ)
    let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // ポイント光源を追加
    // PointLight(色, 強さ)
    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.decay = 1; // 光の減衰率 この値を増やすと光はより早く減衰し、小さくすると光はより遠くまで届く
    pointLight.power = 1000; // 光源の強度 この値を増やすと光源からの光が強くなる 
    pointLight.position.set(-200, -200, -200);
    scene.add(pointLight);
    
    // ポイント光源がどこにあるのか特定する
    // PointLightHelper(特定のポイント光源, ヘルパーの大きさ)
    let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
    scene.add(pointLightHelper);
    
    // マウス操作ができるようにする
    // OrbitControls(カメラ, DOM Element)
    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("resize", onWindowResize);

    animate();
}

// ブラウザのリサイズに対応させる
function onWindowResize() {
    // レンダラーのサイズを随時更新する
    renderer.setSize(window.innerWidth, window.innerHeight)

    // カメラのアスペクト比を正す
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // カメラのプロパティを変更した時、変更を有効にしたい場合updateProjectionMatrixを呼び出す
}

// ポイント光源を球の周りを巡回させる
function animate() {
    pointLight.position.set(
        200 * Math.sin(Date.now() / 500),
        200 * Math.sin(Date.now() / 1000),
        200 * Math.cos(Date.now() / 500)
        );
        // レンダリングする
        renderer.render(scene, camera);
        
        requestAnimationFrame(animate);
}




