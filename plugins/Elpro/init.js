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

(function() {

	let self = false;

	// Initiates plugin as a third priority in the system.
	carbon.subscribe('system.loadExtra', () => atheos.elpro.init());

	atheos.elpro = {

		init: function() {
			if (self) return;
			self = this;

			// Start your plugin here...
		},

		//////////////////////////////////////////////////////////////////////80
		// SOME_METHOD: Opens an alert message in the browser
		//////////////////////////////////////////////////////////////////////80
		test: function() {
			echo({
				url: atheos.controller,
				data: {
					target: 'Elpro',
					action: 'test',
					projectName: "token"
				},
				settled: function(status, reply) {
					atheos.toast.show(reply);
					if (status === 'error') return;

					
					/* Notify listeners. */
					//carbon.publish('project.open', reply.path);
					alert("ok");

				}
			});
		}
	};

})();