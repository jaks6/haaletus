package evalimised;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;
/** DB stuff */


public class Kandidaadid_Data extends HttpServlet {
	
	@Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
		
		
		//Hangime kandidaatide otsingu lahtrite väljad, nende sisud.
        System.out.println("getattributenames: ");
        Enumeration<String> paramNames =req.getParameterNames();
        		while(paramNames.hasMoreElements()) {
        			String paramName = (String)paramNames.nextElement();
        			System.out.println(paramName);
        			System.out.println(req.getParameter(paramName));
        		}
        System.out.println();
        
        // queryString on kujul party=&region=&person=Jakob&id=, ilmselt läheb bookmarkable URL tarvis vaja
        System.out.println("getQueryString:   " + req.getQueryString());
    
        
	
	
	/** DB */
    Connection c = null;
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
        		"Kandidaat.PiirkondID = Piirkond.ID  \r\n");
        
        //kitsendame päringut lisades WHERE osa lõppu tingimusi
        selectStatement=selectStatement.concat(
        		"&& Partei.Nimetus LIKE '%"+ req.getParameter("party")+"%' \n" +
        		"&& CONCAT(Eesnimi, ' ', Perenimi) LIKE '%"+ req.getParameter("person")+"%' \n" +
        		"&& Kandidaat.ID LIKE '%"+ req.getParameter("id")+"%' \n" +
        		"&& Piirkond.Nimi LIKE '%"+ req.getParameter("region")+"%' \n" );
        

        		
        ResultSet rs2 = c.createStatement().executeQuery(selectStatement);
        //Create a list of 'candidate' java objects from the executed queries result set
        List<Kandidaat> candidates = new ArrayList<Kandidaat>();
        while (rs2.next()){
        	candidates.add(new Kandidaat(
        			rs2.getString("Nimi"),
        			rs2.getString("Partei"),
        			rs2.getInt("ID"),
        			rs2.getString("Piirkond"),
        			rs2.getInt("HaalteArv"))
        	);
        }
        
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
      
//        for (Kandidaat i: candidates){
//        	System.out.println(i);
//        }
        
        //EMULATE LONG QUERY TIME
//        try {
//			Thread.sleep(1000);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//        // END OF EMULATION
        /** GSON*/
        Gson gson = new Gson();
        out.print(gson.toJson(candidates));
     
      
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