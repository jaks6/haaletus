package evalimised.server;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.cloud.sql.jdbc.Connection;
import com.google.cloud.sql.jdbc.PreparedStatement;

@Path("/haaletamine")
public class Haaletamine {
	private static java.sql.Timestamp getCurrentTimeStamp() {
		 
		java.util.Date today = new java.util.Date();
		return new java.sql.Timestamp(today.getTime());
	 
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getVote(@QueryParam("id") String uID){
		Connection c = null;
		ArrayList<Integer> ID = new ArrayList<Integer>();
		
		
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			String selectCandidateID = "SELECT KandidaatID from Haal,Isik WHERE Haal.OmanikID=Isik.ID && Isik.ID="+"\""+uID+"\"";
			ResultSet rs = c.createStatement().executeQuery(selectCandidateID);
			
			while(rs.next()){
				ID.add(rs.getInt(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		
		
		if(ID.size()==0){ //ID=X ei ole andnud h‰‰lt
			return "NoVote";
		}
		else{			//ID=X andis h‰‰le id.get(0) vanale
			return ID.get(0)+"";
		}
		
	}
	
	@POST
	@Produces("application/plain")
	public String postVote(
			@FormParam("uid") int uID, //omanikID 
			@FormParam("kid") int kID){ //kandidaatID
		
		ArrayList<Integer> Id_Vote = new ArrayList<Integer>();
		try {
			
			System.out.println("uID="+uID+" kID="+kID);
			DriverManager.registerDriver(new AppEngineDriver());
			Connection c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			
			
			String getMaxID_Votes = "SELECT MAX(Haal.ID)+1,HaalteArv FROM Kandidaat,Haal WHERE Kandidaat.IsikID="+kID;
			//saan H‰‰le tabeli max ID+1 ning Kandidaadi tabelist kID'ga kandidaadi h‰‰tle arvu
			
			ResultSet rs = c.createStatement().executeQuery(getMaxID_Votes);
//			
			while(rs.next()){
				Id_Vote.add(rs.getInt(1));
				Id_Vote.add(rs.getInt(2));
			}
			
			
			
			// !TODO:
			// IF EXISTS :  HAAL , selline et OmanikID = uid THEN:
			// V’TA SELLE HƒƒLe SaajaID, lahuta sellise ID-ga kandidaadilt 1 h‰‰l maha.
			// N‹‹D MUUTA Selle Haale rea kid praegu h‰‰lt saavaks kid-ks
			// LIIDA TALLE Haal +1
			
			
			
			String haal ="INSERT INTO Haal (KandidaatID, OmanikID) VALUES(?,?)";
			PreparedStatement stmt = (PreparedStatement) c.prepareStatement(haal);
//			stmt.setInt(1,Id_Vote.get(0));    //Max ID+1
			stmt.setInt(1, kID); //kandidaat ID
			stmt.setInt(2, uID);  //Omanik ID
//			stmthaal.setTimestamp(4, getCurrentTimeStamp()); 
			stmt.execute();
			
			String kandidaat = "UPDATE Kandidaat SET HaalteArv=HaalteArv+1 WHERE ID="+kID;
			PreparedStatement stmt_kandidaat = (PreparedStatement) c.prepareStatement(kandidaat);
			stmt_kandidaat.execute(); 
			
		} catch (SQLException e) {
			e.printStackTrace();
			return "Fail";
			
		}
		
		return "Success";
		
	}
}
