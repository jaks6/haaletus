package evalimised.server;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;

import evalimised.Kandidaat;


@Path("/candidate")
public class Candidate {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			@QueryParam("term") String term,
			@QueryParam("kandidaat") Integer id
			){

		/** DB */
		Connection c = null;
		Gson gson = new Gson();
		
		try {
			System.out.println("canddiate gett");
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			
			PreparedStatement prepStatement = c.prepareStatement(
					"Select  " + 
							"CONCAT(Eesnimi, ' ', Perenimi) as Nimi , " + 
							"Kandidaat.ID, " + 
							"Partei.Nimetus as Partei, " + 
							"Piirkond.Nimi as Piirkond, " + 
							"HaalteArv " + 
							"from Isik, Kandidaat, Partei, Piirkond " + 
							" " + 
							"WHERE  " + 
							"Kandidaat.IsikID=Isik.ID && " + 
							"ParteiID=Partei.ID && " + 
					"Kandidaat.PiirkondID = Piirkond.ID && " +
					"Kandidaat.ID = ? ");
			prepStatement.setInt(1, id);
			

			ResultSet rs = prepStatement.executeQuery();
			while (rs.next()){
				Kandidaat currentCandidate = new Kandidaat(
						rs.getString("Nimi"),
						rs.getString("Partei"),
						rs.getInt("ID"),
						rs.getString("Piirkond"),
						rs.getInt("HaalteArv"))
						;
				System.out.println("jõuan siia"+currentCandidate);
				return gson.toJson(currentCandidate);
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
		return "Error: gson return statement failed to get called in Autocomplete.java";

	}
} 