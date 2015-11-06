/**
 * Client-side code to add "Push to OpenDataPhilly" button to the metadata catalog Knack application
 * knackhq.com
 */

// When manage > dataset details page loads
$(document).on('knack-scene-render.scene_61', function(event, view, data) {
	// Get the dataset being viewed
  var datasetId = view.scene_id
  
	// Create a push button
  var button = $('<a href="#" class="kn-link-scene"><span>Push to OpenDataPhilly</span></a>')
	
	// Create a "status" notification bar and hide it
  var status = $('<div class="kn-message"></div>').hide()
	
	// Put the button and status bar after the "Edit Dataset" button in the view
  $('#view_116 .kn-link-scene').after(status).after(button).after(' - ')
  
	// Listen to a click on the button
  button.on('click', function(e) {		
		// Loading indicator
    status.html('<p>Pushing...</p>').removeClass('success error').show()
    
		// Send request to metadata pusher server
    $.ajax({
      type: 'GET',
      url: 'https://127.0.0.1:8080/ckan/' + datasetId,
      success: function(response) {
        console.log('success', response)
				
				// Construct link to dataset in OpenDataPhilly
        var link = 'http://45.55.253.172/dataset/' + response.dataset.name
				
				// Show success message
        status.html('<p>Successfully updated <a href="' + link + '" target="_blank">' + response.dataset.name + '</a></p>')
        	.removeClass('error').addClass('success').show()
      },
      error: function() {
        console.error('error', arguments)
				
				// Show error message
        status.html('<p>Error pushing to OpenDataPhilly</p>')
        	.removeClass('success').addClass('error').show()
      }
    })
    
    e.preventDefault()
  })
})