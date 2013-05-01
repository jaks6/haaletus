
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

public class TestLogin extends SeleneseTestBase{
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		WebDriver driver = new FirefoxDriver();
		driver.manage().window().maximize();
		String baseUrl = "http://e-valimised.appspot.com/";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);
	}

	@Test
	public void testLogin() throws Exception {

		selenium.open("");

		selenium.click("link=Logi sisse");
		selenium.waitForPopUp("null", "30000");
		selenium.selectWindow("title=Facebook");
		selenium.type("//*[@id=\"email\"]", "Testerino@hot.ee");
		selenium.type("id=pass", "Testtest1");
		selenium.click("id=u_0_1");
		selenium.selectWindow("null");
		//selenium.click("link=Kandidaadid");
		

		
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
