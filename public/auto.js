$(function() {
	var cache = {};
	function log( message ) {
		$( "<div>" ).text( message ).prependTo( "#log" );
		$( "#log" ).scrollTop( 0 );
	}
	$( "#qry" )
		// we only want to call the query we we tab or space
	    //.keydown(function(event) {
        //	if (event.keyCode != $.ui.keyCode.SPACE)
        //    	return; //event.preventDefault();
		//})
		.autocomplete({
			source: function( request, response ) {
				var term = request.term;
				if (term in cache) {
					response([cache[term]]);
					return;
				}
				$.getJSON( "http://localhost:3000/qry?q="+term, request, function(data, status, xhr) {
					//alert('received: '+data);
					cache[term] = data;
					log( data.map(function(item) { return item.value; }).join(", ") );
					response(data);
				})
				.error(function(data, status, xhr) { alert("error: "+status+"\n"+xhr); });
			},
			minLength: 2
			//select: function( event, ui ) {
			//	alert('select: '+ui.item);
			//	log( ui.item ?
			//		"Tokens: " + ui.item.value + " aka " + ui.item.id :
			//		"Nothing selected, input was " + this.value );
			//}
		});
});