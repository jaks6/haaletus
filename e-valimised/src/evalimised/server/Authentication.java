package evalimised.server;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.cloud.sql.jdbc.Connection;
import com.sun.xml.internal.bind.v2.model.core.ID;

@Path("/authenticate")
public class Authentication {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String authenticate(){
		
		String fname="Mõnus";
		String lname="Mees";
		
		Connection c = null;
		ArrayList<Integer> ID = new ArrayList<Integer>();
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = (Connection) DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			String selectUserID = "SELECT ID FROM Isik WHERE Isik.Eesnimi="+"\""+fname+"\""+"&& Isik.Perenimi="+"\""+lname+"\"";
			ResultSet rs = c.createStatement().executeQuery(selectUserID);
			
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
		if(ID.size()==0){
			return "Fail";
		}
		else{
			return ID.get(0)+"";
		}
		
		
	}
}
