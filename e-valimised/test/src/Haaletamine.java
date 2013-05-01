
import com.thoughtworks.selenium.Selenium;
import com.thoughtworks.selenium.SeleneseTestBase;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;

public class Haaletamine extends SeleneseTestBase  {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception{
		WebDriver driver = new FirefoxDriver();
		driver.manage().window().maximize();
		String baseUrl = "http://e-valimised.appspot.com/";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);
	}

	@Test
	public void testHaal1() throws Exception {
		selenium.open("");
		
		//login
		selenium.click("link=Logi sisse");
		selenium.waitForPopUp("null", "30000");
		selenium.selectWindow("title=Facebook");
		selenium.type("//*[@id=\"email\"]", "Testerino@hot.ee");
		selenium.type("id=pass", "Testtest1");
		selenium.click("id=u_0_1");
		selenium.selectWindow("null");
		pause(3000);
		assertEquals("Testerino Testerino", selenium.getText("//*[@id=\"login\"]"));
		
		//vote
		selenium.click("link=Kandidaadid");
		//verify we have no vote yet
		assertFalse(selenium.isTextPresent("Teie hetkene h‰‰l"));
		selenium.click("id=nimiFull");
		selenium.type("id=nimiFull", "Jaagup Viil");
		selenium.click("name=otsiButton");   
		selenium.click("//table[@id='candidateList']/tbody/tr/td[3]");
		selenium.click("name=voteButton");
		pause(2000);
		selenium.click("link=Kandidaadid");
		pause(1000);
		
		//make sure we now see a vote
		assertTrue(selenium.isTextPresent("Teie hetkene h‰‰l"));
		
	}

	@After
	public void tearDown() throws Exception {
		//delete test info
				selenium.open("/rest/TestCleanup?magicword=banato");
		selenium.stop();
	}
}
