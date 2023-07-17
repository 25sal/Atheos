//////////////////////////////////////////////////////////////////////////////80
// Plugin Template
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the MIT License. See [root]/LICENSE.md for more.
// This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Description: 
//	A blank plugin template to provide a basic example of a typical Atheos
//	plugin.
//////////////////////////////////////////////////////////////////////////////80
// Suggestions:
//	- A small line about improvements that can be made to this plugin/file
//////////////////////////////////////////////////////////////////////////////80
// Usage:
//  - desc: A short description of use
//
//////////////////////////////////////////////////////////////////////////////80
var token = null;
(function() {

	let self = false;

	// Initiates plugin as a third priority in the system.
	carbon.subscribe('system.loadExtra', () => atheos.elpro.init());

	atheos.elpro = {
		sideExpanded: true,

		init: function() {




			if (self) return;
			self = this;
			console.log('Elpro plugin loaded!');

			
			ul_checks = '<table style="text-align:center;"><tbody><tr><td>build</td><td>exec</td><td>outfile</td><td>test</td></tr>';
			ul_checks += '<tr><td><i class="fas fa-archive"></i></td><td><i class=\"fas fa-archive\"></i></td><td><i class=\"fas fa-archive\"></i></td><td><i class=\"fas fa-archive\"></i></td></tr></tbody></table>';
            out_wind = '<div id="evaluate_out"><div class="title"><h2>Test Output</h2> <i id="test-collapse" class="fas fa-chevron-circle-down"></i></div><div class="content">'+ul_checks+'</div>';
			$('#SBRIGHT').append(out_wind);
			fX('#test-collapse').on('click', function() {
				if (self.sideExpanded) {
					self.dock.collapse();
					//atheos.settings.save('project.dockOpen', false, true);
					//storage('project.dockOpen', false);
				} else {
					self.dock.expand();
					//atheos.settings.save('project.dockOpen', true, true);
					//storage('project.dockOpen', true);
				}
			});



			if(token == null){
				echo({
					url: 'plugins/Elpro/controller.php',
					data: {
						target: 'Elpro',
						action: 'login'
					},
					settled: function(status, reply) {
						atheos.toast.show(reply);
						if (status === 'error') return;
						if (reply == 'invalid_token')
						{
							carbon.publish('evaluate.invalid_token', reply.path);
						}
						token = reply;
						
						/* Notify listeners. */
						//carbon.publish('project.open', reply.path);
						console.log(token);
						var formData = {token:token,username:'salvatore'}; //Array 
 
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log(this.responseText);
							if(this.responseText=="authenticated")
							  carbon.publish('evaluate.authenticated', reply.path); 
							else if(this.responseText=="authentication_error")
							  carbon.publish('evaluate.authentication_error', reply.path);

							
						}
						};
						xhttp.withCredentials = true;
						xhttp.open("POST", "http://localhost:5000/auth_token", true);
						xhttp.send();

					}

			});
		  }
		},


		dock: {
			load: function() {
				
							self.dock.collapse();
				
			},

			expand: function() {
				self.sideExpanded = true;
				oX('#SBRIGHT #evaluate_out').css('height', '');
				oX('#SBRIGHT>.content').css('bottom', '');

				oX('#test-collapse').replaceClass('fa-chevron-circle-up', 'fa-chevron-circle-down');



			},

			collapse: function() {
				self.sideExpanded = false;
				var height = oX('#SBRIGHT #evaluate_out .title').height();

				oX('#SBRIGHT #evaluate_out').css('height', height + 'px');
				oX('#SBRIGHT>.content').css('bottom', height + 'px');

				oX('#test-collapse').replaceClass('fa-chevron-circle-down', 'fa-chevron-circle-up');
			}
		},

		//////////////////////////////////////////////////////////////////////80
		// BUILD_METHOD: build main.c file
		//////////////////////////////////////////////////////////////////////80
		build: function() {
			
			var formData = {token:token,username:'demo'}; //Array 
 
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log(this.responseText);
							

							
						}
						};
						xhttp.withCredentials = true;
						xhttp.open("POST", "http://localhost:5000/build", true);
						xhttp.send();

				
			},
		
			//////////////////////////////////////////////////////////////////////80
			// TEST_METHOD: build and test main.c file
			//////////////////////////////////////////////////////////////////////80
			test: function() {
			
				
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					

					
				}
				};
				xhttp.withCredentials = true;
				xhttp.open("POST", "http://localhost:5000/test", true);
				xhttp.send();
	
					
				},
			

			
	};

})();