loadData = function(callback) {
  callback([{"timestamp":"4/23/2011 13:10:41","nameoftheinstitutionorganisation":"Marymount Manhattan College","country":"United States of America","city":"New York","typeofinstitutionorganisation":"Museum, College","links":"http://mod.blogs.com/art_mobs/","name":"Art Mobs","year":2005,"namecontactofcuratororganizer":"Dr. David Gilbert","links_2":"http://mod.blogs.com/art_mobs/\nhttp://www.rocketboom.com/rb_05_jun_08/","description":"Art Mobs explore the intersection of communication, art, and mobile technology. The MoMa project involved using podcasts to deliver unofficial audio tours of the gallery to its guests.\n\nArt Mobs is an ongoing project for Organizational Communication students in the Department of Communication Arts at Marymount Manhattan College.\n","focusoftechnology":"Interpretation - (curatorial tool, guidance, catalogue)","targetgroup":"Audience / Public","whyisitofinterest":"Art Mobs is of interest as an example of technology being used 'unofficially' to experience an institution such as MoMa. Gilbert sees it as part of what Stanford Law Professor Lawrence Lessig calls \"Remix Culture\".\n\nHe describes how 'With recent advances in digital technologies, the ability to sample and remix has been democratized.'","impactuserperspective":"'It may not be the most informative way to experience the art, but I feel lucky to have this renegade guide when I see two tourists struggling to share one of those oddly antiquated electronic wands bearing the museum’s authentic audio information ... I feel somewhat conflicted about this most modern way of seeing MoMa. Because while I likely would’ve learned more about the paintings had I taken the museum-issued tour, I don’t think I would’ve have had quite as much fun.\"\n\n- http://spotlight.macfound.org/featured-stories/entry/art-mobs-strolling-moma-student-curators/\n\n","impactinstitutionorganisationperspective":"David Gilbert of Art Mobs: 'In a sentence, we are democratizing the experience of touring an art museum; we are offering a way for anyone to \"curate\" their own little corner of MoMA ... The Art Mobs project is a way for students to make connections between the arts and new media technologies, and between traditional organizations and Remix Culture.'\n\n","audienceinvolvment":1,"audienceengagement":2,"audienceperception":3,"exhibitionelements":4,"technologymetaphor":1,"technologycontext":2,"identityconstruction":2,"representation":3,"historicalperspective":2,"stance":1,"multinationalism":3,"affiliation":"-"}]);
}

function Clusters(casesList) {
  this.showDetails(casesList[0]);
}

Clusters.prototype.showDetails = function(caseData) {
  var details = $($("#caseDetails").render(caseData));
  $("#clusters .sidebar").html(details);
    
  //adds bar representing the value next to the value number
  details.find(".number").each(function() {
    var field = $(this);
    var value = Number(field.text());
    if (isNaN(value)) value = 0;
    
    var columnName = field.attr("data-column");
    var labels = columnLabels[columnName];
    
    field.html(
      "<div class='barContainer'>" +
      "<div class='low'>"+labels[0]+"</div>" +
      "<div class='hi'>"+labels[1]+"</div>" +
      "<div class='value' style='left:" + (value * 20 + 1) + "%'>"+value+"</div>" +
      "<div class='bar'>" + 
      "<div class='barvalue' style='width:" + (value * 20) + "%'></div>" +
      "</div>"+
      "</div>"      
    )
  })
  
  //converts text links to html <a href>
  details.find(".links").each(function() {
    var field = $(this);
    var links = field.text().split(/[ \n]/);
    var html = "";
    $(links).each(function() {
      html += "<a href='" + this + "'>" + this + "</a>\n";
    });
    field.html(html);
  });  
}