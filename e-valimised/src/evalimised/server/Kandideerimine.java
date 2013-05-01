package evalimised.server;


import java.sql.DriverManager;
import java.sql.SQLException;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.cloud.sql.jdbc.Connection;
import com.google.cloud.sql.jdbc.PreparedStatement;



@Path("/Kandideerimine")
public class Kandideerimine{
	@POST
	@Produces("application/plain")
	public String updateMessage(@FormParam("uID") int id,
								@FormParam("party") int party_id,
								@FormParam("region") int region_id){
		
		System.out.println(id+" "+party_id+" "+region_id);
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			Connection c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");


			String statement ="INSERT INTO Kandidaat (IsikID, ParteiID,	PiirkondID, HaalteArv) VALUES(?,?,?,?)";
			PreparedStatement stmt = (PreparedStatement) c.prepareStatement(statement);
			stmt.setInt(1, id); // Isik.id
			stmt.setInt(2, party_id); // Partei.ID
			stmt.setInt(3, region_id); //Piirkond.ID
			stmt.setInt(4, 0);			//H‰‰lte arv = 0
			
			stmt.execute();
			c.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return "Success";
	}
}

