package evalimised;

public class Kandidaat {
	private String name;
	private String party;
	private int id;
	private String region;
	
	

public Kandidaat(String name, String party, int id, String region) {
	super();
	this.name = name;
	this.party = party;
	this.id = id;
	this.region = region;
}



@Override
public String toString() {
	return "Kandidaat [name=" + name + ", party=" + party + ", id=" + id
			+ ", region=" + region + "]";
}

}
