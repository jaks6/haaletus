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

@Path("/jerseyshore")
public class JerseyShore {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String sayJSONHello(
			@QueryParam("party") String party,
			@QueryParam("person") String person,
			@QueryParam("id") String id,
			@QueryParam("region") String region
			){

		/** DB */
		Connection c = null;
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			String selectStatement = ("Select " +
					"CONCAT(Eesnimi, ' ', Perenimi) as Nimi ," +
					"HaalteArv from Isik, Kandidaat " +
					"WHERE Kandidaat.IsikID=Isik.ID " +
					"ORDER BY 2 DESC LIMIT 5");
			
			


			ResultSet rs2 = c.createStatement().executeQuery(selectStatement);
			//Create a list of 'candidate' java objects from the executed queries result set
			List<Kandidaat> candidates = new ArrayList<Kandidaat>();
			while (rs2.next()){
				candidates.add(new Kandidaat(
						rs2.getString("Nimi"),
						rs2.getInt("HaalteArv"))
						);
			}
		


		/** GSON*/
        Gson gson = new Gson();
        return gson.toJson(candidates);
        
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		return "Error: gson return statement failed to get called in JerseyShore.java";
		
	}

} 