PAIGALDAMISJUHEND:

Vajalikud töövahendid:

	* Eclipse
	* Google App Engine plugin eclipsele (https://dl.google.com/eclipse/plugin/4.2)

Luua Eclipses "App Engine" projekt ning asendada kõik failid siit repositooriumist leiduva sisuga.


#- - - - - - - - - - - - - - - - - - - - - - -#
	ANDMEBAASI 'CREATE' KÄSUD:

CREATE TABLE Isik (

	ID BIGINT NOT NULL AUTO_INCREMENT,  
	Eesnimi VARCHAR(40), 
	Perenimi VARCHAR(40),
	PRIMARY KEY(ID)
	);
	
CREATE TABLE Kandidaat (

	ID BIGINT NOT NULL AUTO_INCREMENT
	IsikID BIGINT NOT NULL,
	ParteiID INT NOT NULL, 
	PiirkondID INT,
	HaalteArv INT,
	PRIMARY KEY(ID),
	UNIQUE (ID),
	
	FOREIGN KEY (IsikID) REFERENCES Isik(ID) ON DELETE CASCADE,
	FOREIGN KEY (ParteiID) REFERENCES Partei(ID),
	FOREIGN KEY (PiirkondID) REFERENCES Piirkond(ID) 
	);
	
CREATE TABLE Partei (

	ID INT NOT NULL AUTO_INCREMENT,
	Nimetus VARCHAR(120) NOT NULL,
	LiikmeteArv INT,
	PRIMARY KEY(ID),
	UNIQUE (ID)
	);
	
CREATE TABLE Piirkond (

	ID INT NOT NULL AUTO_INCREMENT,
	Nimi VARCHAR(120) NOT NULL,
	PRIMARY KEY(ID),
	UNIQUE (ID)
	);
	
	
	
	
	
CREATE TABLE Haal (

	ID BIGINT NOT NULL AUTO_INCREMENT,  
	KandidaatID BIGINT NOT NULL, 
	IsikID BIGINT NOT NULL,
	HaaleAndmisAeg TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(ID),
	UNIQUE(ID),
	FOREIGN KEY (KandidaatID) REFERENCES Kandidaat(ID) ON DELETE CASCADE,
	FOREIGN KEY (OmanikID) REFERENCES Isik(ID) ON DELETE CASCADE
	);
