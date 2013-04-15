package evalimised.server;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;


@Path("/autocomplete")
public class Autocomplete {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			@QueryParam("term") String term
			){

		/** DB */
		System.out.println(term);
		Connection c = null;
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			String selectStatement = "SELECT CONCAT(Eesnimi, ' ', Perenimi) as Nimi " +
					"from Isik WHERE Isik.Perenimi like '%" + term +"%'";

			System.out.println(selectStatement);
			ResultSet rs2 = c.createStatement().executeQuery(selectStatement);

			ArrayList<String> namesList = new ArrayList<String>();
			while (rs2.next()){
				namesList.add(rs2.getString("Nimi"));
			}

			System.out.println(namesList);
			/** GSON*/
			Gson gson = new Gson();
			return gson.toJson(namesList);

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		return "Error: gson return statement failed to get called in Autocomplete.java";

	}
} 