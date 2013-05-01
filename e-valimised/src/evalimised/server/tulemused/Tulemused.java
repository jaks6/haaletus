package evalimised.server.tulemused;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.rdbms.AppEngineDriver;
import com.google.gson.Gson;



//Sets the path to base URL + /hello
@Path("/tulemused")
public class Tulemused {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getKandidaadid(
			@QueryParam("party") String party,
			@QueryParam("person") String person,
			@QueryParam("id") String id,
			@QueryParam("region") String region,
			@QueryParam("listingsFlag") int listingsFlag
			){
		System.out.println("printing params");
		System.out.println(party +  person+ id + region+listingsFlag);
		System.out.println(region);

		Gson gson = new Gson();
		/** DB */
		Connection c = null;
		try {
			DriverManager.registerDriver(new AppEngineDriver());
			c = DriverManager.getConnection("jdbc:google:rdbms://valimisrakendus:e-valimised/valimisedDB");
			List<List<Object>> resultList =  new ArrayList<List<Object>>();
			
			//kui tahame andmeid mapsile:
			if (region != null){
				System.out.println("NOT NULL REGION");
				resultList = mapQuery(c);

			} else {

				resultList = piechartQuery(c);


			}
			return gson.toJson(resultList);



		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (c != null) 
				try {
					c.close();
				} catch (SQLException ignore) {
				}
		}
		return "Error: gson return statement failed to get called in Tulemused.java";

	}

	/** tagastab listi, mille elementideks on paar (Partei, ParteiH‰‰led) */
	public List<List<Object>> piechartQuery(Connection c) throws SQLException{
		ResultSet votesByPartiesQuery = c.createStatement().executeQuery("SELECT " + 
				"SUM(HaalteArv), " + 
				"Partei.Nimetus, " + 
				"Partei.ID " + 
				"FROM Kandidaat, Partei " + 
				"WHERE ParteiID=Partei.ID " + 
				"Group by ParteiID");

		List<List<Object>> resultList = new ArrayList<List<Object>>();

		while ( votesByPartiesQuery.next()){

			List<Object> singlePartyList = new ArrayList<Object>();
			singlePartyList.add(votesByPartiesQuery.getString("Nimetus"));
			singlePartyList.add(votesByPartiesQuery.getInt("SUM(HaalteArv)"));

			resultList.add(singlePartyList);

		}
		return resultList;
	}

	/** tagastab listi, mille elementideks on kolmik (Piirkond, JuhtivPartei, juhtivaPartei h‰‰lte osakaal piirkonnas) */
	//!TODO, SAADA NIMETUSED PIIRKONNALE JA PARETILE, MITTE ID'd
	public List<List<Object>> mapQuery(Connection c) throws SQLException{
		ResultSet regionLeaders = c.createStatement().executeQuery("SELECT " + 
				"PiirkondID, ParteiID, MAX(ParteilHaali) as LiidrilHaali," +
				"Partei.Nimetus, Piirkond.Nimi, Summa " + 
				"FROM " + 
				
				"(SELECT PiirkondID, ParteiID, SUM(HaalteArv) as ParteilHaali " +
				"FROM Kandidaat " + 
				"GROUP BY ParteiID, PiirkondID " + 
				"ORDER BY PiirkondID, ParteilHaali DESC) subquery, " +
				
				"Partei, Piirkond, " +
				"(SELECT PiirkondID as pID, SUM(HaalteArv) AS Summa " + 
				"FROM Kandidaat " + 
				"GROUP BY pID) summad " +
				
				"WHERE Partei.ID=subquery.ParteiID AND Piirkond.ID=subquery.PiirkondID " + 
				"AND subquery.PiirkondID=summad.pID AND Summa!=0 	" + 	
				
				"GROUP BY subquery.PiirkondID ");

		List<List<Object>> resultList = new ArrayList<List<Object>>();

		while ( regionLeaders.next()){

			List<Object> singlePartyList = new ArrayList<Object>();
			singlePartyList.add(regionLeaders.getInt("PiirkondID"));
			singlePartyList.add(regionLeaders.getInt("ParteiID"));
			singlePartyList.add(regionLeaders.getInt("LiidrilHaali"));
			singlePartyList.add(regionLeaders.getString("Nimetus"));
			singlePartyList.add(regionLeaders.getString("Nimi"));
			singlePartyList.add(regionLeaders.getInt("Summa"));

			resultList.add(singlePartyList);

		}
		return resultList;
	}	



} 