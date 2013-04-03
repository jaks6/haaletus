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
@Path("/hello")
public class JerseyHello {

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



			if (listingsFlag!=1){
				String selectStatement = (
						"Select \r\n" + 
								"CONCAT(Eesnimi, ' ', Perenimi) as Nimi ,\r\n" + 
								"Kandidaat.ID,\r\n" + 
								"Partei.Nimetus as Partei,\r\n" + 
								"Piirkond.Nimi as Piirkond,\r\n" + 
								"HaalteArv\r\n" + 
								"from Isik, Kandidaat, Partei, Piirkond\r\n" + 
								"\r\n" + 
								"\r\n" + 
								"WHERE \r\n" + 
								"Kandidaat.IsikID=Isik.ID && \r\n" + 
								"ParteiID=Partei.ID &&\r\n" + 
						"Kandidaat.PiirkondID = Piirkond.ID  \r\n");

				//kitsendame päringut lisades WHERE osa lõppu tingimusi
				selectStatement=selectStatement.concat(
						"&& Partei.Nimetus LIKE '%"+ party+"%' \n" +
								"&& CONCAT(Eesnimi, ' ', Perenimi) LIKE '%"+ person +"%' \n" +
								"&& Kandidaat.ID LIKE '%"+ id +"%' \n" +
								"&& Piirkond.Nimi LIKE '%"+ region +"%' \n" );



				ResultSet rs2 = c.createStatement().executeQuery(selectStatement);
				//Create a list of 'candidate' java objects from the executed queries result set
				List<Kandidaat> candidates = new ArrayList<Kandidaat>();
				while (rs2.next()){
					candidates.add(new Kandidaat(
							rs2.getString("Nimi"),
							rs2.getString("Partei"),
							rs2.getInt("ID"),
							rs2.getString("Piirkond"),
							rs2.getInt("HaalteArv"))
							);
				}
				return gson.toJson(candidates);
				
				
				
			} else { // DROPDOWN LISTIDELE INFO HANKIMISE OSA

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
			}


			

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