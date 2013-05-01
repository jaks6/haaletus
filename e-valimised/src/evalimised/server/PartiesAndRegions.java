package evalimised.server;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;

// Plain old Java Object it does not extend as class or implements 
// an interface

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

//Sets the path to base URL + /hello
@Path("/partiesandregions")
public class PartiesAndRegions {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			){

		Gson gson = new Gson();
		/** DB */
		Connection c = null;
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");



			// DROPDOWN LISTIDELE INFO HANKIMISE OSA

			List<String> regionsList = new ArrayList<String>();
			List<String> partiesList = new ArrayList<String>();
			List<List<String>> responseList = new ArrayList<List<String>>();

			ResultSet parties = c.createStatement().executeQuery("Select Partei.Nimetus from Partei");
			ResultSet regions = c.createStatement().executeQuery("Select Piirkond.Nimi from Piirkond");

			while(regions.next()){
				regionsList.add((String) regions.getObject(1));

			}
			while(parties.next()){
				partiesList.add((String) parties.getObject(1));

			}

			responseList.add(regionsList);
			responseList.add(partiesList);
			return gson.toJson(responseList);





		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		return "Error: gson return statement failed to get called in JerseyHello.java";

	}



} 