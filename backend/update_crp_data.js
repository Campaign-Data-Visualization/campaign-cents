"use strict";

var Q  = require('q'),
    config = require('config'),
    parseString = require('xml2js').parseString,
    db = require('../server/database.js'),
    exec = require('child_process').exec;

var datadir = "backend/data/";
 
var files = ['IFG_PAC2Cand_Data', 'IFG_IndivData', 'IFG_Outside_Data', 'IFG_PAC2Cmte_Data', 'IFG_Outside_Cand_Expends', 'IFG_527_Data'];

var convertFiles = function() {
  console.log('<=====Updating Files');
  var d = Q.defer();
  var promises = [];  
  files.forEach(function(file) { 
    var deferred = Q.defer();
    console.log('convert '+file+'.xls to csv');
    exec('unoconv -v -f csv '+datadir+file+'.xlsx', function() {

      db.doQuery("drop table if exists "+file).then(function() { 
        console.log('import csv for '+file);
        exec('csvsql '+datadir+file+'.csv --db mysql://root:@/kochtracker --insert < /dev/tty', function(res) { 
          //console.log(res)
          deferred.resolve();
        }, logError);
      });
    });
    promises.push(deferred.promise);
  });
  Q.all(promises).then(function() {
    console.log('<=====Files Updated');
    d.resolve();
  });
  return d.promise;
}

var updateContribs = function() {
  var deferred = Q.defer();
  console.log('<=====Updating Contribs');

  db.doQuery("delete from koch_contribs").then(function() {

    db.doQuery("insert into koch_contribs select cid, ultorg, pacid, date, amount, '', 'pac_to_can', fecrecno, 'f', cycle, null from IFG_PAC2Cand_Data join candidates on cid = crpid").then(function() {
      db.doQuery("insert into koch_contribs select recipid, if(ultorg != '', ultorg, if(orgname != '', orgname, fecoccemp)), contribid, date, amount, '', 'individual', fectransid, 'f', cycle, null from IFG_IndivData join candidates on recipid = crpid").then(function() {
        db.doQuery("insert into koch_contribs select cid, if(ultorg != '', ultorg, pacshort), '', date, amount, '', 'outside_cand', id, if(crpsuppopp = 'S', 'f', 'a'), cycle, null from IFG_Outside_Cand_Expends join candidates on cid = crpid").then(function() {
          db.doQuery("insert into koch_contribs select b.crpid, if(ultorg != '', ultorg, a.pacshort), filerid, date, amount, '', 'pac_to_com', fecrecno, 'f', cycle, null from IFG_PAC2Cmte_Data a join leadership_pacs b on recipid = cmteid and b.crpid != ''").then(function() {
            db.doQuery("update koch_contribs a join koch_orgs b on donor_name = org_name set a.koch_tier = b.tier").then(function() {
              db.doQuery("update koch_contribs a join candidates b using (crpid) set a.voteSmartId = b.voteSmartId").then(function() {
                console.log('<=====Contribs Updated');
                deferred.resolve();
              }, logError);
            }, logError);
          }, logError);
        }, logError);
      }, logError);
    }, logError);
  });
  return deferred.promise;
};

var updateCandidateAmounts = function() {
  var deferred = Q.defer();
  console.log('<=====Updating CandidateAmounts');

  db.doQuery("update candidates set since2000contrib = 0, 2014contrib = 0").then(function() {
    db.doQuery("update candidates join (select sum(amount) as amount, crpid from koch_contribs where for_against = 'f' and cycle = 2014 group by crpid) b using(crpid) set 2014contrib = amount").then(function() { 
      db.doQuery("update candidates join (select sum(amount) as amount, crpid from koch_contribs where for_against = 'f' group by crpid) b using(crpid) set since2000contrib = amount").then(function() {
        console.log('<=====CandidateAmounts Updated');
        deferred.resolve();   
      });
    });
  });
  return deferred.promise;
};

var logError = function(err) { 
  console.log(err);
}
/* I'm giving up on updating the fusion tables - too much of a headache, and it turns out there's no way to automate the geocode. I'm moving to just pulling the markers from our own table
var updateFusionTables = function() {
  console.log('<=====Updating Fusion Tables');

  var deferred = Q.defer();
  var request = require('google-oauth-jwt').requestWithJWT();
  var jwt = {
    email: '82901461922-ei0ksnm6uhi3crrn8co79ec8orh09d3k@developer.gserviceaccount.com',
    keyFile: '/home/dameat/public_html/campaign-cents/keyfile.pem',
    scopes: ['https://www.googleapis.com/auth/fusiontables']
  };
  request({
      url: "https://www.googleapis.com/fusiontables/v1/query?sql=delete from 1DtIDkVklWQh23BbwzRxuVh2r95ZsfIFQv96Pv0PW where ROWID = 1",
      jwt: jwt,
      method: 'post',
      //body: "{sql: 'delete from 1DtIDkVklWQh23BbwzRxuVh2r95ZsfIFQv96Pv0PW'}"
    }, function(err, res, body) {
      console.log('rows deleted')
      console.log(err);
      console.log(JSON.parse(body)); 
      //var promises = [];
      var query = "select voteSmartId as 'Vote Smart ID', firstName as 'First Name', lastName as 'Last Name', firstNameLastName as 'FirstName LastName', concat(lastName, ', ', firstName) as 'LastName, FirstName', photoURL as 'Photo URL', concat(address, ', ', address_city, ', ', address_state, ', ', address_zip) as 'Full Address', address Street, address_city City, address_state State, address_zip Zip, 2014contrib as '2014 Contribution Amount', since2000contrib as 'Since 2000 Contribution Amount'  FROM candidates where 2014contrib != 0";
      db.doQuery(query).then(function(rows) {
        var stringify = require('csv-stringify');
        stringify(rows, function(err, data) {
          request({
              url: "https://www.googleapis.com/upload/fusiontables/v1/tables/1DtIDkVklWQh23BbwzRxuVh2r95ZsfIFQv96Pv0PW/import",
              jwt: jwt,
              method: 'post',
              headers: {'Content-Type': 'application/octet-stream'},
              body: data
            }, function(err, res, body) {
              if (err) {
                console.log(err);
                console.log(res);
                console.log(body);
              } else {
                console.log(JSON.parse(body)); 
              }    
              console.log('<=====Fusion Tables Updated');
              deferred.resolve();
            }
          )
        });
      });
  });
  
  return deferred.promise;
};
*/

convertFiles().then(function() {
  updateContribs().then(function(){
    updateCandidateAmounts().then(function(){
      //updateFusionTables().then(function(){
        db.exit();
      //})
    })
  })
});



/*
 * This is all crazy cleanup stuff to try and match the affiliate names out of the crp committees table with actual crp ids - they sure didn't do us any favors.
 *
//create table leadership_pacs select cmteid, pacshort, affiliate, '' as lastName, '' as firstName, '' as state, '' as crpid  from committees where primcode like 'j2%' group by affiliate
//insert into leadership_pacs select cmteid, pacshort, affiliate, '' as lastName, '' as firstName, '' as state, '' as crpid  from committees where primcode like 'j2%' group by affiliate
db.doQuery("select cmteid, affiliate from leadership_pacs where affiliate != ''").then(function(data) { 
  var firsts = [];
  data.forEach(function(row) { 
    var info = {
      firstName: '',
      lastName: '',
      state:''
    };
    var name = row.affiliate.replace(/[js]r./i, '').replace(/ex-[^ ]+/i, '').replace(/attorney general|Gov.|ex. Rep./, '').trim();
    console.log(name);
    var state_info = name.match(/(\((.)-([^\)]+)\))/);
    if (state_info) { 
      var states = { "Ill":'IL', "Calif":'CA', "Fla": 'FL', "Wash": 'WA', "Neb": 'NE', "Minn": 'MN', "Miss": 'MS', "Mich": 'MI', "Ohio": 'OH', "Texas": 'TX', "Tex": 'TX', "Tenn": 'TN', "Iowa": 'IA', "Del": 'DE', "Conn": 'CT', "Colo": 'CO', "Okla": 'OK', "Ind": 'IN', "Hawaii": 'HI', "Wis": 'WI', "Ariz": 'AZ', "Ore": 'OR', "Nev": 'NV', "Mont": 'MT', "Alaska": 'AK', "Mass": 'MA', "Idaho": 'ID', "Ark": 'AR', "Penn": 'PA', "Utah": 'UT', "WVa": 'WV', "Ala": 'AL', "Kan": 'KS', "Wyo": 'WY', "Maine": 'ME' }
      //party = state_info[2];
      info.state = state_info[3].length > 2 ? states[state_info[3]] : state_info[3].toUpperCase();
    }
    name = name.replace(/\(.*\)/, '').trim();
    //console.log(state_info);
    var parts = name.split(' ');
    info.firstName = parts[0];
    info.lastName = parts.reverse()[0];
    console.log(info);
    db.doQuery("select crpid from candidates where lastName=? and firstName=? and state=?", [info.lastName, info.firstName, info.state]).then(function(res) { 
      if (res.length == 1 && res[0].crpid) { 
        info.crpid = res[0].crpid;
      }
      console.log(info);
      db.doQuery("update leadership_pacs set ? where cmteid = ?", [info, row.cmteid]);
    });
    //update leadership_pacs a join (SELECT a.cmteid, b.crpid, lastname, firstNameLastName, Affiliate FROM leadership_pacs a join candidates b using(lastname, state) where a.crpid = '' group by a.cmteid having count(*) = 1) b using(cmteid) set a.crpid = b.crpid where a.crpid = ''
    //promises.push(db.doQuery("update leadership_pacs set ? where cmteid = ?", [info, row.cmteid]));
    //update leadership_pacs set crpid= 'N00026686' where cmteid = 'C00494047'
    //update leadership_pacs set crpid= 'N00008028' where cmteid = 'C00345702'
    //update leadership_pacs set crpid= 'N00032457' where cmteid = 'C00500793'
    //firsts.push(parts[0]);
  });
  //console.log(firsts.sort());
});
*/
