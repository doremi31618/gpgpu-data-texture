import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import texture from '/test.jpg'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class Sketch{
  constructor({dom}){
    this.container=dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.scene = new THREE.Scene();

    //init renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha : true,
      antialias: true
    })
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    
    //init camera
    this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 0.01, 10);
    this.camera.position.z = 1;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.addObject();
    this.setupResize();
    this.render();
  }
  setupResize(){
    // window.addEventListener('resize', this.resize.bind(this));
    this.container.addEventListener('resize', this.resize.bind(this));
  }
  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width/this.height;

    this.camera.updateProjectionMatrix()
    
  }
  addObject(){
    //add object geometry -> material -> mesh -> add to scene

    //init data texture
    this.size = 32;
    this.number = this.size * this.size;
    this.geometry = new THREE.BufferGeometry();

    this.positions = new Float32Array(this.number * 3);
    this.uvs = new Float32Array(this.number * 2);
    for (let i=0; i<this.size; i++){
      for (let j=0; j<this.size; j++){
        let index = i*this.size + j;
        this.positions[3 * index] = i/(this.size-1) - 0.5;//x
        this.positions[3 * index+1] = j/(this.size-1) - 0.5;//y
        this.positions[3 * index+2] = Math.random() * 0.05;//z

        this.uvs[2* index] = i/(this.size-1);//u
        this.uvs[2 * index+1] = j/(this.size-1);//v
      }
    }
    // this.uvsTexture = new THREE.DataTexture(this.uvs, this.size, this.size, THREE.RGBAFormat, this.Float32Array);
    // this.uvsTexture.needsUpdate = true;

    // this.positionsTexture = new THREE.DataTexture(this.positions, this.size, this.size,THREE.RGBAFormat, THREE.FloatType);
    // this.positionsTexture.needsUpdate = true;

    this.geometry.setAttribute('position', new THREE.BufferAttribute( this.positions , 3));
    this.geometry.setAttribute('uv',new THREE.BufferAttribute( this.uvs, 2) );

    // this.geometry = new THREE.PlaneGeometry(1,1,this.size,this.size);
    this.material = new THREE.MeshNormalMaterial();
    
    this.time = 0;
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: this.time},
            uTexture: {value: new THREE.TextureLoader().load(texture)}
            // uTexture: {value: this.positionsTexture}
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    })
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

  }
  render(){
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  dom: document.querySelector('#container')
})