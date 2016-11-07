var octa1 = new THREE.OctahedronGeometry( 7, 2 );
var octa2 = new THREE.OctahedronGeometry( 7.5, 3 );
var octa3 = new THREE.OctahedronGeometry( 8, 3 );
var laptopSpeed = 0.002
var phoneSpeed = 0.001
var Diamond = {
	loadCube:function(path)
	{
		var format = '.jpg';
		var urls = [
				path + 'posy' + format, path + 'posx' + format,
				path + 'posx' + format, path + 'posx' + format,
				path + 'posy' + format, path + 'posx' + format
			];

		var textureCube = new THREE.CubeTextureLoader().load( urls );
			textureCube.format = THREE.RGBFormat;
		return textureCube
	},
	init: function() {
		this.setUpScene();
	},
	setUpScene: function() {
		var width = window.innerWidth,
			height = window.innerHeight,
			self = this;
		this.title = document.getElementById('main-title')
		this.buy = document.getElementById('buy')
		this.dld = document.getElementById('dld')
		this.icon = document.getElementById('eye-icon')
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0xffffff, 1);
		this.renderer.setPixelRatio( window.devicePixelRatio );
		document.body.appendChild(this.renderer.domElement);
		this.curve_time = 0;
		this.scene = new THREE.Scene;
		this.diamond_size = 0.2
		this.diamond_curve = 3;
	    this.diamond = new THREE.IcosahedronGeometry(this.diamond_size, this.diamond_curve)
    	this.material1 = new THREE.MeshLambertMaterial(
		{
			color: 0xffffff, 
			opacity:1, 
			transparent:true, 
			reflectivity:1,
			depthTest:false,
			depthWrite:false,
			wireframeLinewidth:2,
			shading:THREE.FlatShading,
			side:THREE.BackSide,
			premultipliedAlpha: true,
			wireframe:false
		});
    	this.mesh = new THREE.Mesh(this.diamond, this.material1);
    	this.mesh.scale.set(50,50,50);
    	this.mesh.rotation.z = 0;
    	this.mesh.rotation.x = 0;
    	this.mesh.position.set(300, 30, 100);
    	this.scene.add(self.mesh);

		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
		this.camera.position.y = 100;
		this.camera.position.x = 80
		this.camera.position.z = 500;
		this.scene.add(this.camera);
    	this.camera.lookAt(self.mesh.position);

		var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
		var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
		var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
		this.scene.add(skybox);

		this.ambient = new THREE.AmbientLight( 0xffffff, 0.6 );
		this.scene.add( this.ambient );

		var lights = [];
		lights[ 0 ] = new THREE.PointLight( 0x000000, 0.5, 0 );
		lights[ 1 ] = new THREE.PointLight( 0xffffff, .8, 0 );
		lights[ 2 ] = new THREE.PointLight( 0x000000, 0.5, 0 );

		lights[ 0 ].position.set( 0, 200, 0 );
		lights[ 1 ].position.set( 0, 0, 50 );
		lights[ 2 ].position.set( - 50, - 200, - 300 );

		this.scene.add( lights[ 0 ] );
		this.scene.add( lights[ 1 ] );
		this.scene.add( lights[ 2 ] );


		this.clock = new THREE.Clock;
		this.render();
		this.cube1 = this.loadCube("Whiteroom2/");
		// this.cube2 = this.loadCube("Whiteroom/")
		this.scene.background = this.cube1;
		var shader = THREE.FresnelShader;
		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.uniforms[ "tCube" ].value = this.scene.background;

		this.material2 = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		} );
	},

	render: function() {
		var self = this;

		this.renderer.render(this.scene, this.camera);
		var geometry = null;
		if(this.mesh) {
			if(this.mesh.rotation.y < -12) this.mesh.rotation.y = 0;
			this.mesh.rotation.y -= this.clock.getDelta()/10;
			// console.log(this.mesh.rotation.y)
			
			if(this.diamond_size >= 3) 
			{
				if(this.diamond_size < 8) 
				{
					if(window.innerWidth > 800) this.diamond_size += laptopSpeed
					else this.diamond_size += phoneSpeed
				}
				else this.diamond_size = 6
				this.curve_time += 1;
				if(this.curve_time > 20)
				{
					this.curve_time = 0;
					this.diamond_curve += 1
					if(this.diamond_curve > 250) this.diamond_curve = 0;
				}
			}
			else
			{
				if(window.innerWidth > 800) this.diamond_size += laptopSpeed
				else this.diamond_size += phoneSpeed
			}

			var curve = this.diamond_curve
			if(curve > 60) 
			{
					if(curve === 65 && !this.in_progress && this.mesh.material.wireframe) 
					{
						// console.log("setting background")
						this.in_progress = true;
						setTimeout(function(){self.in_progress = false}, 1000)
						this.second_run = true;
						this.ambient.color.setHex(0x000000)
						this.mesh.material.wireframe = false;
						this.mesh.material = this.material2
						this.title.style.color = "#000"
						this.icon.setAttribute('fill', "#000")
						// self.icon.setAttribute('stroke', "#fff") 
					}

					if(curve > 70 && curve < 100) 
					{
						// console.log('setting octa1')
						geometry = octa1;
						// octa1.active = true;
					}
					if(curve > 150 && curve < 200)
					{
						geometry = octa2;
					}
					if(curve > 200 && curve < 250)
					{
						geometry = octa3;
					}
			}
			else {
				var min_size = 1.1
				var max_size = 1.2
				if(window.innerWidth < 800)
				{
					min_size = 0.7
					max_size = 0.75
				}
				if(this.diamond_size > min_size && this.diamond_size < max_size && !self.in_progress && !self.first_run) 
				{
					// console.log('=== first run ===')
					curve = 1;
					this.diamond_curve = 1;
					this.mesh.material.wireframe = true;
					this.in_progress = true;
					this.first_run = true;
					setTimeout(function(){self.in_progress = false}, 1000)
				}
				if(this.diamond_size > 2.5 && this.diamond_size < 3 && !self.in_progress && (!this.mesh.material.wireframe || this.first_run)) 
				{
					// console.log('setting wire')
					this.in_progress = true;
					this.title.style.color = "#fff"
					this.dld.style.color = "#fff"
					this.buy.style.color = "#fff"
					self.icon.setAttribute('fill', "#fff") 
					this.mesh.material.wireframeLinewidth = 2;
					this.first_run = false;
					setTimeout(function(){self.in_progress = false}, 1000)
					this.ambient.color.setHex(0xffffff)
					this.scene.background = this.cube1
					this.uniforms[ "tCube" ].value = this.cube1;
					this.mesh.material = this.material2;
					this.mesh.material.wireframe = true;
				}
				if(this.diamond_size > 3)
				{
					if(this.diamond_curve > 15) curve = 1
					if(this.diamond_curve > 37 && this.diamond_curve < 60) 
					{
						curve = 3			
						this.mesh.material.wireframe = false;
						this.mesh.material.wireframeLinewidth = 1;
						// this.scene.background = this.cube2;
						// this.mesh.material = this.material2
						// this.mesh.material.wireframe = false
					}
					if(this.diamond_curve > 30) 
					{
						curve = 3
					}
				}
			}
			if(curve > 2 || !this.mesh.material.wireframe) curve = 3;
			if(this.last_size == this.diamond_size && this.last_curve == curve) return;
			// if(this.last_curve != curve) console.log('==== changing curve '+curve+'======')
			// console.log('==== changing size '+this.diamond_size+' ======')
			this.last_size = this.diamond_size
			this.last_curve = curve
			if(!geometry) geometry = new THREE.IcosahedronGeometry(this.diamond_size, curve);
			this.mesh.geometry.dispose()
			this.mesh.geometry = null;
			this.mesh.geometry = geometry
			
		}
		requestAnimationFrame(function() {
			self.render();
		});
	}
};
var music = {
	init:function()
	{
		
	}
}

Diamond.init();