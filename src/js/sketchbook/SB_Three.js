
Sketchbook.prototype.initThree = function() {

    // HTML initialization

    // WebGL not supported
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    var scope = this;

    // Auto window resize
    function onWindowResize() {
        scope.camera.aspect = window.innerWidth / window.innerHeight;
        scope.camera.updateProjectionMatrix();
        scope.renderer.setSize(window.innerWidth, window.innerHeight);
        effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
        scope.composer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    }
    window.addEventListener('resize', onWindowResize, false);

    // Stats (FPS, Frame time, Memory)
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    // Scene initialization

    // Fog
    // this.scene.fog = new THREE.FogExp2(0xC8D3D5, 0.25);

    // Camera
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 120);
    // this.camera.position.set(1, 1, 1);

    // Scene render pass
    var renderScene = new THREE.RenderPass(this.scene, this.camera);

    // DPR for FXAA
    var dpr = 1;
    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    }
    // FXAA
    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
    effectFXAA.renderToScreen = true;

    // Composer
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    this.composer.addPass(renderScene);
    this.composer.addPass(effectFXAA);

    // Sky
    var sky = new THREE.Sky();
    sky.scale.setScalar(100);
    this.scene.add(sky);

    // Sun helper
    this.sun = new THREE.Vector3();
    var theta = Math.PI * (-0.3);
    var phi = 2 * Math.PI * (-0.25);
    this.sun.x = Math.cos(phi);
    this.sun.y = Math.sin(phi) * Math.sin(theta);
    this.sun.z = Math.sin(phi) * Math.cos(theta);
    sky.material.uniforms.sunPosition.value.copy(this.sun);

    // Lighting
    var ambientLight = new THREE.AmbientLight(0x888888); // soft white light
    this.scene.add(ambientLight);

    // Sun light with shadowmap
    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    // this.dirLight.target = this.player;
    this.dirLight.castShadow = true;
    // this.dirLight.shadow.bias = -0.003;

    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 8;

    this.dirLight.shadow.camera.top = 5;
    this.dirLight.shadow.camera.right = 5;
    this.dirLight.shadow.camera.bottom = -5;
    this.dirLight.shadow.camera.left = -5;

    this.dirLight.shadow.camera
    this.scene.add(this.dirLight);

    // Helpers
    var helper = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
    helper.position.set(0, 0.01, 0);
    helper.material.opacity = 0.2;
    helper.material.transparent = true;
    this.scene.add( helper );
    helper = new THREE.AxesHelper(2);
    // this.scene.add( helper );
    helper = new THREE.DirectionalLightHelper(this.dirLight, 3);
    // this.scene.add( helper );
    helper = new THREE.CameraHelper(this.dirLight.shadow.camera);
    // this.scene.add( helper );
}