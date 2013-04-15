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

import evalimised.Kandidaat;


@Path("/candidate")
public class Candidate {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			@QueryParam("term") String term,
			@QueryParam("kandidaat") String id
			){

		/** DB */
		Connection c = null;
		Gson gson = new Gson();

		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
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
					"Kandidaat.PiirkondID = Piirkond.ID && " +
					"Kandidaat.ID = "  + id + "");

			ResultSet rs2 = c.createStatement().executeQuery(selectStatement);
			while (rs2.next()){
				Kandidaat currentCandidate = new Kandidaat(
						rs2.getString("Nimi"),
						rs2.getString("Partei"),
						rs2.getInt("ID"),
						rs2.getString("Piirkond"),
						rs2.getInt("HaalteArv"))
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