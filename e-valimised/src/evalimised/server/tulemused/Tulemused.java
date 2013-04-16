package evalimised.server.tulemused;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;

import evalimised.Kandidaat;

// Plain old Java Object it does not extend as class or implements 
// an interface

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

//Sets the path to base URL + /hello
@Path("/tulemused")
public class Tulemused {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			@QueryParam("party") String party,
			@QueryParam("person") String person,
			@QueryParam("id") String id,
			@QueryParam("region") String region,
			@QueryParam("listingsFlag") int listingsFlag
			){
		//		System.out.println("printing params");
		//		System.out.println(party +  person+ id + region+listingsFlag);

		Gson gson = new Gson();
		/** DB */
		Connection c = null;
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");

			 //saame kıigi antud h‰‰lte summa
			ResultSet votesSumQuery = c.createStatement().executeQuery("SELECT SUM(HaalteArv) FROM Kandidaat");
			votesSumQuery.next();
			int totalVotes = votesSumQuery.getInt("SUM(HaalteArv)");
			
			
			ResultSet votesByPartiesQuery = c.createStatement().executeQuery("SELECT " + 
					"SUM(HaalteArv), " + 
					"Partei.Nimetus, " + 
					"Partei.ID " + 
					"FROM Kandidaat, Partei " + 
					"WHERE ParteiID=Partei.ID " + 
					"Group by ParteiID");
			
			List<List<Object>> resultList = new ArrayList<List<Object>>();
			
			
			while ( votesByPartiesQuery.next()){
				
				List<Object> singlePartyList = new ArrayList<Object>();
				singlePartyList.add(votesByPartiesQuery.getString("Nimetus"));
				singlePartyList.add(votesByPartiesQuery.getInt("SUM(HaalteArv)"));
				
				resultList.add(singlePartyList);
				


				
			}
			
			

		
			return gson.toJson(resultList);




		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		return "Error: gson return statement failed to get called in Tulemused.java";

	}



} 