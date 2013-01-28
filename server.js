var natural = require('natural'),
  classifier = new natural.BayesClassifier(),
  tokenizer = new natural.WordTokenizer();

  natural.PorterStemmer.attach();

// load the classifier data and learn the schema
/*natural.BayesClassifier.load('./classifier.json', null, function(err, classifier) {
	// if the classifier hasn't been saved, then calculate it now
	if (err) {
		var traindata = require('./trainingdata.json');
		for (i in traindata)
		{
			classifier.addDocument(traindata[i].query, traindata[i].category);
		}
		classifier.train();
		classifier.save('classifier.json', function(err, classifier) {

		});
	}
	//test
    console.log(classifier.classify('long SUNW'));
    console.log(classifier.classify('short SUNW'));
});
*/

var sys = require('sys'),
    express = require('express');

var app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname+'/public'));

// serve static html client at /
app.get('/', function (req, res) {
  res.render('index', {title: 'Query'});
});

// serve query at deconstructQuery
app.get('/qry', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  res.write('Answer.\n');

  var q = req.param('q');
  console.log('--------------------------------------------------------------------');
  console.log('query = '+q);

  var tokens;
  if (q) {
  	  //res.write('query: '+q+'\n');
	  tokens = q.tokenizeAndStem();
	//  var category = classifier.getClassifications(req.params.qry);
	  console.log(tokens);
	//  console.log(category);

	//  res.send(category);

//		res.write(tokens);
	res.write("{[");
	for (i in tokens) {
		if (i > 0) {
			res.write(', ');
		}
		console.log(tokens[i]);
		res.write("{'id': "+i+", ");
		res.write("'value': '"+tokens[i]+"'}");
	}
	res.write("]}");
  }
  else res.write(false);
  res.end();
});


app.listen(3000);

console.log('NLP Query Server running on port 3000');