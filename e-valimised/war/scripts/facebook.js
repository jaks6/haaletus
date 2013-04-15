
function connectFB(){
	
	(function(d){
	     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all.js";
	     ref.parentNode.insertBefore(js, ref);
	   }(document));
	
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '546249522085914', // App ID
	      channelUrl : 'e-valimised.appspot.com', // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true  // parse XFBML
	    });
	
	    FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
				  console.log("Connected to FB");
				  getData(function (){
					 user();
				  });
			  } else if (response.status === 'not_authorized') {
				  console.log("not authorized");	
				  login();
			  } else {
				  console.log("not connected");
				  login();
			  }
			 });
	    
	   
	    
	  };
	  
	 
	
}
  

  function login() {
	    FB.login(function(response) {
	        if (response.authResponse) {
	        	 getData(function (){
					 user();
				  });
	        } else {
	            window.location = "/";
	        }
	    }, {scope: 'email,user_likes,user_birthday'});
	}
  
  function getData(callback) {
	    FB.api('/me', function(response) {
	    	name = response.name;
	    	email = response.email;
	    	bday = response.birthday;
	    	var data = name+","+email+","+bday;
	    	document.cookie = "data="+data+"; expires=0; path=/";
	    	document.cookie = "page=valimised; expires=0; path=/";
	    	console.log("Making cookies");
	    	callback.call();
	    });
  }