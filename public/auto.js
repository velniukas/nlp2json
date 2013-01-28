$(function() {
	function log( message ) {
		$( "<div>" ).text( message ).prependTo( "#log" );
		$( "#log" ).scrollTop( 0 );
	}
	$( "#qry" )
		// we only want to call the query we we tab or space
	    //.keydown(function(event) {
        //	if (event.keyCode === $.ui.keyCode.TAB)
        //    	event.preventDefault();
		//})
	    .autocomplete({
			source: function( request, response ) {
				var term = request.term;
				$.getJSON( "http://localhost:3000/qry?q="+term, request, function(data, status, xhr) {
					response(data);
					log(response(data));
				});
			},
			minLength: 2,
			select: function( event, ui ) {
				log( ui.item ?
					"Tokens: " + ui.item.value + " aka " + ui.item.id :
					"Nothing selected, input was " + this.value );
			}
		});
});