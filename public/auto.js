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
			dataType: 'json', 
			extraParams: {
				format: 'json' // pass the required context to the Zend Controller
			},
			parse: function(data) {
				alert('parse: '+data);
				var array = [];
				for (var i = 0; i < data.items.length; i++) {
					array[array.length] = {
						data: data.items[i],
						value: data.items[i],
						result: data.items[i]
					};
				}
				return parsed;
			},
			formatItem: function(row) {
				return row.value;
			},
			source: function( request, response ) {
				var term = request.term;
				if (term in cache) {
					response([cache[term]]);
					return;
				}
				$.getJSON( "http://localhost:3000/qry?q="+term, request, function() {
					alert("success");
				})
				.success(function(data, status, xhr) { 
					alert("second success"); 
					var tokens = [];
					$.each(JSONObject.data.bindings, function(i, obj) {
						tokens.push([obj.label.value, obj.value.value]);
					});
					alert('received: '+tokens);
					cache[term] = tokens;
					response(tokens);
				})
				.error(function(data, status, xhr) { alert("error: "+status); })
				.complete(function() { alert("complete"); });
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