package evalimised;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloWorld extends HttpServlet {
	
	@Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
		
		
        resp.setContentType("text/plain");
        resp.getWriter().println("Hello, world -----!");
    }
    
    
	public void doPost(HttpServletRequest req, HttpServletResponse res)
		      throws ServletException, IOException {
		    doGet(req, res);
		  }
}