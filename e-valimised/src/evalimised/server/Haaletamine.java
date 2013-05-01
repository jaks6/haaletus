package evalimised.server;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.cloud.sql.jdbc.Connection;
import com.google.cloud.sql.jdbc.PreparedStatement;
import com.google.cloud.sql.jdbc.Statement;

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
		
		System.out.println("Haaletamine.java "+uID);
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
			System.out.println("Haaletamine.java "+ID.get(0));
			return ID.get(0)+"";
		}
		
	}
	
	@POST
	@Produces("application/plain")
	public String postVote(
			@FormParam("uid") int uID, //omanikID 
			@FormParam("kid") int kID, //uue kandidaatID
			@FormParam("votedFor") int votedForID){  //eelmise h‰‰le ID
		
		ArrayList<Integer> Id_Vote = new ArrayList<Integer>();
		System.out.println("uID="+uID+" kID="+kID+" votedFor="+votedForID);
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			Connection c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			
			//Delete the previous vote from Haal
			String delete = "DELETE FROM Haal WHERE OmanikID="+uID;
			Statement statement = c.createStatement();
			statement.executeUpdate(delete);
			
			//If user has voted for someone, decrease the vote count
			if(votedForID!=0){
				System.out.println("Lasen h‰‰le maha"+votedForID);
				String decreaseVote = "UPDATE Kandidaat SET HaalteArv=HaalteArv-1 WHERE ID="+votedForID;
				statement.executeUpdate(decreaseVote);
			}
			
			//Update the selected candidates vote count
			String increaseVote = "UPDATE Kandidaat SET HaalteArv=HaalteArv+1 WHERE ID="+kID;
			statement.executeUpdate(increaseVote);
			
			//Insert new row to Haal
			String haal ="INSERT INTO Haal (KandidaatID, OmanikID) VALUES(?,?)";
			PreparedStatement stmt = (PreparedStatement) c.prepareStatement(haal);
			stmt.setInt(1, kID); //kandidaat ID
			stmt.setInt(2, uID);  //Omanik ID
			stmt.execute();
			
			c.close();
			stmt.close();
			statement.close();
			
			
		} catch (SQLException e) {
			e.printStackTrace();
			return "Fail";
			
		}
		
		return "Success";
		
	}
}
