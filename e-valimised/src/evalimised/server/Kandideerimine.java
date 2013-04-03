package evalimised.server;


import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import com.google.gwt.user.client.rpc.core.java.util.Collections;
import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.cloud.sql.jdbc.Connection;
import com.google.cloud.sql.jdbc.PreparedStatement;



@Path("/Kandideerimine")
public class Kandideerimine{
	@POST
	@Produces("application/plain")
	public String updateMessage(@FormParam ("fname") String fname, 
								@FormParam ("lname") String lname,
								@FormParam ("email") String email,
								@FormParam ("bdate") String bdate,
								@FormParam ("party") String party,
								@FormParam ("region") String region){
		
		
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			Connection c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			
			
			System.out.println("partyparam=" + party +  "  regionparam="+region);
			ResultSet partyIDFromField= c.createStatement().executeQuery("SELECT ID FROM Partei" +
					" WHERE Nimetus = '"+ party +"'");
			partyIDFromField.next();
			int partyID = partyIDFromField.getInt(1);
			
			
			ResultSet regionIDFromField= c.createStatement().executeQuery("SELECT ID FROM Piirkond" +
					" WHERE Nimi = '"+ region +"'");
			regionIDFromField.next();
			int regionID = regionIDFromField.getInt(1);
			
			System.out.println("partyID="+ partyID);
			
			
			ResultSet maxId= c.createStatement().executeQuery("SELECT MAX(ID) FROM Isik");
			maxId.next();
			
			String statement_isik ="INSERT INTO Isik VALUES(?,?,?,?,?)";
			PreparedStatement stmt_isik = (PreparedStatement) c.prepareStatement(statement_isik);
			stmt_isik.setInt(1, maxId.getInt(1)+1);
			stmt_isik.setString(2, fname);
			stmt_isik.setString(3, lname); 
			stmt_isik.setString(4, email); 
			stmt_isik.setString(5, bdate);
			stmt_isik.execute();
			
			//V’TAME SISESTATUD ID!
			ResultSet insertedVals = (stmt_isik.getGeneratedKeys());
			insertedVals.next();
			int insertedID = insertedVals.getInt(1);
			System.out.println("inserted ID= "+ insertedID);
		
			
			
			String statement ="INSERT INTO Kandidaat (IsikID, ParteiID,	PiirkondID, HaalteArv) VALUES(?,?,?,?)";
			PreparedStatement stmt = (PreparedStatement) c.prepareStatement(statement);
			stmt.setInt(1, insertedID); // Isik.id
			stmt.setInt(2, partyID); // Partei.ID
			stmt.setInt(3, regionID); //Piirkond.ID
			stmt.setInt(4, 0);			//H‰‰lte arv = 0
			
			stmt.execute();
			c.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return "Success";
	}
}

