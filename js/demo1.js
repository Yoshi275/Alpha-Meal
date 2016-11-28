function joinem(data) {
  data.join();
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      if(vars[key]){
      if(vars[key] instanceof Array){
        vars[key].push(value);
      }else{
        vars[key] = [vars[key], value];
      }
      }else{
        vars[key] = value;
      }
      });
  return vars;
  }

var distance = getUrlVars()["distance"];
var distance = distance * 1000;
var cuisine = getUrlVars()["cuisine"];
var cuisine = cuisine.join();
var location1 = getUrlVars()["location"];

var info;
var res_no;
    //clear the results
      $("#results").empty();

      var auth = {
        //
        // Update with your auth tokens.
        //
        consumerKey : "BVqw4tz8MZxa0Xf-q9Mehw",
        consumerSecret : "MgCMR8S6q3LVBp_c6SKFYzekGy4",
        accessToken : "28ezyOcLm4xDIjnobx7dn-QMTVS_c-0z",
        // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
        // You wouldn't actually want to expose your access token secret like this in a real application.
        accessTokenSecret : "CY29gXAsiSDqJTFENUolVRihU8M",
        serviceProvider : {
            signatureMethod : "HMAC-SHA1"
        }
    };


    /* Checklist: term(shop name) id=term;
    location(location) id=postcode;
    category_filter(cuisine), id=cuisine;

    */
    var term = ""; //shop name

    console.log(location1);
    console.log(distance); //logs distance
    console.log(cuisine);


    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };
    parameters = [];
    parameters.push(['term', term]);
    parameters.push(['location', location1]);
    parameters.push(['category_filter', cuisine]);
    parameters.push(['radius_filter', distance]);
    parameters.push(['callback', 'cb']);
    parameters.push(['cc', 'SG']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

console.log(parameters)

    var message = {
        'action' : 'http://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    console.log('parameterMap is',parameterMap);

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'success' : function(data, textStats, XMLHttpRequest) {
            console.log('data is', data);
            info = data;
            res_no = 0
            while (info.businesses[res_no].is_closed){res_no += 1} //make sure it is open
            //display results
            var restaurantName = info.businesses[res_no].name;
            console.log(restaurantName);
            $('#title').html(restaurantName);
            var restaurantLocation = info.businesses[res_no].location.display_address;
            console.log(restaurantLocation);
            //NOT WORKING because array not joined
            var restaurantLocation = "14 Scotts Road, #04-28, Far East Plaza, Singapore 228213"
            $('#restaurantlocation').html(restaurantLocation);
            var restaurantCuisine = info.businesses[res_no].categories;
            console.log(restaurantCuisine);
            //NOT WORKING because array not joined
            var restaurantCuisine = "Sushi, Japanese Restaurants";
            $('#restaurantcuisine').html(restaurantCuisine);
            var restaurantPhone = info.businesses[res_no].display_phone;
            console.log(restaurantPhone);
            $('#restaurantphone').html(restaurantPhone);
            var restaurantRatingsImage = info.businesses[res_no].rating_img_url;
            console.log("Ratings Ready");
            var restaurantReservation = info.businesses[res_no].reservation_url;
            console.log("Reservation Ready");
            var restaurantImage = info.businesses[res_no].img_url;
            console.log("Image Ready");

            $("#results").append(
              info.businesses[res_no].name + '<br>' + info.businesses[res_no].location.display_address + "<br>" +
              info.businesses[res_no].location.postal_code + '<br>'+
              '<img src='+info.businesses[res_no].image_url+'>'+ '<br>' +
              '<img src='+info.businesses[res_no].rating_img_url+'>'+'<br>');
            //$("#results").append(info.businesses[res_no].name + "\n" + info.businesses[res_no].location.display_address);


            //end of results
            //
            //appending buttons
            var button_dunlike = $('<button onclick="dunlike()">Nope, not this one!</button>');
    button_dunlike.appendTo($("#results"));
    var button_like = $('<button onclick="like()">Awesome I love this lets go!</button>');
    button_like.appendTo($("#results"));
    console.log('ajax done')



        }
    });
function dunlike() {
console.log("dunlike");
res_no += 1;
while (info.businesses[res_no].is_closed){
              res_no += 1
            } //make sure it is open
console.log("current result number",res_no);
$("#results").empty();


};//end of dunlike
function like() {

};//end of like


//display results
            $("#results").append(

              info.businesses[res_no].name + '<br>' + info.businesses[res_no].location.display_address + "<br>" +
              '<img src='+info.businesses[res_no].image_url+'>'+ '<br>' +
              '<img src='+info.businesses[res_no].rating_img_url+'>'+'<br>');

//end of results
var button_dunlike = $('<br /><button onclick="dunlike()">Nope, not this one!</button>');
button_dunlike.appendTo($("#results"));
var button_like = $('<button onclick="like()">Awesome I love this lets go!</button>');
button_like.appendTo($("#results"));
