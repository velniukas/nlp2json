var natural = require('natural'),
  pos = require('pos'),
  wordnet = new natural.WordNet(),
  _ = require('underscore'),
  NGrams = natural.NGrams,
  classifier = new natural.BayesClassifier(),
  tokenizer = new natural.TreebankWordTokenizer(); // natural.WordTokenizer();

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

  var q = req.param('q');
  console.log('--------------------------------------------------------------------');
  console.log('query = '+q);

  var tokens;
  if (q) {
  	var data = [];

  	// we are going to search single and dual words for nouns to identify some semantics, e.g. names, cities etc
  	var unigrams = NGrams.ngrams(q, 1);
 	var bigrams = NGrams.bigrams(q);
 	console.log('bigrams: '+bigrams);

 	var words = new pos.Lexer().lex(q);
 	var taggedWords = new pos.Tagger().tag(words);	  

	//tokens = tokenizer.tokenize(q); 
	// or can do tokenize and stem
	tokens = q.tokenizeAndStem();

	//  var category = classifier.getClassifications(req.params.qry);
	console.log(tokens);

	// identify things (nouns)
	for (i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0]; 
		var tag = taggedWord[1];
		// mark all nouns and verbs
		if (_.contains(["NN", "NNP", "NNS", "NNPS", "URL", /*"VB", "VBD", "VBG", "VBN", "VBP", "VBZ"*/], tag)) {
			console.log(word + " /" + tag);
		} 
	}

	// lookup bigrams for Proper Nouns and significant words etc to combine into one 'meta phrase'
	// if we find a lemma then this is a single entity (token), e.g. New York
	for (i in bigrams) {
		var phrase = bigrams[i].map(function(item) { return item.toString(); }).join(" ");
		//console.log('phrase: '+phrase);
		var lemma = wordnet.lookup( phrase, function( results ) {
			results.some( function(result) {
				console.log(phrase + ": " + result.pos + ", " + result.lemma + ", " + result.gloss);
				data.push( {value: result.lemma} );
				return result.lemma;
			});
		});
	}

	for (i in tokens) {
		var row = {value: tokens[i]};
		data.push(row);
	}
	console.log(data);

	// JSON.parse(...) or data.toString() don't work
	// only Stringify puts quotes around id, lavel, value which autocomplete expects
	console.log(JSON.stringify(data));
	res.write( JSON.stringify(data) );
  }
  else res.write(false);
  res.end();
});


app.listen(3000);

console.log('NLP Query Server running on port 3000');