package evalimised.server;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;

// Plain old Java Object it does not extend as class or implements 
// an interface

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

//Sets the path to base URL + /hello
@Path("/TestCleanup")
public class TestCleanup {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String doCleanup(@QueryParam("magicword") String magicword
			){


		//HASHING BECAUSE IM FUCKING BORED.

		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		}
		md.update(magicword.getBytes());

		byte byteData[] = md.digest();

		//convert the byte to hex format
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < byteData.length; i++) {
			sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
		}

		if (sb.toString().equals("e8f78695d10714dae6c3c7935725ef24")){
			Connection c = null;
			try {
				DriverManager.registerDriver(new AppEngineDriver());
				c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");

				String deleteString =  "DELETE FROM Isik WHERE Email = 'orjandus@gmail.com' OR Email = 'testerino@hot.ee'";
				c.createStatement().execute(deleteString);




				return "my work is done.";



			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				if (c != null) 
					try {
						c.close();
					} catch (SQLException ignore) {
					}
			}

		}
		return "i did no work really.";
	}

}

