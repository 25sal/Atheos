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



function html_logs(output){

no_of_warnings =0;
html_string="";
output.split(/\r?\n|\r/).forEach((line) => {
  let str = line;

  if (str.toLowerCase().includes('warning:')) {
    html_string +='<span style="color: black; background-color: yellow;">' + str + '</span>';
    html_string +='<br>'; // Empty line
    no_of_warnings++;
  } else if (str.toLowerCase().includes('in function')) {
    html_string +='<br>';
    html_string +='<strong>' + str + '</strong>';
  } else if (str.toLowerCase().includes('error:')) {
    html_string +='<span style="background-color: red; color: white;">' + '-'.repeat(str.length) + '</span>';
    html_string +='<span style="background-color: red; color: white;">' + str + '</span>';
    html_string +='<span style="background-color: red; color: white;">' + '-'.repeat(str.length) + '</span>';
    no_of_errors++;
  } else if (str.includes(' Error ')) {
    html_string +='<span style="background-color: red; color: white;">' + '-'.repeat(str.length) + '</span>';
    html_string +='<span style="background-color: red; color: white;">' + str + '</span>';
    html_string +='<span style="background-color: red; color: white;">' + '-'.repeat(str.length) + '</span>';
    no_of_errors++;
  } else {
    html_string +='<span style="color: green;">' + str + '</span>';
  }
});



return html_string;
}










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
			$('#SBRIGHT').after('<div id="evaluate_log" style="width: 100%;height: 25px;z-index: 99999;margin: 0;padding: 0;background: var(--mideground);cursor: row-resize;">|||</div>');
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
						//console.log(token);
					}
			});
		  }

				var formData = {
					user_id: 'demo',
					secret: "my-secret"
				};
				
				fetch("http://localhost:5000/auth_token", {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify(formData)
				})
				.then(response => {
					if (!response.ok) {
					throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					console.log(data);
					token = data["access_token"];
					if (data === "authenticated") {
					carbon.publish('evaluate.authenticated', reply.path);
					} else if (data === "authentication_error") {
					carbon.publish('evaluate.authentication_error', reply.path);
					}
				})
				.catch(error => {
					console.error('Error:', error);
				});
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
		        console.log("*************"+token);	
			var formData = {token:token,username:'demo'}; //Array 
 
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log(html_logs(this.responseText));
						$('#evaluate_out').append(html_logs(this.responseText));	

							
						}
						};
						//xhttp.withCredentials = true;
						xhttp.open("POST", "http://localhost:5000/build", true);
						 xhttp.setRequestHeader('Authorization',"JWT "+token);

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
				//xhttp.open("POST", "http://localhost:5000/test", true);
				//xhttp.send();
	
					
				},
			//////////////////////////////////////////////////////////////////////80
			// TEST_METHOD: open the file with the exam description
			//////////////////////////////////////////////////////////////////////80
			getTraccia: function() {
				const url = 'http://localhost:5000/exercise'; // L'URL dell'API

				fetch(url)
				  .then(response => {
					// Controlla se la risposta è stata ricevuta con successo (status 200)
					if (!response.ok) {
					  throw new Error('Network response was not ok');
					}
					return response.json(); // Parsifica la risposta come JSON
				  })
				  .then(data => {
					// Usa i dati ottenuti dalla chiamata API
					console.log(data);
				  })
				  .catch(error => {
					// Gestisce gli errori della chiamata API
					console.error('Error:', error);
				  });
				atheos.modal.load(900, {
					target: 'elpro',
					action: 'openDialog',
					callback: function() {
						console.log("callback");
					}
				});
				console.log("getTraccia");
	
					
				},

			
	};

})();
