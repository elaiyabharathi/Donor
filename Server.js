var exec=require("child_process").exec;
var querystring=require("querystring");
//var fs=require("fs");
//var HashMap = require("hashmap");
var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var assert = require('assert');
var bodyParser = require("body-parser");
var app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('C:\\Users\\echinnasamy\\Desktop\\CRT Files\\Donor'));

app.listen(8889);

var url = 'mongodb://localhost:27017/test';

var db;

MongoClient.connect(url, function(err, mdb) {
		if(!err) {
			console.log("We are connected" + new Date());
			db = mdb;
		}
		else {
			throw err;
			console.log("We are not connected");
		}
});

app.post('/Register_Donor',function(request,response){

	console.log("Called Register_Donor");
	
	
	var name=request.body.regName;
	var gender=request.body.regGender;
	var dateOfBirth=new Date(request.body.regDateOfBirth).getTime();
	var address=request.body.regAddress;
	var mobileNumber=request.body.regMobileNumber;
	var emailID=request.body.regEmailID;
	
	
	
	db.collection('Donors').insertOne( {
			"name" : name,
			"gender" : gender,
			"dateOfBirth" : dateOfBirth,
			"address" : address,
			"mobileNumber" : mobileNumber,
			"emailID" : emailID
		}, function(err, result) {
		console.log(err);
		console.log(result);
			assert.equal(err, null);
			console.log("Inserted a document into the Donors collection.");
	});	
	response.redirect('/');
});

app.post('/Add_Donation',function(request,response){

	console.log("Called Add_Donation");
	console.log(request.body.addName);
	
	var name=request.body.addName;
	var mobileNumber=request.body.addMobileNumber;
	var amount=parseInt(request.body.addAmount);
	var transferedDate=new Date(request.body.transferedDate).getTime();
	var donatedDate=new Date(request.body.donatedDate).getTime();
	var remarks=request.body.addRemarks;
	
	db.collection('Donations').insertOne( {
		"name" : name,
		"mobileNumber" : mobileNumber,
		"amount" : amount,
		"transferedDate" : transferedDate,
		"donatedDate" : donatedDate,
		"remarks" : remarks
	}, function(err, result) {
		console.log(err);
		console.log(result);
		assert.equal(err, null);
		console.log("Inserted a document into the Donations collection.");
		});
	response.redirect('/');
});

app.post('/Retrieve_Donations',function(request, response){

	console.log("Retrieve_Donations Called");
	
	var minValue=request.body.queryMinAmount;
	var maxValue=request.body.queryMaxAmount;
	var fromDate=new Date(request.body.queryFromDate).getTime();
	var toDate=new Date(request.body.queryToDate).getTime();
	var name=request.body.queryDonorName;
	var mobileNumber=request.body.queryMobileNumber;
	var cause=request.body.queryCause;
	
	var queryJSON = {};
	
	if(minValue!="")
		queryJSON.minValue.gte=minValue;
	if(maxValue!="")
		queryJSON.maxValue.lte=maxValue;
	if(fromDate!=""&&fromDate!=NaN)
		queryJSON.fromDate=fromDate;
	if(toDate!=""&&toDate!=NaN)
		queryJSON.toDate=toDate;
	if(name!="")
		queryJSON.name=name;
	if(mobileNumber!="")
		queryJSON.mobileNumber=mobileNumber;
	if(cause!="")
		queryJSON.cause=cause;
	
	console.log(queryJSON);
	
	db.collection('Donations', function(err, collection) {
             collection.find().toArray(function(err, items) {
                 console.log(items);
                 //res.send(items);
             });
         });	
		
	reponse.write('/');
});