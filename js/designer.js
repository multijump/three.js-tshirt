// JavaScript Document
var container;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			
			var model = null;
			
			var material;


			init();
			animate();


			function init() {

				container = document.createElement( 'div' );
				container.style.position = "absolute";
				container.style.top = '0px';
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 8;

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x111111 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( -0.5, 0.5, 1 ).normalize();
				scene.add( directionalLight );

				// loader
				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {
					console.log( item, loaded, total );
				};
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};
				
				material = new THREE.MeshPhongMaterial( {
					color: 0x73ACDE,
					specular: 0x222222,
					shininess: 7,
					side : THREE.DoubleSide,
					//map: THREE.ImageUtils.loadTexture( "obj/Normal_Map_001.png" ),
					normalMap: THREE.ImageUtils.loadTexture( "./obj/Normal_Map_001.png" ),
					normalScale: new THREE.Vector2( 2, 2 ),
					wrapRGB: new THREE.Vector3( 0.575, 0.5, 0.5 ),
					wrapAround: true
				} );
				
				var loader = new THREE.OBJLoader( manager );
				loader.load( './obj/tshirt_001.obj', function ( object ) {
					object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							child.material = material;
							model = child;
						}
					} );
					object.position.y = -2.5;
					scene.add( object );
				}, onProgress, onError );
				
				renderer = new THREE.WebGLRenderer({ antialias: true });
				renderer.setClearColor( 0xffffff );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				
				window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			//
			function animate() {

				requestAnimationFrame( animate );
				render();
			}

			function render() {
				if(model){
					model.rotation.y += .01;
				}
				renderer.render( scene, camera );
			}
			
			// external api
			function colorToHex(color) {
				var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				var rgb = blue | (green << 8) | (red << 16);
				return digits[1] + '0x' + rgb.toString(16);
			};
			function seColor(e){
				var color = colorToHex(e.style.color);
				if(model){
					model.material.color.setHex(color);
				}
			}