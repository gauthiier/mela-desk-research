//loadData = function(callback) {
//  callback([{"timestamp":"4/23/2011 13:10:41","nameoftheinstitutionorganisation":"Marymount Manhattan College","country":"United States of America","city":"New York","typeofinstitutionorganisation":"Museum, College","links":"http://mod.blogs.com/art_mobs/","name":"Art Mobs","year":2005,"namecontactofcuratororganizer":"Dr. David Gilbert","links_2":"http://mod.blogs.com/art_mobs/\nhttp://www.rocketboom.com/rb_05_jun_08/","description":"Art Mobs explore the intersection of communication, art, and mobile technology. The MoMa project involved using podcasts to deliver unofficial audio tours of the gallery to its guests.\n\nArt Mobs is an ongoing project for Organizational Communication students in the Department of Communication Arts at Marymount Manhattan College.\n","focusoftechnology":"Interpretation - (curatorial tool, guidance, catalogue)","targetgroup":"Audience / Public","whyisitofinterest":"Art Mobs is of interest as an example of technology being used 'unofficially' to experience an institution such as MoMa. Gilbert sees it as part of what Stanford Law Professor Lawrence Lessig calls \"Remix Culture\".\n\nHe describes how 'With recent advances in digital technologies, the ability to sample and remix has been democratized.'","impactuserperspective":"'It may not be the most informative way to experience the art, but I feel lucky to have this renegade guide when I see two tourists struggling to share one of those oddly antiquated electronic wands bearing the museum’s authentic audio information ... I feel somewhat conflicted about this most modern way of seeing MoMa. Because while I likely would’ve learned more about the paintings had I taken the museum-issued tour, I don’t think I would’ve have had quite as much fun.\"\n\n- http://spotlight.macfound.org/featured-stories/entry/art-mobs-strolling-moma-student-curators/\n\n","impactinstitutionorganisationperspective":"David Gilbert of Art Mobs: 'In a sentence, we are democratizing the experience of touring an art museum; we are offering a way for anyone to \"curate\" their own little corner of MoMA ... The Art Mobs project is a way for students to make connections between the arts and new media technologies, and between traditional organizations and Remix Culture.'\n\n","audienceinvolvment":1,"audienceengagement":2,"audienceperception":3,"exhibitionelements":4,"technologymetaphor":1,"technologycontext":2,"identityconstruction":2,"representation":3,"historicalperspective":2,"stance":1,"multinationalism":3,"affiliation":"-"}]);
//}

function Clusters(casesList) {
  this.casesList = casesList;
  showDetails(casesList[0]);
  
  var self = this;
  $(window).bind('resize', function(e) {
    self.resize();
  });
  
  this.resize();
  this.buildGUI();
}

//returns all the values of key value hash map (js object)
Clusters.prototype.hashmapToArray = function(o) {
  var result = [];
  for(var i in o) {
    result.push(o[i])
  }
  return result;
}

Clusters.prototype.buildGUI = function() {
  var options = [];
  for(var columnId in columnLabels) {
    for(var i=0; i<columnList.length; i+=2) {
      if (columnList[i] == columnId)
        options.push({
          value: columnId,
          title: columnList[i+1]
        });
    }
  }
  for(var i=0; i<options.length; i++) {
    $("#clusters_ox").append('<option value="'+options[i].value+'">'+options[i].title+'</option>');
    $("#clusters_oy").append('<option value="'+options[i].value+'">'+options[i].title+'</option>');  
  }
  
  $("#clusters_ox").get(0).selectedIndex = 0;
  $("#clusters_oy").get(0).selectedIndex = 1;
  
  var self = this;
  
  $("#clusters_ox").bind("change", function(e) {
    self.updateGraph();
  })
  
  $("#clusters_oy").bind("change", function(e) {
     self.updateGraph();  
   })
  
  
  this.updateGraph();
  
  //enter.attr("fill", function(d) { return d3.hsl(0, 0.1 + d.n/10, 0.5).rgb().toString() });
}

Clusters.prototype.updateGraph = function() {
  var w = 450;
  var h = 450;
  var margin = 75;
  var y = d3.scale.linear().domain([0, 5]).range([0 + margin, h - margin]);
  var x = d3.scale.linear().domain([0, 5]).range([0 + margin, w - margin]);
  
  if (!this.graphSvg) {
    this.graphSvg = d3.select("#clusters_graph").append("svg:svg")
    .attr("width", w)
    .attr("height", h);
    
    var g = this.graphSvg.append("svg:g"); 
    
    g.append("svg:line")
      .attr("x1", x(-1))
      .attr("y1", y(2.5))
      .attr("x2", x(6))
      .attr("y2", y(2.5))
      .attr("stroke", "#DDD")

    g.append("svg:line")
      .attr("x1", x(2.5))
      .attr("y1", y(-1))
      .attr("x2", x(2.5))
      .attr("y2", y(6))
      .attr("stroke", "#DDD")
      
    g.append("svg:text")
      .attr("class", "xmin")
      .text("xmin")
      .attr("x", x(-1))
      .attr("y", y(2.4))
      .attr("text-anchor", "start")
      .attr("fill", "#999")
          
    g.append("svg:text")
      .attr("class", "xmax")
      .text("xmax")
      .attr("x", x(6))
      .attr("y", y(2.4))
      .attr("text-anchor", "end") 
      .attr("fill", "#999")
      
      g.append("svg:text")
        .attr("class", "ymin")
        .text("ymin")
        .attr("x", x(2.5))
        .attr("y", y(6.2))
        .attr("text-anchor", "middle")
        .attr("fill", "#999")

      g.append("svg:text")
        .attr("class", "ymax")
        .text("ymax")
        .attr("x", x(2.5))
        .attr("y", y(-1.1))
        .attr("text-anchor", "middle") 
        .attr("fill", "#999")
  }
  
  var data = {};
  
  var xField = $("#clusters_ox").val();
  var yField = $("#clusters_oy").val();
  
  var self = this;
    
  for(var i=0; i<this.casesList.length; i++) {
    var caseData = this.casesList[i];
    var xy = "" + caseData[xField] + "" + caseData[yField];
    if (!data[xy]) {
      data[xy] = {
        x: caseData[xField],
        y: caseData[yField],
        n: 0,
        cases: []
      }
    }
    data[xy].n++;
    data[xy].cases.push(caseData);
  }
  
  this.graphSvg.selectAll(".xmin").text(columnLabels[xField][0]);
  this.graphSvg.selectAll(".xmax").text(columnLabels[xField][1]);  
  this.graphSvg.selectAll(".ymin").text(columnLabels[yField][0]);
  this.graphSvg.selectAll(".ymax").text(columnLabels[yField][1]);
  
  var circle = this.graphSvg.selectAll("circle").data(this.hashmapToArray(data));     
  circle.attr("cx", function(d) { return x(d.x); });
  circle.attr("cy", function(d) { return h - y(d.y); });
  circle.attr("r", function(d) { return 5 + d.n; });
     
  var enter = circle.enter().append("svg:circle");  
  enter.attr("cx", function(d) { return x(d.x); });
  enter.attr("cy", function(d) { return h - y(d.y); });
  enter.attr("r", function(d) { return 5 + d.n; });
  enter.attr("stroke", "#00CD7E");
  enter.attr("fill", "rgba(0, 205, 126, 0.5)");  
  enter.on("click", function(e){
    self.showCaseList(e.cases);
  })
  
  circle.exit().remove();
}

Clusters.prototype.showCaseList = function(cases) {
  function bindClickHandler(item, caseData) {
    item.bind("click", function() {
      $("#clusters_list .selected").removeClass("selected");
      showDetails(caseData);
      item.addClass("selected");      
    })
  }
  console.log(cases);
  $("#clusters_list").html("");
  for(var i=0; i<cases.length; i++) {
    var item = $($("#caseListItem").render(cases[i]));
    $("#clusters_list").append(item);
    bindClickHandler(item, cases[i]);
  }
}


Clusters.prototype.resize = function() {
  var sideviewW = $("#sideview").width();
  var windowW = $(window).width();
  $("#clusters").css("width", (windowW - sideviewW - 1) + "px");
  //$("#clusters_graph").css("margin-left", "0px");
}