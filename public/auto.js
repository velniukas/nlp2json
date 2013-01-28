$(function() {
	var cache = {};
	function log( message ) {
		$( "<div>" ).text( message ).prependTo( "#log" );
		$( "#log" ).scrollTop( 0 );
	}
	$( "#qry" )
		// we only want to call the query we we tab or space
	    .keydown(function(event) {
        	if (event.keyCode != $.ui.keyCode.SPACE)
            	return; //event.preventDefault();
		})
		.autocomplete({
			//dataType: 'json', // this parameter is currently unused
			//extraParams: {
			//	format: 'json' // pass the required context to the Zend Controller
			//},
			//parse: function(data) {
			//	var parsed = [];
			//	data = data.tokens;
			//	for (var i = 0; i < data.length; i++) {
			//		parsed[parsed.length] = {
			//			data: data[i],
			//			value: data[i].displayName,
			//			result: data[i].displayName
			//		};
			//	}
			//	return parsed;
			//},
			//formatItem: function(item) {
			//	return item.displayName + ' (' + item.value + ')';
			//}
			source: function( request, response ) {
				var term = request.term;
				if (term in cache) {
					response([cache[term]]);
					return;
				}
				$.getJSON( "http://localhost:3000/qry?q="+term, request, function(data, status, xhr) {
					//data = {id: 0, label: 'testing', value: 'test'};
					alert('received: '+data);
					cache[term] = data;
					response(data);
				});
			},
			minLength: 2,
			select: function( event, ui ) {
				alert('select: '+ui.item);
				log( ui.item ?
					"Tokens: " + ui.item.value + " aka " + ui.item.id :
					"Nothing selected, input was " + this.value );
			}
		});
});