package evalimised;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** DB stuff */
import com.google.appengine.api.rdbms.AppEngineDriver;
import java.sql.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//comment to test commit
public class HelloWorld extends HttpServlet {
	
	@Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
		
		
        resp.setContentType("text/plain");
        resp.getWriter().println("Hello, world -----!");
    
	
	
	
	
	
	
	
	
	/** DB */
    PrintWriter out = resp.getWriter();
    Connection c = null;
      try {
        DriverManager.registerDriver(new AppEngineDriver());
        c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
     
        ResultSet rs = c.createStatement().executeQuery("SELECT Eesnimi, Perenimi, ID FROM Isik");

        while (rs.next()){
            String eesnimi = rs.getString("Eesnimi");
            String perenimi = rs.getString("Perenimi");
            int id = rs.getInt("ID");
            
            resp.getWriter().println(eesnimi + " " + perenimi + " " +id);
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

	
	
	
	
	
	
	
	
	
	
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    
    
	public void doPost(HttpServletRequest req, HttpServletResponse res)
		      throws ServletException, IOException {
		    doGet(req, res);
		  }
}