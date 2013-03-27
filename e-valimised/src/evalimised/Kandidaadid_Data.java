package evalimised;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;
import com.google.gwt.user.client.rpc.core.java.util.Collections;
/** DB stuff */


public class Kandidaadid_Data extends HttpServlet {
	
	@Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
		
		
        resp.setContentType("text/plain");
        resp.getWriter().println("---- greetings from KANDIDAADID_DATA servlet -----");
        resp.getWriter().print(req);
        
        System.out.println("getattributenames: ");
        Enumeration<String> paramNames =req.getParameterNames();
        		while(paramNames.hasMoreElements()) {
        			String paramName = (String)paramNames.nextElement();
        			System.out.println(paramName);
        		}
        System.out.println();
        System.out.println("getQueryString:   " + req.getQueryString());
    
	
	
	
	
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
        Gson gson = new Gson();
        ArrayList<Kandidaat> candidates = new ArrayList<Kandidaat>();
//        Collection<Kandidaat> candidates = Collections.EmptySet_CustomFieldSerializer;
        
        while (rs2.next()){
        	candidates.add(new Kandidaat(
        			rs2.getString("Nimi"),
        			rs2.getString("Partei"),
        			rs2.getInt("ID"),
        			rs2.getString("Piirkond"))
        	);
        }
        for (Kandidaat i: candidates){
        	System.out.println(i);
        }
        
        String json = gson.toJson(candidates);
        System.out.println("--");
        System.out.println(json);
        
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
	
}