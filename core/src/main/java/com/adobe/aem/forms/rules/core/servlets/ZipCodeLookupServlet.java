package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * A backend proxy servlet for ZIP code lookup.
 * Comprehensive database covering all 50 US states + DC with major cities.
 * Supports client-side custom functions with real ZIP code data.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/zip-lookup",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("ZIP Code Lookup Proxy Servlet for AEM Forms Rules Editor")
public class ZipCodeLookupServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(ZipCodeLookupServlet.class);

    private static final Pattern ZIP_PATTERN = Pattern.compile("^\\d{5}(-\\d{4})?$");

    // Comprehensive ZIP code database (major cities from all 50 states + DC)
    private static final Map<String, String> ZIP_DATABASE = new HashMap<>();

    static {
        // Alabama
        ZIP_DATABASE.put("35203", "{\"city\": \"Birmingham\", \"state\": \"AL\", \"valid\": true}");
        ZIP_DATABASE.put("36104", "{\"city\": \"Montgomery\", \"state\": \"AL\", \"valid\": true}");
        ZIP_DATABASE.put("36602", "{\"city\": \"Mobile\", \"state\": \"AL\", \"valid\": true}");
        ZIP_DATABASE.put("35801", "{\"city\": \"Huntsville\", \"state\": \"AL\", \"valid\": true}");
        ZIP_DATABASE.put("35401", "{\"city\": \"Tuscaloosa\", \"state\": \"AL\", \"valid\": true}");

        // Alaska
        ZIP_DATABASE.put("99501", "{\"city\": \"Anchorage\", \"state\": \"AK\", \"valid\": true}");
        ZIP_DATABASE.put("99801", "{\"city\": \"Juneau\", \"state\": \"AK\", \"valid\": true}");
        ZIP_DATABASE.put("99701", "{\"city\": \"Fairbanks\", \"state\": \"AK\", \"valid\": true}");

        // Arizona
        ZIP_DATABASE.put("85001", "{\"city\": \"Phoenix\", \"state\": \"AZ\", \"valid\": true}");
        ZIP_DATABASE.put("85201", "{\"city\": \"Mesa\", \"state\": \"AZ\", \"valid\": true}");
        ZIP_DATABASE.put("85701", "{\"city\": \"Tucson\", \"state\": \"AZ\", \"valid\": true}");
        ZIP_DATABASE.put("86001", "{\"city\": \"Flagstaff\", \"state\": \"AZ\", \"valid\": true}");
        ZIP_DATABASE.put("85281", "{\"city\": \"Tempe\", \"state\": \"AZ\", \"valid\": true}");

        // Arkansas
        ZIP_DATABASE.put("72201", "{\"city\": \"Little Rock\", \"state\": \"AR\", \"valid\": true}");
        ZIP_DATABASE.put("72701", "{\"city\": \"Fayetteville\", \"state\": \"AR\", \"valid\": true}");
        ZIP_DATABASE.put("71601", "{\"city\": \"Pine Bluff\", \"state\": \"AR\", \"valid\": true}");

        // California
        ZIP_DATABASE.put("90001", "{\"city\": \"Los Angeles\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("94102", "{\"city\": \"San Francisco\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("92101", "{\"city\": \"San Diego\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("95101", "{\"city\": \"San Jose\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("90210", "{\"city\": \"Beverly Hills\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("94501", "{\"city\": \"Oakland\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("95201", "{\"city\": \"Stockton\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("93701", "{\"city\": \"Fresno\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("92601", "{\"city\": \"Irvine\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("92801", "{\"city\": \"Anaheim\", \"state\": \"CA\", \"valid\": true}");

        // Colorado
        ZIP_DATABASE.put("80201", "{\"city\": \"Denver\", \"state\": \"CO\", \"valid\": true}");
        ZIP_DATABASE.put("80301", "{\"city\": \"Boulder\", \"state\": \"CO\", \"valid\": true}");
        ZIP_DATABASE.put("80501", "{\"city\": \"Longmont\", \"state\": \"CO\", \"valid\": true}");
        ZIP_DATABASE.put("80901", "{\"city\": \"Colorado Springs\", \"state\": \"CO\", \"valid\": true}");

        // Connecticut
        ZIP_DATABASE.put("06101", "{\"city\": \"Hartford\", \"state\": \"CT\", \"valid\": true}");
        ZIP_DATABASE.put("06501", "{\"city\": \"New Haven\", \"state\": \"CT\", \"valid\": true}");
        ZIP_DATABASE.put("06801", "{\"city\": \"Bridgeport\", \"state\": \"CT\", \"valid\": true}");
        ZIP_DATABASE.put("06901", "{\"city\": \"Stamford\", \"state\": \"CT\", \"valid\": true}");

        // Delaware
        ZIP_DATABASE.put("19901", "{\"city\": \"Dover\", \"state\": \"DE\", \"valid\": true}");
        ZIP_DATABASE.put("19801", "{\"city\": \"Wilmington\", \"state\": \"DE\", \"valid\": true}");

        // District of Columbia
        ZIP_DATABASE.put("20001", "{\"city\": \"Washington\", \"state\": \"DC\", \"valid\": true}");
        ZIP_DATABASE.put("20002", "{\"city\": \"Washington\", \"state\": \"DC\", \"valid\": true}");
        ZIP_DATABASE.put("20003", "{\"city\": \"Washington\", \"state\": \"DC\", \"valid\": true}");
        ZIP_DATABASE.put("20004", "{\"city\": \"Washington\", \"state\": \"DC\", \"valid\": true}");
        ZIP_DATABASE.put("20005", "{\"city\": \"Washington\", \"state\": \"DC\", \"valid\": true}");

        // Florida
        ZIP_DATABASE.put("33101", "{\"city\": \"Miami\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("32801", "{\"city\": \"Orlando\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("33601", "{\"city\": \"Tampa\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("32301", "{\"city\": \"Tallahassee\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("33301", "{\"city\": \"Fort Lauderdale\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("34101", "{\"city\": \"Naples\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("32501", "{\"city\": \"Pensacola\", \"state\": \"FL\", \"valid\": true}");
        ZIP_DATABASE.put("32099", "{\"city\": \"Jacksonville\", \"state\": \"FL\", \"valid\": true}");

        // Georgia
        ZIP_DATABASE.put("30301", "{\"city\": \"Atlanta\", \"state\": \"GA\", \"valid\": true}");
        ZIP_DATABASE.put("31401", "{\"city\": \"Savannah\", \"state\": \"GA\", \"valid\": true}");
        ZIP_DATABASE.put("30601", "{\"city\": \"Athens\", \"state\": \"GA\", \"valid\": true}");
        ZIP_DATABASE.put("31201", "{\"city\": \"Macon\", \"state\": \"GA\", \"valid\": true}");
        ZIP_DATABASE.put("30501", "{\"city\": \"Gainesville\", \"state\": \"GA\", \"valid\": true}");

        // Hawaii
        ZIP_DATABASE.put("96801", "{\"city\": \"Honolulu\", \"state\": \"HI\", \"valid\": true}");
        ZIP_DATABASE.put("96701", "{\"city\": \"Hilo\", \"state\": \"HI\", \"valid\": true}");
        ZIP_DATABASE.put("96734", "{\"city\": \"Kailua\", \"state\": \"HI\", \"valid\": true}");

        // Idaho
        ZIP_DATABASE.put("83701", "{\"city\": \"Boise\", \"state\": \"ID\", \"valid\": true}");
        ZIP_DATABASE.put("83201", "{\"city\": \"Pocatello\", \"state\": \"ID\", \"valid\": true}");
        ZIP_DATABASE.put("83801", "{\"city\": \"Coeur d'Alene\", \"state\": \"ID\", \"valid\": true}");

        // Illinois
        ZIP_DATABASE.put("60601", "{\"city\": \"Chicago\", \"state\": \"IL\", \"valid\": true}");
        ZIP_DATABASE.put("62701", "{\"city\": \"Springfield\", \"state\": \"IL\", \"valid\": true}");
        ZIP_DATABASE.put("61801", "{\"city\": \"Champaign\", \"state\": \"IL\", \"valid\": true}");
        ZIP_DATABASE.put("60101", "{\"city\": \"Addison\", \"state\": \"IL\", \"valid\": true}");
        ZIP_DATABASE.put("60201", "{\"city\": \"Evanston\", \"state\": \"IL\", \"valid\": true}");

        // Indiana
        ZIP_DATABASE.put("46201", "{\"city\": \"Indianapolis\", \"state\": \"IN\", \"valid\": true}");
        ZIP_DATABASE.put("47901", "{\"city\": \"Lafayette\", \"state\": \"IN\", \"valid\": true}");
        ZIP_DATABASE.put("46601", "{\"city\": \"South Bend\", \"state\": \"IN\", \"valid\": true}");
        ZIP_DATABASE.put("47701", "{\"city\": \"Evansville\", \"state\": \"IN\", \"valid\": true}");

        // Iowa
        ZIP_DATABASE.put("50301", "{\"city\": \"Des Moines\", \"state\": \"IA\", \"valid\": true}");
        ZIP_DATABASE.put("52240", "{\"city\": \"Iowa City\", \"state\": \"IA\", \"valid\": true}");
        ZIP_DATABASE.put("52401", "{\"city\": \"Cedar Rapids\", \"state\": \"IA\", \"valid\": true}");
        ZIP_DATABASE.put("51501", "{\"city\": \"Council Bluffs\", \"state\": \"IA\", \"valid\": true}");
        ZIP_DATABASE.put("50010", "{\"city\": \"Ames\", \"state\": \"IA\", \"valid\": true}");

        // Kansas
        ZIP_DATABASE.put("66101", "{\"city\": \"Kansas City\", \"state\": \"KS\", \"valid\": true}");
        ZIP_DATABASE.put("67201", "{\"city\": \"Wichita\", \"state\": \"KS\", \"valid\": true}");
        ZIP_DATABASE.put("66601", "{\"city\": \"Topeka\", \"state\": \"KS\", \"valid\": true}");

        // Kentucky
        ZIP_DATABASE.put("40201", "{\"city\": \"Louisville\", \"state\": \"KY\", \"valid\": true}");
        ZIP_DATABASE.put("40501", "{\"city\": \"Lexington\", \"state\": \"KY\", \"valid\": true}");
        ZIP_DATABASE.put("41001", "{\"city\": \"Covington\", \"state\": \"KY\", \"valid\": true}");

        // Louisiana
        ZIP_DATABASE.put("70112", "{\"city\": \"New Orleans\", \"state\": \"LA\", \"valid\": true}");
        ZIP_DATABASE.put("70801", "{\"city\": \"Baton Rouge\", \"state\": \"LA\", \"valid\": true}");
        ZIP_DATABASE.put("71101", "{\"city\": \"Shreveport\", \"state\": \"LA\", \"valid\": true}");
        ZIP_DATABASE.put("70501", "{\"city\": \"Lafayette\", \"state\": \"LA\", \"valid\": true}");

        // Maine
        ZIP_DATABASE.put("04101", "{\"city\": \"Portland\", \"state\": \"ME\", \"valid\": true}");
        ZIP_DATABASE.put("04330", "{\"city\": \"Augusta\", \"state\": \"ME\", \"valid\": true}");
        ZIP_DATABASE.put("04401", "{\"city\": \"Bangor\", \"state\": \"ME\", \"valid\": true}");

        // Maryland
        ZIP_DATABASE.put("21201", "{\"city\": \"Baltimore\", \"state\": \"MD\", \"valid\": true}");
        ZIP_DATABASE.put("20701", "{\"city\": \"Annapolis\", \"state\": \"MD\", \"valid\": true}");
        ZIP_DATABASE.put("20801", "{\"city\": \"Bethesda\", \"state\": \"MD\", \"valid\": true}");
        ZIP_DATABASE.put("21701", "{\"city\": \"Frederick\", \"state\": \"MD\", \"valid\": true}");

        // Massachusetts
        ZIP_DATABASE.put("02108", "{\"city\": \"Boston\", \"state\": \"MA\", \"valid\": true}");
        ZIP_DATABASE.put("02116", "{\"city\": \"Boston\", \"state\": \"MA\", \"valid\": true}");
        ZIP_DATABASE.put("02139", "{\"city\": \"Cambridge\", \"state\": \"MA\", \"valid\": true}");
        ZIP_DATABASE.put("01601", "{\"city\": \"Worcester\", \"state\": \"MA\", \"valid\": true}");
        ZIP_DATABASE.put("02701", "{\"city\": \"New Bedford\", \"state\": \"MA\", \"valid\": true}");

        // Michigan
        ZIP_DATABASE.put("48201", "{\"city\": \"Detroit\", \"state\": \"MI\", \"valid\": true}");
        ZIP_DATABASE.put("48101", "{\"city\": \"Ann Arbor\", \"state\": \"MI\", \"valid\": true}");
        ZIP_DATABASE.put("48801", "{\"city\": \"East Lansing\", \"state\": \"MI\", \"valid\": true}");
        ZIP_DATABASE.put("49501", "{\"city\": \"Grand Rapids\", \"state\": \"MI\", \"valid\": true}");

        // Minnesota
        ZIP_DATABASE.put("55101", "{\"city\": \"Saint Paul\", \"state\": \"MN\", \"valid\": true}");
        ZIP_DATABASE.put("55401", "{\"city\": \"Minneapolis\", \"state\": \"MN\", \"valid\": true}");
        ZIP_DATABASE.put("55801", "{\"city\": \"Duluth\", \"state\": \"MN\", \"valid\": true}");
        ZIP_DATABASE.put("55901", "{\"city\": \"Rochester\", \"state\": \"MN\", \"valid\": true}");

        // Mississippi
        ZIP_DATABASE.put("39201", "{\"city\": \"Jackson\", \"state\": \"MS\", \"valid\": true}");
        ZIP_DATABASE.put("38601", "{\"city\": \"Tupelo\", \"state\": \"MS\", \"valid\": true}");
        ZIP_DATABASE.put("39501", "{\"city\": \"Gulfport\", \"state\": \"MS\", \"valid\": true}");

        // Missouri
        ZIP_DATABASE.put("63101", "{\"city\": \"Saint Louis\", \"state\": \"MO\", \"valid\": true}");
        ZIP_DATABASE.put("64101", "{\"city\": \"Kansas City\", \"state\": \"MO\", \"valid\": true}");
        ZIP_DATABASE.put("65101", "{\"city\": \"Jefferson City\", \"state\": \"MO\", \"valid\": true}");
        ZIP_DATABASE.put("65801", "{\"city\": \"Springfield\", \"state\": \"MO\", \"valid\": true}");

        // Montana
        ZIP_DATABASE.put("59601", "{\"city\": \"Helena\", \"state\": \"MT\", \"valid\": true}");
        ZIP_DATABASE.put("59801", "{\"city\": \"Missoula\", \"state\": \"MT\", \"valid\": true}");
        ZIP_DATABASE.put("59101", "{\"city\": \"Billings\", \"state\": \"MT\", \"valid\": true}");

        // Nebraska
        ZIP_DATABASE.put("68101", "{\"city\": \"Omaha\", \"state\": \"NE\", \"valid\": true}");
        ZIP_DATABASE.put("68501", "{\"city\": \"Lincoln\", \"state\": \"NE\", \"valid\": true}");
        ZIP_DATABASE.put("68801", "{\"city\": \"Grand Island\", \"state\": \"NE\", \"valid\": true}");

        // Nevada
        ZIP_DATABASE.put("89101", "{\"city\": \"Las Vegas\", \"state\": \"NV\", \"valid\": true}");
        ZIP_DATABASE.put("89501", "{\"city\": \"Reno\", \"state\": \"NV\", \"valid\": true}");
        ZIP_DATABASE.put("89301", "{\"city\": \"Carson City\", \"state\": \"NV\", \"valid\": true}");

        // New Hampshire
        ZIP_DATABASE.put("03301", "{\"city\": \"Concord\", \"state\": \"NH\", \"valid\": true}");
        ZIP_DATABASE.put("03101", "{\"city\": \"Manchester\", \"state\": \"NH\", \"valid\": true}");
        ZIP_DATABASE.put("03801", "{\"city\": \"Portsmouth\", \"state\": \"NH\", \"valid\": true}");

        // New Jersey
        ZIP_DATABASE.put("07001", "{\"city\": \"Newark\", \"state\": \"NJ\", \"valid\": true}");
        ZIP_DATABASE.put("07101", "{\"city\": \"Newark\", \"state\": \"NJ\", \"valid\": true}");
        ZIP_DATABASE.put("08501", "{\"city\": \"Trenton\", \"state\": \"NJ\", \"valid\": true}");
        ZIP_DATABASE.put("07601", "{\"city\": \"Hackensack\", \"state\": \"NJ\", \"valid\": true}");
        ZIP_DATABASE.put("08901", "{\"city\": \"New Brunswick\", \"state\": \"NJ\", \"valid\": true}");

        // New Mexico
        ZIP_DATABASE.put("87101", "{\"city\": \"Albuquerque\", \"state\": \"NM\", \"valid\": true}");
        ZIP_DATABASE.put("87501", "{\"city\": \"Santa Fe\", \"state\": \"NM\", \"valid\": true}");
        ZIP_DATABASE.put("88001", "{\"city\": \"Las Cruces\", \"state\": \"NM\", \"valid\": true}");

        // New York
        ZIP_DATABASE.put("10001", "{\"city\": \"New York\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("10019", "{\"city\": \"New York\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("10036", "{\"city\": \"New York\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("12201", "{\"city\": \"Albany\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("14601", "{\"city\": \"Rochester\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("13201", "{\"city\": \"Syracuse\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("14201", "{\"city\": \"Buffalo\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("10501", "{\"city\": \"Mount Kisco\", \"state\": \"NY\", \"valid\": true}");

        // North Carolina
        ZIP_DATABASE.put("27601", "{\"city\": \"Raleigh\", \"state\": \"NC\", \"valid\": true}");
        ZIP_DATABASE.put("28201", "{\"city\": \"Charlotte\", \"state\": \"NC\", \"valid\": true}");
        ZIP_DATABASE.put("27401", "{\"city\": \"Greensboro\", \"state\": \"NC\", \"valid\": true}");
        ZIP_DATABASE.put("28801", "{\"city\": \"Asheville\", \"state\": \"NC\", \"valid\": true}");
        ZIP_DATABASE.put("27701", "{\"city\": \"Durham\", \"state\": \"NC\", \"valid\": true}");

        // North Dakota
        ZIP_DATABASE.put("58501", "{\"city\": \"Bismarck\", \"state\": \"ND\", \"valid\": true}");
        ZIP_DATABASE.put("58101", "{\"city\": \"Fargo\", \"state\": \"ND\", \"valid\": true}");
        ZIP_DATABASE.put("58201", "{\"city\": \"Grand Forks\", \"state\": \"ND\", \"valid\": true}");

        // Ohio
        ZIP_DATABASE.put("43201", "{\"city\": \"Columbus\", \"state\": \"OH\", \"valid\": true}");
        ZIP_DATABASE.put("44101", "{\"city\": \"Cleveland\", \"state\": \"OH\", \"valid\": true}");
        ZIP_DATABASE.put("45201", "{\"city\": \"Cincinnati\", \"state\": \"OH\", \"valid\": true}");
        ZIP_DATABASE.put("43601", "{\"city\": \"Toledo\", \"state\": \"OH\", \"valid\": true}");
        ZIP_DATABASE.put("44301", "{\"city\": \"Akron\", \"state\": \"OH\", \"valid\": true}");

        // Oklahoma
        ZIP_DATABASE.put("73101", "{\"city\": \"Oklahoma City\", \"state\": \"OK\", \"valid\": true}");
        ZIP_DATABASE.put("74101", "{\"city\": \"Tulsa\", \"state\": \"OK\", \"valid\": true}");
        ZIP_DATABASE.put("73501", "{\"city\": \"Lawton\", \"state\": \"OK\", \"valid\": true}");

        // Oregon
        ZIP_DATABASE.put("97201", "{\"city\": \"Portland\", \"state\": \"OR\", \"valid\": true}");
        ZIP_DATABASE.put("97301", "{\"city\": \"Salem\", \"state\": \"OR\", \"valid\": true}");
        ZIP_DATABASE.put("97401", "{\"city\": \"Eugene\", \"state\": \"OR\", \"valid\": true}");
        ZIP_DATABASE.put("97701", "{\"city\": \"Bend\", \"state\": \"OR\", \"valid\": true}");

        // Pennsylvania
        ZIP_DATABASE.put("19101", "{\"city\": \"Philadelphia\", \"state\": \"PA\", \"valid\": true}");
        ZIP_DATABASE.put("15201", "{\"city\": \"Pittsburgh\", \"state\": \"PA\", \"valid\": true}");
        ZIP_DATABASE.put("17101", "{\"city\": \"Harrisburg\", \"state\": \"PA\", \"valid\": true}");
        ZIP_DATABASE.put("18001", "{\"city\": \"Allentown\", \"state\": \"PA\", \"valid\": true}");
        ZIP_DATABASE.put("16501", "{\"city\": \"Erie\", \"state\": \"PA\", \"valid\": true}");

        // Rhode Island
        ZIP_DATABASE.put("02901", "{\"city\": \"Providence\", \"state\": \"RI\", \"valid\": true}");
        ZIP_DATABASE.put("02801", "{\"city\": \"Warwick\", \"state\": \"RI\", \"valid\": true}");
        ZIP_DATABASE.put("02840", "{\"city\": \"Newport\", \"state\": \"RI\", \"valid\": true}");

        // South Carolina
        ZIP_DATABASE.put("29201", "{\"city\": \"Columbia\", \"state\": \"SC\", \"valid\": true}");
        ZIP_DATABASE.put("29401", "{\"city\": \"Charleston\", \"state\": \"SC\", \"valid\": true}");
        ZIP_DATABASE.put("29601", "{\"city\": \"Greenville\", \"state\": \"SC\", \"valid\": true}");
        ZIP_DATABASE.put("29501", "{\"city\": \"Florence\", \"state\": \"SC\", \"valid\": true}");

        // South Dakota
        ZIP_DATABASE.put("57501", "{\"city\": \"Pierre\", \"state\": \"SD\", \"valid\": true}");
        ZIP_DATABASE.put("57101", "{\"city\": \"Sioux Falls\", \"state\": \"SD\", \"valid\": true}");
        ZIP_DATABASE.put("57701", "{\"city\": \"Rapid City\", \"state\": \"SD\", \"valid\": true}");

        // Tennessee
        ZIP_DATABASE.put("37201", "{\"city\": \"Nashville\", \"state\": \"TN\", \"valid\": true}");
        ZIP_DATABASE.put("38101", "{\"city\": \"Memphis\", \"state\": \"TN\", \"valid\": true}");
        ZIP_DATABASE.put("37401", "{\"city\": \"Chattanooga\", \"state\": \"TN\", \"valid\": true}");
        ZIP_DATABASE.put("37901", "{\"city\": \"Knoxville\", \"state\": \"TN\", \"valid\": true}");

        // Texas
        ZIP_DATABASE.put("73301", "{\"city\": \"Austin\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("77001", "{\"city\": \"Houston\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("75201", "{\"city\": \"Dallas\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("78201", "{\"city\": \"San Antonio\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("79901", "{\"city\": \"El Paso\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("76101", "{\"city\": \"Fort Worth\", \"state\": \"TX\", \"valid\": true}");
        ZIP_DATABASE.put("78501", "{\"city\": \"McAllen\", \"state\": \"TX\", \"valid\": true}");

        // Utah
        ZIP_DATABASE.put("84101", "{\"city\": \"Salt Lake City\", \"state\": \"UT\", \"valid\": true}");
        ZIP_DATABASE.put("84001", "{\"city\": \"Provo\", \"state\": \"UT\", \"valid\": true}");
        ZIP_DATABASE.put("84111", "{\"city\": \"Salt Lake City\", \"state\": \"UT\", \"valid\": true}");
        ZIP_DATABASE.put("84601", "{\"city\": \"Orem\", \"state\": \"UT\", \"valid\": true}");

        // Vermont
        ZIP_DATABASE.put("05601", "{\"city\": \"Montpelier\", \"state\": \"VT\", \"valid\": true}");
        ZIP_DATABASE.put("05401", "{\"city\": \"Burlington\", \"state\": \"VT\", \"valid\": true}");

        // Virginia
        ZIP_DATABASE.put("23219", "{\"city\": \"Richmond\", \"state\": \"VA\", \"valid\": true}");
        ZIP_DATABASE.put("22030", "{\"city\": \"Fairfax\", \"state\": \"VA\", \"valid\": true}");
        ZIP_DATABASE.put("23601", "{\"city\": \"Newport News\", \"state\": \"VA\", \"valid\": true}");
        ZIP_DATABASE.put("24501", "{\"city\": \"Lynchburg\", \"state\": \"VA\", \"valid\": true}");
        ZIP_DATABASE.put("23185", "{\"city\": \"Williamsburg\", \"state\": \"VA\", \"valid\": true}");

        // Washington
        ZIP_DATABASE.put("98101", "{\"city\": \"Seattle\", \"state\": \"WA\", \"valid\": true}");
        ZIP_DATABASE.put("98001", "{\"city\": \"Auburn\", \"state\": \"WA\", \"valid\": true}");
        ZIP_DATABASE.put("99201", "{\"city\": \"Spokane\", \"state\": \"WA\", \"valid\": true}");
        ZIP_DATABASE.put("98501", "{\"city\": \"Olympia\", \"state\": \"WA\", \"valid\": true}");
        ZIP_DATABASE.put("98301", "{\"city\": \"Tacoma\", \"state\": \"WA\", \"valid\": true}");

        // West Virginia
        ZIP_DATABASE.put("25301", "{\"city\": \"Charleston\", \"state\": \"WV\", \"valid\": true}");
        ZIP_DATABASE.put("26101", "{\"city\": \"Parkersburg\", \"state\": \"WV\", \"valid\": true}");
        ZIP_DATABASE.put("26501", "{\"city\": \"Morgantown\", \"state\": \"WV\", \"valid\": true}");

        // Wisconsin
        ZIP_DATABASE.put("53201", "{\"city\": \"Milwaukee\", \"state\": \"WI\", \"valid\": true}");
        ZIP_DATABASE.put("53701", "{\"city\": \"Madison\", \"state\": \"WI\", \"valid\": true}");
        ZIP_DATABASE.put("54301", "{\"city\": \"Green Bay\", \"state\": \"WI\", \"valid\": true}");
        ZIP_DATABASE.put("54901", "{\"city\": \"Oshkosh\", \"state\": \"WI\", \"valid\": true}");

        // Wyoming
        ZIP_DATABASE.put("82001", "{\"city\": \"Cheyenne\", \"state\": \"WY\", \"valid\": true}");
        ZIP_DATABASE.put("82501", "{\"city\": \"Riverton\", \"state\": \"WY\", \"valid\": true}");
        ZIP_DATABASE.put("83001", "{\"city\": \"Jackson\", \"state\": \"WY\", \"valid\": true}");
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String zip = request.getParameter("zip");
        if (zip != null) {
            zip = zip.trim();
        }

        // Clean input for secure logging (prevent Log Injection)
        String safeZipLog = (zip == null) ? "null" : zip.replaceAll("[^a-zA-Z0-9-]", "");
        LOG.info("ZipCodeLookupServlet: Looking up ZIP code: {}", safeZipLog);

        if (zip == null || zip.isEmpty() || !ZIP_PATTERN.matcher(zip).matches()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ZIP code parameter. Must be 5 digits (e.g. 12345) or ZIP+4 (e.g. 12345-6789).\", \"valid\": false}");
            return;
        }

        // If it's ZIP+4 (9 digits with a hyphen), extract the first 5 digits for the database lookup
        String lookupKey = zip;
        if (zip.contains("-")) {
            lookupKey = zip.split("-")[0];
        }

        String jsonResponse = ZIP_DATABASE.get(lookupKey);

        if (jsonResponse != null) {
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(jsonResponse);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"ZIP code not found in backend database.\", \"valid\": false}");
        }
    }
}