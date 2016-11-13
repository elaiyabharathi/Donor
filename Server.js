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

app.use(express.static('C:\\PP\\Donor'));

app.listen(8889);

var url = 'mongodb://localhost:27017/test';

var db;


function sendEmail(subject , message , recepientEmail){


  var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'surabitrustee@gmail.com', // Your email id
              pass: 'bess1234' // Your password
          }
      });


  var text = 'Hello world  \n\n';

  var mailOptions = {
      from: 'surabitrustee@gmail.com', // sender address
      to: recepientEmail, // list of receivers
      subject: subject, // Subject line
      text: message //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);

      }else{
          console.log('Message sent: ' + info.response);

      };
  });



}

function sendSMS(phoneno,message){
	var client = twilio('ACf33e0dc0b3526f59f4a3d49b02a5b6d6', '82a54c59c873d25977b267fcd5c1ef8a');

	// Send the text message.
	client.sendMessage({
		to: '+919542947251',
		from: '+19067537957',
		body: message
	},function(error, info){
			if(error){
					console.log(error);

			}else{
					console.log('Message sent: ' + info);
				}

			});

}

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

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 10 12 * * *',
   onTick: function() {

    console.log('Cron is running ');
		var currentDate = new Date();
	  currentDate.setDate(currentDate.getDate() + 7);
		var timeinmillis = currentDate.getTime();

    var queryJSON = {}
		queryJSON.dateOfBirth = {};
		queryJSON.dateOfBirth.gte = timeinmillis;


		db.collection('Donors', function(err, collection) {
	             collection.find(queryJSON).toArray(function(err, items) {
	                 console.log(items);
	                 //res.send(items);

									 /*for( var i = 0 ; i < items.length ; i ++){

										 sendSMS(phoneno,message);
										 sendEmail(subject , message , recepientEmail);
									 }*/



	             });
	         });

					 /**/


  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();

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


	var email=request.body.addEmail;


	db.collection('Donations').insertOne( {
		"name" : name,
		"mobileNumber" : mobileNumber,
		"email" : email,
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

app.post('/fetchDonationReport',function(request, response){

	console.log("fetchDonationReport Called");

	var minValue=request.body.queryMinAmount;
	var maxValue=request.body.queryMaxAmount;
	var fromDate=new Date(request.body.queryFromDate).getTime();
	var toDate=new Date(request.body.queryToDate).getTime();
	var name=request.body.queryDonorName;
	var mobileNumber=request.body.queryMobileNumber;
	var cause=request.body.queryCause;

	var queryJSON = {};

	if(minValue!=""){
		queryJSON.amount={};
		queryJSON.amount.gte=minValue;
	}
	if(maxValue!=""){
		if(maxValue==""||isNaN(maxValue))
			queryJSON.amount={};
		queryJSON.amount.lte=maxValue;
	}
	if(fromDate!=""&&!isNaN(fromDate)){
		queryJSON.donatedDate={};
		queryJSON.donatedDate.gte=fromDate;
	}
	if(toDate!=""&&!isNaN(toDate)){
		if(fromDate==""||isNaN(fromDate))
			queryJSON.donateDate={};
		queryJSON.donatedDate.lte=toDate;
	}
	if(name!="")
		queryJSON.name=name;
	if(mobileNumber!="")
		queryJSON.mobileNumber=mobileNumber;
	if(cause!="")
		queryJSON.cause=cause;

	console.log(queryJSON);

	db.collection('Donations', function(err, collection) {
             collection.find(queryJSON).toArray(function(err, items) {
                 console.log(items);
                 //res.send(items);
             });
         });

	response.redirect('/');
});

app.post('/fetchDonorUserReport',function(request, response){

	console.log("fetchDonorUserReport Called");

	var name=request.body.queryDonorName;
	var mobileNumber=request.body.queryMobileNumber;
	var cause=request.body.queryCause;
	var emailID=request.body.queryEmail;

	var queryJSON = {};

	if(name!="")
		queryJSON.name=name;
	if(mobileNumber!="")
		queryJSON.mobileNumber=mobileNumber;
	if(cause!="")
		queryJSON.cause=cause;
	if(emailID!="")
		queryJSON.emailID=emailID;

	console.log(queryJSON);

	db.collection('Donors', function(err, collection) {
             collection.find(queryJSON).toArray(function(err, items) {
                 console.log(items);
                 //res.send(items);
             });
         });

	response.redirect('/');
});
