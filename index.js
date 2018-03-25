const express = require('express');
const pSettle = require('p-settle');
var elasticsearch = require('elasticsearch');

//Course API
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
//END of Course API

//ELASTICSEARCH CLIENT
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
//END

const app = express();
const port = 9292;

app.listen(port, () => console.log(`Listening on port ${port}`));

//API POPULATE
app.get('/api/populate', (req, res) => {
	console.log("API CALL POPULATE");

	store_models(res);
});

//API SUV
app.get('/api/suv', (req, res) => {
	console.log("API CALL SUV");

	var req_query = req.query;
	console.log(req_query);

	get_stored_models(res,req_query);
});

//API CREATE INDEX
app.get('/api/create/index', (req, res) => {
	console.log("API CALL CREATE INDEX");

	client.indices.create({
		index: 'data'
	}, function(err, resp, status) {
		if (err) {
			console.log(err);
		} else {
			console.log("create", resp);
		}
	});

	res.send("DONE");

});

//API DELETE INDEX
app.get('/api/delete/index', (req, res) => {
	console.log("API CALL SUV");

	client.indices.delete({index: 'data'},function(err,resp,status) {  
		console.log("delete",resp);
	});

	res.send("DONE");
});

/*
client.indices.create({
	index: 'data'
}, function(err, resp, status) {
	if (err) {
		console.log(err);
	} else {
		console.log("create", resp);
	}
});
*/

async function get_stored_models(res,req_query){

	//{ brand: 'BOLLORE', name: 'tamer' }

	//DEFAULT QUERY
	var query = {match_all:{}};
	var must = [];
	var filter = [];

	if(req_query!=={}){

		//		{ "match": { "title":  "War and Peace" }},
		//		{ "match": { "author": "Leo Tolstoy"   }}

		for(x in req_query){

			if(x==="volumemin"){
				var str = '{"volume":'+ '{"gte":' +req_query[x]+'}}';
				var jsonobj = JSON.parse(str);
				console.log("FILTER GTE DONE");
				filter.push({"range": jsonobj})
			}
			else if(x==="volumemax"){
				var str = '{"volume":'+ '{"lte":' +req_query[x]+'}}';
				var jsonobj = JSON.parse(str);
				console.log("FILTER GTE DONE");
				filter.push({"range": jsonobj})
			}
			else{
				var str = '{"'+x+'":"'+req_query[x]+'"}';
				var jsonobj = JSON.parse(str);
				console.log(jsonobj);
				must.push({"match":jsonobj})
			}

		}

		query = {
			"bool": {
				"must": must,
				"filter":filter
			}
		}
	}

	client.search({
		index: 'data',
		type: 'model_brand',
		size: 200,
		body: {
			query: query
		}
	}).then(function (body) {
		if(body.hits.total>0){
			var source_array = [];
			body.hits.hits.forEach(function(object){
				source_array.push(object._source);
			})
			res.send(source_array);
		}
		else{
			res.send(body.hits.hits);
		}
		
	}, function (err) {
		res.send(err.message);
	});
}



async function store_models(res){
	var brands = await getBrands();
	//var models = [];
	//brands.map(brand=> await getModels(brand))
	const models = brands.map(async brand => {
		return await test_get_models(brand);
	});
	var obj = [];
	var compteur = 1;
	var reg =/[ ]/g;
	var reg2 =/[(,)]/g;

	//TEST
	const results = await pSettle(models);
	const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);
	const model_brand_array = [].concat.apply([], isFulfilled);

	const test = model_brand_array.map(async model_brand=>{
		//ELASTICSEARCH
		client.index({  
			index: 'data',

			type: 'model_brand',
			body: {
				"brand": model_brand.brand,
				"model": model_brand.model,
				"volume": model_brand.volume,
				"uuid": model_brand.uuid,
				"name": model_brand.name,
				"url": "http://www.caradisiac.com/modele--"+model_brand.model.toLowerCase().replace(reg,"-").replace(reg2,"")+"/",
			}
		},function(err,resp,status) {
			console.log(resp);
		});
	})

	const done = await pSettle(test);
	
	res.send(model_brand_array);
	console.log(model_brand_array.length);
	//END TEST

	/*
	pSettle(models).then(result=>{
		result.forEach(function(elem){
			if(elem.isFulfilled && elem.value.length > 0){
				obj.push(elem.value);
				console.log("////////////////////////////////////////////////////");
				console.log(elem.value);
				console.log("////////////////////////////////////////////////////");

				elem.value.forEach(function(json_object){

				//ELASTICSEARCH
				client.index({  
					index: 'data',
					
					type: 'model_brand',
					body: {
						"brand": json_object.brand,
						"model": json_object.model,
						"volume": json_object.volume,
						"uuid": json_object.uuid,
						"name": json_object.name,
						"url": "http://www.caradisiac.com/modele--"+json_object.model.toLowerCase().replace(reg,"-").replace(reg2,"")+"/",
					}
				},function(err,resp,status) {
					console.log(resp);
				});

				compteur++;
			});

			}
			
		});

		res.send(obj);
		console.log("Number of objects : " + (compteur-1));
	})

	*/

	//res.send(obj);
}

async function get_brands (res) {
	var brands = await getBrands();
	res.send( brands );
}

async function get_models () {
	const models = await getModels('AUDI');
	console.log(models);
	return models;
}

async function test_get_models(brand){
	const models = await getModels(brand);
	//console.log(models);
	return models;
}