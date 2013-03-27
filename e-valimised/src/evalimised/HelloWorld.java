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
//second comment to test pulling via desktop program

//third commenet to test conflict with desktop program

//this comment was written after 1. and 2. after 3rd comment was commited but 
//without pulling 3rd comment

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
        ResultSet rs2 = c.createStatement().executeQuery(
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
        		"Kandidaat.PiirkondID = Piirkond.ID"
        		);
        
        while (rs.next()){
            String eesnimi = rs.getString("Eesnimi");
            String perenimi = rs.getString("Perenimi");
            int id = rs.getInt("ID");
            
            resp.getWriter().println(eesnimi + " " + perenimi + " " +id);
        }
        while (rs2.next()){
            String nimi = rs2.getString("Nimi");
            String partei = rs2.getString("Partei");
            int id = rs2.getInt("ID");
            String region = rs2.getString("Piirkond");
            
            resp.getWriter().println(nimi+ " "+ partei+ " "+ id+ " "+ region);
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
