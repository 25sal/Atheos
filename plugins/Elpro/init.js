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

		init: function() {
			if (self) return;
			self = this;
			console.log('Elpro plugin loaded!');
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

		//////////////////////////////////////////////////////////////////////80
		// SOME_METHOD: Opens an alert message in the browser
		//////////////////////////////////////////////////////////////////////80
		test: function() {
			

			
		}
	};

})();