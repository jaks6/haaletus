
import com.thoughtworks.selenium.Selenium;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;
import com.thoughtworks.selenium.SeleneseTestBase;

public class Kandideerimine  extends SeleneseTestBase{
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		WebDriver driver = new FirefoxDriver();
		driver.manage().window().maximize();
		String baseUrl = "http://e-valimised.appspot.com/";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);
	}

	@Test
	public void testKandideerimine() throws Exception {
		//open site
		selenium.open("");

		//login
		selenium.click("link=Logi sisse");
		selenium.waitForPopUp("null", "30000");
		selenium.selectWindow("title=Facebook");
		selenium.type("//*[@id=\"email\"]", "Testerino@hot.ee");
		selenium.type("id=pass", "Testtest1");
		selenium.click("id=u_0_1");
		selenium.selectWindow("null");
		
		pause(2000);
		//check login was successful
		assertEquals("Testerino Testerino", selenium.getText("//*[@id=\"login\"]"));
		
		//go to kandidaadid, check candidate with our name is not present yet
		
		selenium.click("link=Kandidaadid");
		selenium.click("id=nimiFull");
		selenium.type("id=nimiFull", "Testerino Testerino");
		selenium.click("name=otsiButton");
//		
		//verify first result is empty (we should only have one row, the th)
		int numOfRows = (int) selenium.getXpathCount("//table[@id='candidateList']//tr");
		assertEquals(numOfRows,1);
//
		//create candidate
		selenium.click("link=Kandideerimine");
		selenium.select("name=party","label=Lootuse Erakond");
		selenium.select("name=region", "label=Raplamaa");
		pause(500);
		selenium.click("//div[@id='button_style']/input");
		
		assertEquals("Kinnitage kandideerimine.", selenium.getConfirmation());
		assertEquals("Olete lisatud kandidatuuri!", selenium.getAlert());
		
		
		
		
		//check that the created candidate exists
		selenium.click("link=Kandidaadid");
		selenium.click("id=nimiFull");
		selenium.type("id=nimiFull", "Testerino");
		selenium.click("name=otsiButton");
		pause(1000);
		seleniumEquals("Testerino Testerino", selenium.getTable("id=candidateList.1.0"));
		
	
	}

	@After
	public void tearDown() throws Exception {
		//delete test data from database (bug: votecount isnt decremented)
		selenium.open("/rest/TestCleanup?magicword=banato");
		selenium.stop();
	}
}
