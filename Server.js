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

app.post('/Register_Donor',function(request,response){

	console.log("Called Register_Donor");
	console.log(request.body.regName);
	
	var name=request.body.regName;
	var gender=request.body.regGender;
	var dateOfBirth=request.body.regDateOfBirth;
	var address=request.body.regAddress;
	var mobileNumber=request.body.regMobileNumber;
	var emailID=request.body.regEmailID;
	
	var insertDocument;
	MongoClient.connect(url, function(err, db) {
		if(!err) {
			console.log("We are connected" + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}
		insertDocument = function(db, callback) {
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
		};
		
	});
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(db, function() {
		  db.close();
	  });
	});
	
	response.redirect('/');
});

app.post('/Add_Donation',function(request,response){

	console.log("Called Add_Donation");
	console.log(request.body.addName);
	
	var name=request.body.addName;
	var mobileNumber=request.body.addMobileNumber;
	var amount=request.body.addAmount;
	var transferedDate=request.body.transferedDate;
	var donatedDate=request.body.donatedDate;
	var remarks=request.body.addRemarks;
	
	var insertDocument;
	MongoClient.connect(url, function(err, db) {
		if(!err) {
			console.log("We are connected" + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}
		
		insertDocument = function(db, callback) {
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
		};
		
	});
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(db, function() {
		  db.close();
	  });
	});
	
	response.redirect('/');
});


app.post('/result_basic_query',function(postData,response){
	var totalTime;
	Date.prototype.addDays = function(days) {
							var dat = new Date(this.valueOf())
							dat.setDate(dat.getDate() + days);
							return dat;
						}

						function getDates(startDate, stopDate) {
							var dateArray = new Array();
							var aht_countArray =new Array();
							var currentDate = startDate;
							var dateString,month,monthString,day,dayString;
							while (currentDate <= stopDate) {
								month = currentDate.getMonth();
								month+=1;
								if(month<10){
									monthString = '0' + month;
								}
								else{
									monthString = month;
								}

								day = currentDate.getDate();

								if(day<10){
									dayString = '0' + day;
								}
								else{
									dayString = day;
								}


								dateString = currentDate.getFullYear() + '-' + monthString + '-' + dayString;

								dateArray.push(dateString);
								aht_countArray.push(0,0);
								currentDate = currentDate.addDays(1);

							}
							return dateArray;
						}

	Date.prototype.addHours = function(h) {    
		this.setTime(this.getTime() + (h*60*60*1000)); 
		return this;   
	}

	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
		if(!err) {
			console.log("We are connected... Called result_basic_query"  + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}
		var a=postData.body.contactReason;
		var b=postData.body.startDate;
		var c=postData.body.endDate;
		var d=postData.body.contactTrackingOnlyAgent;
		var e=postData.body.geoLocation;
		var f=postData.body.skillSet;
		var g=postData.body.department;
		var h=postData.body.teammateTitle;
		var i=postData.body.managerNTID;
		var j=postData.body.teammateIDs;
		var k=postData.body.callTransfer;
		var l=postData.body.experienceRange;

		console.log(l);
		var experienceSplit = l.split(";");
		var startExperience = parseFloat(experienceSplit[0])*365;
		var endExperience = parseFloat(experienceSplit[1])*365;

	//	console.log(l);

		if(a.length==0)
			a="";
		else{
			var index;	
			for(index=a.length;index>0;index--){
				if(a[index]=="-")
					break;
			}

			a = a.substring(0,index);
		}
		var start = new Date(b);
		var end = new Date(c);

		//	start = start.addHours(7);
		//	end = end.addHours(7);
		var startmilli, endmilli;
		var limitBuild = new Date();
		var month, monthString, day, dayString, dateString;
		month = limitBuild.getMonth();
								month+=1;
								if(month<10){
									monthString = '0' + month;
								}
								else{
									monthString = month;
								}

								day = limitBuild.getDate();

								if(day<10){
									dayString = '0' + day;
								}
								else{
									dayString = day;
								}


								dateString = monthString + '/' + dayString + '/'+ limitBuild.getFullYear();
var limitDate = (new Date(dateString)).addDays(-2);
var limitmilli = limitDate.getTime();
console.log(limitmilli);
if(b!=""){
	if(start.getTime()>limitmilli){
		startmilli = limitmilli;
		start = limitDate;
	}
	else
		startmilli = start.getTime();
}
if(c!=""){
	if(end.getTime()>limitmilli){
		endmilli = limitmilli;
		end=limitDate;
	}
	else
		endmilli = end.getTime()+86400000;
}



//console.log(startmilli);


if(j!=""){
	var teammateSplit = j.split(",");

	j="";
	teammateSplit.forEach(function(teammate){
		j += '\"' + teammate + '\",';
	});
}
var aht_query = "";
var map_query = "";
var workFlowEmpty_query = "";

var aggregate_part = 'db.new.aggregate( [';

var match_query = 'db.TICase_bulk.aggregate([{ $match :{';

console.log("teammateTitle (" + h + ")");


if(a!="")
	match_query=match_query+'\"contactReason\":\"'+a+'\",';
if(b!="")
	match_query=match_query+'\"startTime\":{$gte:'+startmilli+'},';
if(c!="")
	match_query=match_query+'\"endTime\":{$lte:'+endmilli+'},';
if(d!="-"&&d!="")
	match_query=match_query+'\"contactTrackingOnlyAgent\":'+d+',';
if(e!="-"&&e!="")
	match_query=match_query+'\"geoLocations\":\"'+e+'\",';
if(f!="-"&&f!="")
	match_query=match_query+'\"skillSets\":\"'+f+'\",';
if(g!="-"&&g!="")
	match_query=match_query+'\"departments\":\"'+g+'\",';
if(h!="-"&&h!="")
	match_query=match_query+'\"teammateTitles\":\"'+h+'\",';
if(i!="-"&&i!="")
	match_query=match_query+'\"managerNTIDs\":\"'+i+'\",';
if(j!="")
	match_query=match_query+'\"teammateIDs\":{$in:['+j+']},';
if(k!="-")
	match_query=match_query+'\"transferCallHappened\":'+k+',';
if(startExperience!="0"||endExperience!="5475")
	match_query=match_query+'\"experience\":{$gte:'+startExperience+',$lte:' +endExperience+'},';

match_query=match_query+'}}, {$out:\"new\"}])';

console.log(match_query);

db.eval('function(){ return ' + match_query + '.toArray(); }', function(err, Result){
	if(err) {
		throw err;
	}


	aht_query=aggregate_part + ' { $group:{_id:null ,aht: { $avg: "$totalTime" }, count: { $sum: 1} } } ] )';

	var aht =0;
	var count =0;
	console.log(aht_query);


	db.eval('function(){ return ' + aht_query + '.toArray(); }', function(err, ahtResult){
		if(err) {
			throw err;
		}

		
		ahtResult.forEach(function(entry){
			aht=entry.aht;
			count=entry.count;

		});

	//	console.log(ahtResult.length);
	//	console.log(aht);
	//	console.log(count);

		var beautified_query = 'db.BeautifiedWorkFlows.find()';

		db.eval('function(){ return ' + beautified_query + '.toArray(); }', function(err, beautifiedResult){

			var beautifiedMap = [];

			beautifiedResult.forEach(function(workFlow){
				beautifiedMap[workFlow._id] = {beautifiedName: workFlow.flowName};
			});

			map_query=aggregate_part + ' {$project:{_id:0,workFlows:1}},{$unwind:"$workFlows"},{ $group:{_id:"$workFlows", count: { $sum: 1} } } ] )';

			console.log(map_query);

			db.eval('function(){ return ' + map_query + '.toArray(); }', function(err, mapResult){


				var map_array = [], beautifiedName, tempOb;

				mapResult.forEach(function(entry){
					tempOb = beautifiedMap[entry._id];

					if(typeof tempOb === 'undefined')
						beautifiedName = entry._id;
					else
						beautifiedName = tempOb.beautifiedName;

					map_array.push({"workFlow":beautifiedName,"count":entry.count});				

				});
				
				mapNode_query=aggregate_part + ' {$project:{_id:0,nodes:1}},{$unwind:"$nodes"},{ $group:{_id:"$nodes", count: { $sum: 1} } } ] )';

			console.log(mapNode_query);

			db.eval('function(){ return ' + mapNode_query + '.toArray(); }', function(err, mapNodeResult){


				var mapNode_array = [];

				mapNodeResult.forEach(function(entry){
					
					mapNode_array.push({"node":entry._id,"count":entry.count});				

				});
/*
				workFlowEmpty_query = aggregate_part +' {$match:{"workFlows":[]}},{ $group:{_id:null, count: { $sum: 1} } } ] )';

				console.log(workFlowEmpty_query);

				db.eval('function(){ return ' + workFlowEmpty_query + '.toArray(); }', function(err, workFlowEmptyResult){

					if(workFlowEmptyResult.length==0)
						emptyCount = 0;
					else
						emptyCount = workFlowEmptyResult[0].count;
*/
					var timeline_query =  'db.new.aggregate([{$project:{_id:0,totalTime:1,date:{ $dateToString: { format: \"%Y-%m-%d\",date : {$add: [new Date(0), \"$startTime\", -25200000]}}}}},{$group:{_id:\"$date\",aht:{$avg:\"$totalTime\"},count:{$sum:1}}},{$sort:{_id:1}}])';

					console.log(timeline_query);

					db.eval('function(){ return ' + timeline_query + '.toArray(); }', function(err, timelineResult){
						

						if(b=="")
							start=new Date(2016,5,2);

						if(c=="")
							end=limitDate;
						
							
				//		console.log("Start " + start + "End " + end);

						var dateArray = getDates(start, end);
						var timeline_array = [];

						var j=0;
						for(var i=0; i<dateArray.length;i++){
							if(timelineResult[j]!=null){
								if(timelineResult[j]._id==dateArray[i]){
									timeline_array.push({"date":dateArray[i],"count":timelineResult[j].count,"aht":timelineResult[j].aht});
									j++;
								}
							}
							else{
								timeline_array.push({"date":dateArray[i],"count":0,"aht":0});
							//console.log("00000000");
						}
					}

					console.log("\nLenght + " + timeline_array.length);

					response.writeHead(200,{"content-Type":"application/json"});
					response.write('{"aht":'+aht+',"count":'+count+',"WorkFlowMap":'+JSON.stringify(map_array)+',"NodeMap":'+JSON.stringify(mapNode_array)+',"timelineData":'+JSON.stringify(timeline_array)+'}');
					response.end();
				});
				});	
			});
		});

	});
});
});
	});



app.post('/result_compare',function(postData,response){

	var totalTime;

	Date.prototype.addHours = function(h) {    
		this.setTime(this.getTime() + (h*60*60*1000)); 
		return this;   
	}

	Date.prototype.addDays = function(days) {
		var dat = new Date(this.valueOf())
		dat.setDate(dat.getDate() + days);
		return dat;
	}

	function getDates(startDate, stopDate) {
		var dateArray = new Array();
		var aht_countArray =new Array();
		var currentDate = startDate;
		var dateString,month,monthString,day,dayString;
		while (currentDate <= stopDate) {
			month = currentDate.getMonth();
			month+=1;
			if(month<10){
				monthString = '0' + month;
			}
			else{
				monthString = month;
			}

			day = currentDate.getDate();

			if(day<10){
				dayString = '0' + day;
			}
			else{
				dayString = day;
			}


			dateString = currentDate.getFullYear() + '-' + monthString + '-' + dayString;

			dateArray.push(dateString);
			aht_countArray.push(0,0);
			currentDate = currentDate.addDays(1);

		}
		return dateArray;
	}


	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
		if(!err) {
			console.log("We are connected... Called result_basic_query"  + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}

		var b=postData.body.startDate;
		var c=postData.body.endDate;

		var a1=postData.body.contactReason1;
		var d1=postData.body.contactTrackingOnlyAgent1;
		var e1=postData.body.geoLocation1;
		var f1=postData.body.skillSet1;
		var g1=postData.body.department1;
		var h1=postData.body.teammateTitle1;
		var i1=postData.body.managerNTID1;
		var j1=postData.body.teammateIDs1;
		var k1=postData.body.callTransfer1;
		var l1=postData.body.experienceRange1;

		

		var a2=postData.body.contactReason2;
		var d2=postData.body.contactTrackingOnlyAgent2;
		var e2=postData.body.geoLocation2;
		var f2=postData.body.skillSet2;
		var g2=postData.body.department2;
		var h2=postData.body.teammateTitle2;
		var i2=postData.body.managerNTID2;
		var j2=postData.body.teammateIDs2;
		var k2=postData.body.callTransfer2;
		var l2=postData.body.experienceRange2;

		var experienceSplit1 = l1.split(";");
		var startExperience1 = parseFloat(experienceSplit1[0])*365;
		var endExperience1 = parseFloat(experienceSplit1[1])*365;

		var experienceSplit2 = l2.split(";");
		var startExperience2 = parseFloat(experienceSplit2[0])*365;
		var endExperience2 = parseFloat(experienceSplit2[1])*365;

		if(a1.length==0)
			a1="";
		else{
			var i;	
			for(i=a1.length;i>0;i--){
				if(a1[i]=="-")
					break;
			}

			a1 = a1.substring(0,i);
		}


		if(a2.length==0)
			a2="";
		else{
			var i;	
			for(i=a2.length;i>0;i--){
				if(a2[i]=="-")
					break;
			}

			a2 = a2.substring(0,i);
		}


		var start = new Date(b);
		var end = new Date(c);
		
		var startmilli, endmilli;
		var limitBuild = new Date();
		var month, monthString, day, dayString, dateString;
		month = limitBuild.getMonth();
								month+=1;
								if(month<10){
									monthString = '0' + month;
								}
								else{
									monthString = month;
								}

								day = limitBuild.getDate();

								if(day<10){
									dayString = '0' + day;
								}
								else{
									dayString = day;
								}


								dateString = monthString + '/' + dayString + '/'+ limitBuild.getFullYear();
var limitDate = (new Date(dateString)).addDays(-2);
var limitmilli = limitDate.getTime();
console.log(limitmilli);
if(b!=""){
	if(start.getTime()>limitmilli){
		startmilli = limitmilli;
		start = limitDate;
	}
	else
		startmilli = start.getTime();
}
if(c!=""){
	if(end.getTime()>limitmilli){
		endmilli = limitmilli;
		end=limitDate;
	}
	else
		endmilli = end.getTime()+86400000;
}

console.log(endmilli);
		if(j1!=""){
			var teammateSplit = j1.split(",");

			j1="";
			teammateSplit.forEach(function(teammate){
			j1+= '\"' + teammate + '\",';
			});
		}

		if(j2!=""){
			var teammateSplit = j2.split(",");

			j2="";
			teammateSplit.forEach(function(teammate){
			j2+= '\"' + teammate + '\",';
			});
		}
		//start = start.addHours(7);
		//end = end.addHours(7);


		
	//	console.log(startmilli);

		var aht_query1 = "";
		var map_query1 = "";
		var workFlowEmpty_query1 = "";

		var aggregate_part1 = 'db.new1.aggregate( [';

		var match_query1 = 'db.TICase_bulk.aggregate([{ $match :{';
		console.log("teammateTitle (" + h1 + ")");
		if(a1!="")
			match_query1=match_query1+'\"contactReason\":\"'+a1+'\",';
		if(b!="")
			match_query1=match_query1+'\"startTime\":{$gte:'+startmilli+'},';
		if(c!="")
			match_query1=match_query1+'\"endTime\":{$lte:'+endmilli+'},';
		if(d1!="-"&&d1!="")
			match_query1=match_query1+'\"contactTrackingOnlyAgent\":'+d1+',';
		if(e1!="-"&&e1!="")
			match_query1=match_query1+'\"geoLocations\":\"'+e1+'\",';
		if(f1!="-"&&f1!="")
			match_query1=match_query1+'\"skillSets\":\"'+f1+'\",';
		if(g1!="-"&&g1!="")
			match_query1=match_query1+'\"departments\":\"'+g1+'\",';
		if(h1!="-"&&h1!="")
			match_query1=match_query1+'\"teammateTitles\":\"'+h1+'\",';
		if(i1!="-"&&i1!="")
			match_query1=match_query1+'\"managerNTIDs\":\"'+i1+'\",';
		if(j1!="")
			match_query1=match_query1+'\"teammateIDs\":{$in:['+j1+']},';
		if(k1!="-")
			match_query1=match_query1+'\"transferCallHappened\":'+k1+',';
		if(startExperience1!="0"||endExperience1!="5475")
			match_query1=match_query1+'\"experience\":{$gte:'+startExperience1+',$lte:' +endExperience1+'},';

		match_query1=match_query1+'}}, {$out:\"new1\"}])';

		console.log(match_query1);

		db.eval('function(){ return ' + match_query1 + '.toArray(); }', function(err, Result1){
			if(err) {
				throw err;
			}

			var aht_query2 = "";
			var map_query2 = "";
			var workFlowEmpty_query2 = "";

			var aggregate_part2 = 'db.new2.aggregate( [';

			var match_query2 = 'db.TICase_bulk.aggregate([{ $match :{';


			if(a2!="")
				match_query2=match_query2+'\"contactReason\":\"'+a2+'\",';
			if(b!="")
				match_query2=match_query2+'\"startTime\":{$gte:'+startmilli+'},';
			if(c!="")
				match_query2=match_query2+'\"endTime\":{$lte:'+endmilli+'},';
			if(d2!="-"&&d2!="")
				match_query2=match_query2+'\"contactTrackingOnlyAgent\":'+d2+',';
			if(e2!="-"&&e2!="")
				match_query2=match_query2+'\"geoLocations\":\"'+e2+'\",';
			if(f2!="-"&&f2!="")
				match_query2=match_query2+'\"skillSets\":\"'+f2+'\",';
			if(g2!="-"&&g2!="")
				match_query2=match_query2+'\"departments\":\"'+g2+'\",';
			if(h2!="-"&&h2!="")
				match_query2=match_query2+'\"teammateTitles\":\"'+h2+'\",';
			if(i2!="-"&&i2!="")
				match_query2=match_query2+'\"managerNTIDs\":\"'+i2+'\",';
			if(j2!="")
				match_query2=match_query2+'\"teammateIDs\":{$in:['+j2+']},';
			if(k2!="-")
				match_query2=match_query2+'\"transferCallHappened\":'+k2+',';
			if(startExperience2!="0"||endExperience2!="5475")
				match_query2=match_query2+'\"experience\":{$gte:'+startExperience2+',$lte:' +endExperience2+'},';

			match_query2=match_query2+'}}, {$out:\"new2\"}])';

			console.log(match_query2);

			db.eval('function(){ return ' + match_query2 + '.toArray(); }', function(err, Result2){

				if(err) {
					throw err;
				}


				aht_query1=aggregate_part1 + ' { $group:{_id:null ,aht: { $avg: "$totalTime" }, count: { $sum: 1} } } ] )';

				var aht1 =0;
				var count1 =0;
				console.log(aht_query1);


				db.eval('function(){ return ' + aht_query1 + '.toArray(); }', function(err, ahtResult1){
					if(err) {
						throw err;
					}


					ahtResult1.forEach(function(entry){
						aht1=entry.aht;
						count1=entry.count;

					});


					console.log(aht1);
					console.log(count1);

					aht_query2=aggregate_part2 + ' { $group:{_id:null ,aht: { $avg: "$totalTime" }, count: { $sum: 1} } } ] )';

					var aht2 =0;
					var count2 =0;
					console.log(aht_query2);


					db.eval('function(){ return ' + aht_query2 + '.toArray(); }', function(err, ahtResult2){ 
						if(err) {
							throw err;
						}


						ahtResult2.forEach(function(entry){
							aht2=entry.aht;
							count2=entry.count;

						});


						console.log(aht2);
						console.log(count2);

						var beautified_query = 'db.BeautifiedWorkFlows.find()';

						db.eval('function(){ return ' + beautified_query + '.toArray(); }', function(err, beautifiedResult){

							var beautifiedMap = [];

							beautifiedResult.forEach(function(workFlow){
								beautifiedMap[workFlow._id] = {beautifiedName: workFlow.flowName};
							});





							map_query1=aggregate_part1 + ' {$project:{_id:0,workFlows:1}},{$unwind:"$workFlows"},{ $group:{_id:"$workFlows", count: { $sum: 1} } } ] )';

							console.log(map_query1);

							db.eval('function(){ return ' + map_query1 + '.toArray(); }', function(err, mapResult1){


								var map_array1 = [], beautifiedName, tempOb;

								mapResult1.forEach(function(entry){
									tempOb = beautifiedMap[entry._id];

									if(typeof tempOb === 'undefined')
										beautifiedName = entry._id;
									else
										beautifiedName = tempOb.beautifiedName;

									map_array1.push({"workFlow":beautifiedName,"count":entry.count});				

								});

								map_query2=aggregate_part2 + ' {$project:{_id:0,workFlows:1}},{$unwind:"$workFlows"},{ $group:{_id:"$workFlows", count: { $sum: 1} } } ] )';

								console.log(map_query2);

								db.eval('function(){ return ' + map_query2 + '.toArray(); }', function(err, mapResult2){


									var map_array2 = [];

									mapResult2.forEach(function(entry){
										tempOb = beautifiedMap[entry._id];

										if(typeof tempOb === 'undefined')
											beautifiedName = entry._id;
										else
											beautifiedName = tempOb.beautifiedName;

										map_array2.push({"workFlow":beautifiedName,"count":entry.count});			

									});
									
									mapNode_query1=aggregate_part1 + ' {$project:{_id:0,nodes:1}},{$unwind:"$nodes"},{ $group:{_id:"$nodes", count: { $sum: 1} } } ] )';

									console.log(mapNode_query1);

									db.eval('function(){ return ' + mapNode_query1 + '.toArray(); }', function(err, mapNodeResult1){


										var mapNode_array1 = [];

										mapNodeResult1.forEach(function(entry){
					
											mapNode_array1.push({"node":entry._id,"count":entry.count});				

										});
										
										mapNode_query2=aggregate_part2 + ' {$project:{_id:0,nodes:1}},{$unwind:"$nodes"},{ $group:{_id:"$nodes", count: { $sum: 1} } } ] )';

										console.log(mapNode_query2);

										db.eval('function(){ return ' + mapNode_query2 + '.toArray(); }', function(err, mapNodeResult2){


											var mapNode_array2 = [];

											mapNodeResult2.forEach(function(entry){
					
												mapNode_array2.push({"node":entry._id,"count":entry.count});				

											});

			/*var emptyCount1;

			workFlowEmpty_query1 = aggregate_part1 +' {$match:{"workFlows":[]}},{ $group:{_id:null, count: { $sum: 1} } } ] )';

			console.log(workFlowEmpty_query1);

			db.eval('function(){ return ' + workFlowEmpty_query1 + '.toArray(); }', function(err, workFlowEmptyResult1){

				if(workFlowEmptyResult1.length==0)
					emptyCount1 = 0;
				else
					emptyCount1 = workFlowEmptyResult1[0].count;

			var emptyCount2;

			workFlowEmpty_query2 = aggregate_part2 +' {$match:{"workFlows":[]}},{ $group:{_id:null, count: { $sum: 1} } } ] )';

			console.log(workFlowEmpty_query2);

			db.eval('function(){ return ' + workFlowEmpty_query2 + '.toArray(); }', function(err, workFlowEmptyResult2){

				if(workFlowEmptyResult2.length==0)
					emptyCount2 = 0;
				else
					emptyCount2 = workFlowEmptyResult2[0].count;
				*/          

				var contactReason_query1 = aggregate_part1 + '{$group:{_id:{contactReason:"$contactReason",topic:"$topic",subTopic:"$subTopic"},count:{$sum:1},aht:{$avg:"$totalTime"}}} ])';

				console.log(contactReason_query1);

				db.eval('function(){ return ' + contactReason_query1 + '.toArray(); }', function(err, contactReasonResult1){

					var contactReasonMap1 = {};

					contactReasonResult1.forEach(function(contactReason){
						contactReasonMap1[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'] = {count:contactReason.count,aht:contactReason.aht}; 
					});

					var contactReason_query2 = aggregate_part2 + '{$group:{_id:{contactReason:"$contactReason",topic:"$topic",subTopic:"$subTopic"},count:{$sum:1},aht:{$avg:"$totalTime"}}} ])';

					console.log(contactReason_query2);

					db.eval('function(){ return ' + contactReason_query2 + '.toArray(); }', function(err, contactReasonResult2){

						var contactReasonComparison = [];

						contactReasonResult2.forEach(function(contactReason){
							if(typeof contactReasonMap1[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'] === 'undefined')
								return; 
							contactReason.count1 = contactReasonMap1[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'].count;
							contactReason.aht1 = contactReasonMap1[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'].aht;
							contactReasonComparison.push({contactReason:contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')',count1:contactReason.count1,aht1:contactReason.aht1,count2:contactReason.count,aht2:contactReason.aht,difference:contactReason.aht-contactReason.aht1});   	
						});



						var timeline_query1 =  aggregate_part1 + '{$project:{_id:0,totalTime:1,date:{ $dateToString: { format: \"%Y-%m-%d\",date : {$add: [new Date(0), \"$startTime\", -25200000]}}}}},{$group:{_id:\"$date\",aht:{$avg:\"$totalTime\"},count:{$sum:1}}},{$sort:{_id:1}}])';

						console.log(timeline_query1);

						db.eval('function(){ return ' + timeline_query1 + '.toArray(); }', function(err, timelineResult1){


							var timeline_query2 =  aggregate_part2 + '{$project:{_id:0,totalTime:1,date:{ $dateToString: { format: \"%Y-%m-%d\",date : {$add: [new Date(0), \"$startTime\", -25200000]}}}}},{$group:{_id:\"$date\",aht:{$avg:\"$totalTime\"},count:{$sum:1}}},{$sort:{_id:1}}])';

							console.log(timeline_query2);

							db.eval('function(){ return ' + timeline_query2 + '.toArray(); }', function(err, timelineResult2){

								if(b=="")
									start=new Date(2016,5,2);

								if(c=="")
									end=limitDate;

				//				console.log("Start " + start + "End " + end);

								var dateArray = getDates(start, end);
								var timeline_array1 = [];
								var timeline_array2 = [];

								var j=0;

								for(var i=0; i<dateArray.length;i++){
									if(timelineResult1[j] != null){
										if(timelineResult1[j]._id==dateArray[i]){
											timeline_array1.push({"date":dateArray[i],"count":timelineResult1[j].count,"aht":timelineResult1[j].aht});
											j++;
										}
									}
									else{
										timeline_array1.push({"date":dateArray[i],"count":0,"aht":0});
									}
								}

								j=0;

								for(var i=0; i<dateArray.length;i++){
									if(timelineResult2[j] != null){
										if(timelineResult2[j]._id==dateArray[i]){
											timeline_array2.push({"date":dateArray[i],"count":timelineResult2[j].count,"aht":timelineResult2[j].aht});
											j++;
										}
									}
									else{
										timeline_array2.push({"date":dateArray[i],"count":0,"aht":0});
									}
								}

				//	console.log(contactReasonComparison);
				response.writeHead(200,{"content-Type":"application/json"});


				if(a1!="" || a2!="")
					response.write('{"aht1":'+aht1+',"count1":'+count1+',"WorkFlowMap1":'+JSON.stringify(map_array1)+',"NodeMap1":'+JSON.stringify(mapNode_array1)+',"timelineData1":'+JSON.stringify(timeline_array1) + ',"aht2":'+aht2+',"count2":'+count2+',"WorkFlowMap2":'+JSON.stringify(map_array2)+',"NodeMap2":'+JSON.stringify(mapNode_array2)+',"timelineData2":'+JSON.stringify(timeline_array2) + '}');
				else
					response.write('{"aht1":'+aht1+',"count1":'+count1+',"contactReasonComparison":'+JSON.stringify(contactReasonComparison)+',"WorkFlowMap1":'+JSON.stringify(map_array1)+',"NodeMap1":'+JSON.stringify(mapNode_array1)+',"timelineData1":'+JSON.stringify(timeline_array1) + ',"aht2":'+aht2+',"count2":'+count2+',"WorkFlowMap2":'+JSON.stringify(map_array2)+',"NodeMap2":'+JSON.stringify(mapNode_array2)+',"timelineData2":'+JSON.stringify(timeline_array2) + '}');
				response.end();
			//	console.log("done");
			});
						});	
					});
				});
});
});
});
});
});
});
});
});
});
});
});

app.post('/insight_contactReason',function(postData,response){
	
	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
		if(!err) {
			console.log("We are connected... Called insight_contactReason"  + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}

		var startDate = postData.body.startDate;
		var endDate = postData.body.endDate;

		var beautified_query = 'db.BeautifiedWorkFlows.find()';

		db.eval('function(){ return ' + beautified_query + '.toArray(); }', function(err, beautifiedResult){

			var beautifiedMap = [];

			beautifiedResult.forEach(function(workFlow){
				beautifiedMap[workFlow._id] = {beautifiedName: workFlow.flowName};
			});



			var contactReasonListQuery = 'db.ContactReason_total.find()';

			db.eval('function(){ return ' + contactReasonListQuery + '.toArray(); }', function(err1, contactReasonList){

				var contactReasonTotalCount=0;
				contactReasonList.forEach(function(contactReason){
					contactReasonTotalCount += contactReason.count;

				});

				contactReasonList.forEach(function(contactReason){
					contactReason.percentage = contactReason.count/contactReasonTotalCount*100;

				});
				var workFlowListQuery = 'db.WorkFlow_total.find()';

				db.eval('function(){ return ' + workFlowListQuery + '.toArray(); }', function(err2, workFlowList){

					var workFlowTotalCount=0;
					workFlowList.forEach(function(workFlow){
						workFlowTotalCount += workFlow.count;

					});

					var workFlowMap = {};

					workFlowList.forEach(function(workFlow){
						workFlowMap[workFlow._id] = {count: workFlow.count};
					});    				   				

					mapQuery='db.ContactReason_Workflowmap_total.aggregate({$group:{_id:{contactReason:"$_id.contactReason",topic:"$_id.topic",subTopic:"$_id.subTopic"},workFlows:{$push:{workFlow:"$_id.workFlow",count:"$count"}}}})';

					console.log(mapQuery);
					db.eval('function(){ return ' + mapQuery + '.toArray(); }', function(err3, mapList){


						var mapMap = {},tempOb, beautifiedName;

						mapList.forEach(function(mapEntry){
							mapMap[mapEntry._id.contactReason + '(' + mapEntry._id.topic+ '--'+ mapEntry._id.subTopic + ')'] = {workFlows:mapEntry.workFlows};
						});
						var num=0;
						contactReasonList.forEach(function(contactReason){
							if(typeof mapMap[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'] === 'undefined')
								return;
    	//					  console.log(contactReason._id.contactReason);
    						  contactReason.workFlows= JSON.parse(JSON.stringify(mapMap[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'].workFlows));
    						  contactReason.workFlows.forEach(function(workFlow){

    						  		tempOb = beautifiedMap[workFlow.workFlow];

    								if(typeof tempOb === 'undefined'){
										
										beautifiedName = workFlow.workFlow;
									}
									else
										beautifiedName = tempOb.beautifiedName;

										
									
    								workFlow.percentage = workFlow.count/workFlowMap[workFlow.workFlow].count*100;
    								workFlow.workFlow = beautifiedName;
    							});		
    						  contactReason._id.contactReason = contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')';

    						 
    					//	console.log(mapList.length);
    				});

						response.writeHead(200,{"content-Type":"application/json"});
						response.write('{"contactReasonList":'+JSON.stringify(contactReasonList)+'}');
						response.end();
					});
				});
			});			
		});

	});

});



app.post('/insight_workFlow',function(postData,response){
	
	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
		if(!err) {
			console.log("We are connected... Called insight_workFlow"  + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}

		var startDate = postData.body.startDate;
		var endDate = postData.body.endDate;


	//	console.log("1");

		var beautified_query = 'db.BeautifiedWorkFlows.find()';


		db.eval('function(){ return ' + beautified_query + '.toArray(); }', function(err, beautifiedResult){

			var beautifiedMap = [];
				//console.log("2");
			beautifiedResult.forEach(function(workFlow){
				beautifiedMap[workFlow._id] = {beautifiedName: workFlow.flowName};
			});


			var contactReasonListQuery = 'db.ContactReason_total.find()';

			db.eval('function(){ return ' + contactReasonListQuery + '.toArray(); }', function(err1, contactReasonList){

				var contactReasonMap = {};
	//console.log("3");
				contactReasonList.forEach(function(contactReason){
					//console.log(contactReason);
					contactReasonMap[contactReason._id.contactReason + '(' + contactReason._id.topic+ '--'+ contactReason._id.subTopic + ')'] = {count: contactReason.count, topic: contactReason._id.topic, subTopic: contactReason._id.subTopic};
					//console.log(contactReason._id.topic);
					//console.log(contactReason._id.subTopic);
				});    				   				


				var workFlowListQuery = 'db.WorkFlow_total.find()';



				db.eval('function(){ return ' + workFlowListQuery + '.toArray(); }', function(err2, workFlowList){
						//console.log("4");
					var workFlowTotalCount=0;
					workFlowList.forEach(function(workFlow){
						workFlowTotalCount += workFlow.count;

					});

					workFlowList.forEach(function(workFlow){
						workFlow.percentage = workFlow.count/workFlowTotalCount*100;

					});


					mapQuery='db.ContactReason_WorkFlowmap_total.aggregate({$group:{_id:"$_id.workFlow",contactReasons:{$push:{contactReason:"$_id.contactReason",topic:"$_id.topic",subTopic:"$_id.subTopic",count:"$count"}}}})';

					db.eval('function(){ return ' + mapQuery + '.toArray(); }', function(err3, mapList){

							
						var mapMap = {}, tempOb, beautifiedName;

						mapList.forEach(function(mapEntry){
							mapMap[mapEntry._id] = {contactReasons:mapEntry.contactReasons};
						});

						var num=0;
						workFlowList.forEach(function(workFlow){

							tempOb = beautifiedMap[workFlow._id];

							if(typeof tempOb === 'undefined'){
								console.log(workFlow._id);
								beautifiedName = workFlow._id;
							}
							else
								beautifiedName = tempOb.beautifiedName;

							if(typeof mapMap[workFlow._id] === 'undefined')
								return;
    						   //	console.log(workFlow._id);
    						   workFlow.contactReasons=mapMap[workFlow._id].contactReasons;


    						   workFlow.contactReasons.forEach(function(contactReason){
    								//workFlow.count = workFlowMap[workFlow.workFlow].count;
    								//workFlow.percentage = workFlowMap[workFlow.workFlow].percentage;
    							//	console.log(contactReason.contactReason + '(' + contactReason.topic+ '--'+ contactReason.subTopic + ')');
    								contactReason.percentage = contactReason.count/contactReasonMap[contactReason.contactReason + '(' + contactReason.topic+ '--'+ contactReason.subTopic + ')'].count*100;
    								contactReason.contactReason = contactReason.contactReason + '(' + contactReason.topic+ '--'+ contactReason.subTopic + ')';
    							
    							});		
    						   workFlow._id = beautifiedName;
    						   	//console.log("6");	

    						//console.log(mapList.length);
    					});

					//	console.log("Hi")

						response.writeHead(200,{"content-Type":"application/json"});
						response.write('{"workFlowList":'+JSON.stringify(workFlowList)+'}');
						response.end();
					//	console.log("No");

					});
				});
			});			
		});

	});

});

app.post('/insight_adminVsCompass',function(postData,response){


	
	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
		if(!err) {
			console.log("We are connected... Called insight_workFlow"  + new Date());
		}
		else {
			throw err;
			console.log("We are not connected");
		}

		var adminOnlyQuery = 'db.AdminOnly_ContactReason.find()';

		db.eval('function(){ return ' + adminOnlyQuery + '.toArray(); }', function(err, adminOnlyList){

			var compassAdminQuery = 'db.CompassAdmin_ContactReason.find()';


			db.eval('function(){ return ' + compassAdminQuery + '.toArray(); }', function(err, compassAdminList){

				var adminVsCompassList = {}, common, compassAdminMap = {};


				compassAdminList.forEach(function(compassAdmin){
					compassAdminMap[compassAdmin._id.contactReason + '(' + compassAdmin._id.topic+ '--'+ compassAdmin._id.subTopic + ')'] = {count: compassAdmin.count , aht: compassAdmin.aht};
				});

			
				var leftOutAdmin =[];

				adminOnlyList.forEach(function(adminOnly){

					common = compassAdminMap[adminOnly._id.contactReason + '(' + adminOnly._id.topic+ '--'+ adminOnly._id.subTopic + ')'];
    						//console.log(adminOnly._id);

    						if(typeof common === 'undefined'){
    							leftOutAdmin.push({contactReason:adminOnly._id.contactReason + '(' + adminOnly._id.topic+ '--'+ adminOnly._id.subTopic + ')', count:adminOnly.count,aht:adminOnly.aht});
    							return;
    						}
    						common.mark = 1;
    						delete compassAdminMap[adminOnly._id.contactReason + '(' + adminOnly._id.topic+ '--'+ adminOnly._id.subTopic + ')'];
    						adminOnly.compassAdminCount = common.count;
    						adminOnly.difference = common.aht-adminOnly.aht;
    						adminOnly.compassAdminaht = common.aht;
    						adminOnly._id = adminOnly._id.contactReason + '(' + adminOnly._id.topic+ '--'+ adminOnly._id.subTopic + ')';
    					}); 

				adminVsCompassList = adminOnlyList;
				var leftOutCompassAdmin =[];

				for(var key in compassAdminMap) {
					leftOutCompassAdmin.push({contactReason:key, count:compassAdminMap[key].count,aht:compassAdminMap[key].aht});

				}






				response.writeHead(200,{"content-Type":"application/json"});
				response.write('{"adminVsCompassList":'+JSON.stringify(adminVsCompassList)+ ',"compassAdmin":' + JSON.stringify(leftOutCompassAdmin) + ',"adminOnly":' + JSON.stringify(leftOutAdmin) + '}');
				response.end();
	//			console.log("done");
			});
		});

	});

});

/*

app.post('/insight_skillSet',function(postData,response){
	
	MongoClient.connect("mongodb://localhost:27017/CRT", function(err, db) {
   		if(!err) {
    		console.log("We are connected... Called insight_skillSet"  + new Date());
    	}
     	else {
     		throw err;
      		console.log("We are not connected");
    	}

    	var skillSetListQuery = 'db.TICase_bulk.aggregate([{$project:{skillSets:1,totalTime:1}},{$unwind:"$skillSets"},{$group:{_id:"$skillSets",aht:{$avg:"$totalTime"},count:{$sum:1}}},{$sort:{count:-1}}])';

    	db.eval('function(){ return ' + skillSetListQuery + '.toArray(); }', function(err, skillSetList){

					response.writeHead(200,{"content-Type":"application/json"});
					response.write('{"skillSetList":'+JSON.stringify(skillSetList)+'}');
					response.end();
				});

	});

});

*/





