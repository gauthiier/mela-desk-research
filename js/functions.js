//labels for scales
var labels = [ [
                    ['Categorization - User Experience'],
                    [
                        ['Audience Involvment','passive','active','Measure of the cases in terms of how much interaction (physical or otherwise) they expect or require.'],
                        ['Audience Engagement','individual','collective','Measure of the cases in terms of the intention or actuality of them to be experience by many people simultaneously, or by one individual at a time.'],
                        ['Audience Perception','immersive','reflective','Measure of the cases in terms of physical or cognitively engaging it is intended to be.  We place in opposition here tendencies towards "artistic" or "interpretive" forms, versus more informational, pedagogic or didactic strategies.'],
                    ]
               ],
               [
                   ['Categorization - Exhibition Design, Technology Strategies / Methods'],
                   [
                        ['Exhibition Elements','object','virtual','Measure of the cases as to their predominantly digital, simulated, distributed features, as opposed to physical, bodily and situated applications.'],
                        ['Technology Metaphor','tool','map','Measure of the cases in terms of the facility they give audiences or users to explore or "probe" an informational or factual landscape.  This is juxtaposed to a tendency to use technologies to help situate users or audiences within this same landscape or field.'],
                        ['Technology Context','mobile','stationary','Measure of the cases in terms of their ability to be translated, transported or movable by users or audiences.']
                   ]
               ],
               [
                   ['Categorization - Institution / Organisation Purpose'],
                   [
                   
                        ['Identity Construction','personal','institutional','Measure of the cases in terms of thier capacity to reflect the opinions, experience or narratives of individual, or whether they articulates a more systematic, impersonal and formal inclination.'],
                        ['Representation','minority','majority','Measure of the cases in terms of the intention or actuality to project the views, histories, artifacts or particulars of a marginalised, minority or little know outlook or approach.'],
                        ['Historical Perspective','contempory','historical','Measure of the cases in terms of their historical emphasis.  Do they project a contemporary world view (recent events, news, accounts) in some way, or are ideas projected through a more traditionally historical viewpoint?'],
                        ['Stance','transgressive','conservative','Measure of the cases in terms of he degree to which they attempt to become an "agent for change," putting forward a new, challenging or provocative worldview.'],
                        ['Multinationalism','trans-national','national','Measure of the cases in terms of their emphasis or attitude towards nationalism and patriotism, opposed here to a more international or global frame of mind.']
                   ]
               ]
            ];

var indexes = ['nameoftheinstitutionorganisation', 'country', 'city', 'typeofinstitutionorganisation', 'links', 'name', 'year', 'namecontactofcuratororganizer', 'links_2', 'description',
                'focusoftechnology', 'targetgroup', 'whyisitofinterest', 'impact-userperspective', 'impact-institutionorganisationperspective', 'audienceinvolvment', 'audienceengagement',
                'audienceperception', 'exhibitionelements', 'technologymetaphor', 'technologycontext', 'identityconstruction', 'representation', 'historicalperspective', 'stance', 'multinationalism'];
            

// data API
function jsonGetCellEntries(key, worksheetnbr, callback_fn) {

    jsonClearCellScript();
    
    var script = document.createElement('script');
    script.setAttribute('src', 'http://spreadsheets.google.com/feeds/'
                         + 'cells'
                         + '/' + key
                         + '/' + worksheetnbr
                         + '/public/values'
                         + '?alt=json-in-script&callback='
                         + callback_fn
                        );

    script.setAttribute('id', 'json_cell_data_script');
    script.setAttribute('type', 'text/javascript');
    document.documentElement.firstChild.appendChild(script);
    
}

function jsonGetListEntries(key, worksheetnbr, callback_fn) {

    jsonClearListScript();

    var script = document.createElement('script');
    script.setAttribute('src', 'http://spreadsheets.google.com/feeds/'
                         + 'list'
                         + '/' + key
                         + '/' + worksheetnbr
                         + '/public/values'
                         + '?alt=json-in-script&callback='
                         + callback_fn
                        );

    script.setAttribute('id', 'json_cell_data_script');
    script.setAttribute('type', 'text/javascript');
    document.documentElement.firstChild.appendChild(script);

}

function jsonClearCellScript() {
    var jsonScript = document.getElementById('json_cell_data_script');
        if (jsonScript) {
            jsonScript.parentNode.removeChild(jsonScript);
        }
}

function jsonClearListScript() {
    var jsonScript = document.getElementById('json_cell_data_script');
        if (jsonScript) {
            jsonScript.parentNode.removeChild(jsonScript);
        }
}


function jsonParseCellEntries(json) {

    var head = new Array();
    var gdata = new Array();
    var data = new Array();

    var pcol = 0, col = 0;

    for (var i = 0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        if(entry.gs$cell.row == '1') {
            head.push(entry.content.$t);
        } else {
            if (entry.gs$cell.col == '1'){
                if(data.length > 0){
                    gdata.push(data);
                    data = new Array();
                }
             }
             col = parseInt(entry.gs$cell.col) - 1;
             data[col] = entry.content.$t;
        }
    }

    return {'head' : head, 'data' : gdata};

}

// graphs API
function createBarGraph(catindx, indx, vdata, width, height, top, left, divparent) {

    // note : padding [top, left , bottom, right]
    var w = width, h = height;

    if(indx >= labels[catindx][1].length)
        return;

    var data = vdata[catindx * 3 + indx];
    var l = labels[catindx][1][indx];

    var mx = 0;
    for(var i = 0; i < data.length; i++){
        if(data[i] > mx)
            mx = data[i];
    }

    x = d3.scale.linear().domain([0, mx]).range([0, w - left]),
    y = d3.scale.ordinal().domain(d3.range(data.length)).rangeBands([0, h - top], .2);

    var div = document.getElementById(divparent);

    var vis = d3.select(div)
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        //.attr("style", "border: 1px solid blue;")
      .append("svg:g")
        .attr("transform", "translate(" + left + "," + top + ")");

    // bars
    var bars = vis.selectAll("g.bar")
        .data(data)
      .enter().append("svg:g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {return "translate(0," + y(i) + ")";});

    bars.append("svg:rect")
        .attr("class", "rect")
        .attr("width", x)
        .attr("height", y.rangeBand());

    bars.append("svg:rect")
        .attr("fill", "red")
        .attr("width", x / 2)
        .attr("height", y.rangeBand());

    bars.append("svg:text")
        .attr("x", x)
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -6)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .text(x.tickFormat(10));

    bars.append("svg:text")
        .attr("x", 0)
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -6)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d, i) {
            if(i == 0) {
                return l[1];
            }
            else if(i == data.length - 1) {
                return l[2];
            }
            else {
                return '';
            }

        });

        drawArrow(vis, y.rangeBand() + top, h - (y.rangeBand() + top), -15);

}

function drawArrow(vis, y1, y2, xoff) {

    vis.append("svg:line")
        .attr("y1", y1)
        .attr("x1", xoff)
        .attr("y2", y2)
        .attr("x2", xoff)
        .attr("stroke", "#aaa");

    vis.append("svg:line")
        .attr("y1", y1)
        .attr("x1", xoff)
        .attr("y2", y1 + 3)
        .attr("x2", xoff - 2)
        .attr("stroke", "#aaa");

    vis.append("svg:line")
        .attr("y1", y1)
        .attr("x1", xoff)
        .attr("y2", y1 + 3)
        .attr("x2", xoff + 2)
        .attr("stroke", "#aaa");

    vis.append("svg:line")
        .attr("y1", y2)
        .attr("x1", xoff)
        .attr("y2", y2 - 3)
        .attr("x2", xoff - 2)
        .attr("stroke", "#aaa");

    vis.append("svg:line")
        .attr("y1", y2)
        .attr("x1", xoff)
        .attr("y2", y2 - 3)
        .attr("x2", xoff + 2)
        .attr("stroke", "#aaa");

    
}

function packGraphData(data) {

    var h = data.head;
    var d = data.data;
    var p = new Array();

    for(var i = 0; i < 11; i++) {
        p[i] = [0,0,0,0,0];
        for(var j = 0; j < d.length; j++){
            if(d[j][16 + i] != undefined)
                p[i][d[j][16 + i] - 1] += 1;
        }
    }

    return p;
    
}

function createGraphDesc(catindx, indx, divparent) {

    var div = document.getElementById(divparent);
    if(div == undefined || indx >= labels[catindx][1].length)
        return;
    var t = document.createTextNode(labels[catindx][1][indx][3]);
    div.appendChild(t);

}

function createGraphSubTitle(catindx, indx, divparent) {

    var div = document.getElementById(divparent);
    if(div == undefined || indx >= labels[catindx][1].length)
        return;
    var t = document.createTextNode(labels[catindx][1][indx][0]);
    div.appendChild(t);

}

function createRow(indx, p, divparent) {

    var d = document.createElement('div');

    var l = labels[indx];
    var title = l[0];
    var ll = l[1];

    // un peu de la merde
    var t = document.createElement('div');
    t.setAttribute("class", "title")
    var tt = document.createTextNode(title);
    t.appendChild(tt);
    d.appendChild(t);

    var table = document.createElement('table');
    table.setAttribute('id', 'output');
    var tbody = document.createElement('tbody');

    var tr = document.createElement('tr');

    for(var i = 0; i < ll.length; i++){

        if(i != 0 && i % 3 == 0) {
            tbody.appendChild(tr);
            var tr = document.createElement('tr');
        }

        var td = document.createElement('td');
        td.setAttribute('class', 'cell');
        
        var sid = "subtitle" + indx + "." + i;
        var fid = "fig" + indx + "." + i;
        var did = "desc" + indx + "." + i;


        var subtitle = document.createElement('div');
        subtitle.setAttribute('class', 'subtitle');
        subtitle.setAttribute('id', sid);

        var fig = document.createElement('div');
        fig.setAttribute('class', 'fig');
        fig.setAttribute('id', fid);

        var desc = document.createElement('div');
        desc.setAttribute('class', 'desc');
        desc.setAttribute('id', did);

        td.appendChild(subtitle);
        td.appendChild(fig);
        td.appendChild(desc);

        tr.appendChild(td);

    }

    tbody.appendChild(tr);
    table.appendChild(tbody);

    d.appendChild(table);

    document.getElementById(divparent).appendChild(d);

    for(var i = 0; i < ll.length; i++){
        createGraphDesc(indx, i, "desc" + indx + "." + i);
        createBarGraph(indx, i, p, 385, 150, 5, 75, "fig" + indx + "." + i);
        createGraphSubTitle(indx, i, "subtitle" + indx + "." + i);
    }

}


//maps API
function loadMapsAPI() {
    var script = document.createElement('script');
    script.setAttribute('src',"https://maps.google.com/maps/api/js?sensor=false");
    script.setAttribute('id', 'maps_api_script');
    script.setAttribute('type', 'text/javascript');
    document.documentElement.firstChild.appendChild(script);
}

function marker(location, d, h) {
    var latlng = location;
    var m = new google.maps.Marker({
       position: latlng,
       map: map,
       title: d[1],
       draggable: false
    });
    var c = marker_content(d, h);
    var info = new google.maps.InfoWindow({
       content: c
    });
    google.maps.event.addListener(m, 'click',
        function() {
            info.open(map,m);
        }
    );
}

function drawScale(x1, x2, y, v) {
    var x = 220 / 5;
    var svg = '<svg width="250" height="10"><g transform="translate(0,0)">';
    svg += '<line class="scale" x1="'+ x1 + '" x2="' + x2 + '" y1="' + y + '" y2="' + y + '"/>';
    svg += '<line class="scale" x1="'+ x1 + '" x2="' + (x1+3) + '" y1="' + y + '" y2="' + (y-3) + '"/>';
    svg += '<line class="scale" x1="'+ x1 + '" x2="' + (x1+3) + '" y1="' + y + '" y2="' + (y+3) + '"/>';
    svg += '<line class="scale" x1="'+ x2 + '" x2="' + (x2-3) + '" y1="' + y + '" y2="' + (y-3) + '"/>';
    svg += '<line class="scale" x1="'+ x2 + '" x2="' + (x2-3) + '" y1="' + y + '" y2="' + (y+3) + '"/>';
    svg += '<circle cx="' + v * x + '" cy="5" r="3" fill="black" stroke="black"/></g></svg>'
    return svg;
    
}

function marker_content(d, h) {
    
    var data = '<div class="infowindow">';
    var x = 370 / 6;

    data += '<div id="title">' + d[1] + '</div>';
    data += '<div id="place">' + d[3] + ', ' + d[2] + '</div>';

    for(var i = 4; i < 15; i++) {
        data += '<div id="label">' + h[i] + '</div>';
        data += '<div id="desc">' + hrefs(d[i]) + '</div>';
    }

    var l = labels[0][1];

    for(i = 0; i < 3; i++) {

        data += '<div id="label">' + l[i][0] + '</div>';
        data += '<div id="desc">';

        data += '<table><tbody><tr>';

        data += '<td><div id="label0">' + l[i][1] + '</div></td>';
        var v = parseInt(d[16 + i]);
        svg = drawScale(10, 240, 5, v);

        data += '<td>' + svg + '</td>';

        data += '<td><div id="label1">' + l[i][2] + '</div></td>';


        data += '</tr></tbody></table>';

        data += '</div>';

    }

    var l = labels[1][1];
    
    for(i = 0; i < 3; i++) {

        data += '<div id="label">' + l[i][0] + '</div>';
        data += '<div id="desc">';

        data += '<table><tbody><tr>';

        data += '<td><div id="label0">' + l[i][1] + '</div></td>';
        var v = parseInt(d[19 + i]);
        svg = drawScale(10, 240, 5, v);

        data += '<td>' + svg + '</td>';

        data += '<td><div id="label1">' + l[i][2] + '</div></td>';


        data += '</tr></tbody></table>';

        data += '</div>';

    }

    var l = labels[2][1];

    for(i = 0; i < 4; i++) {

        data += '<div id="label">' + l[i][0] + '</div>';
        data += '<div id="desc">';

        data += '<table><tbody><tr>';

        data += '<td><div id="label0">' + l[i][1] + '</div></td>';
        var v = parseInt(d[21 + i]);
        svg = drawScale(10, 240, 5, v);

        data += '<td>' + svg + '</td>';

        data += '<td><div id="label1">' + l[i][2] + '</div></td>';


        data += '</tr></tbody></table>';

        data += '</div>';

    }

    data += '</div>';
    return data;
    
}

function hrefs(str) {

    if(str == undefined)
        return 'n/a';

    var http = true;
    var p = str.search('http://.*');
    if(p < 0) {
        var q = str.search('www');
        if(q < 0)
            return str;
        else {
            http = false;
        }
    }

    var strs = str.split('\n');
    var res = '';

    for(var i = 0; i < strs.length; i++) {
        var tok = strs[i];
        if(http == true) {
            if(tok.search('http://.*') >= 0) {
                res += '<a href="' + tok + '">' + tok + '</a> <br>';
                continue;
            }
        }
        else if(http == false) {
            if(tok.search('www') >= 0) {
                res += '<a href="http://' + tok + '">' + tok + '</a> <br>';
                continue;
            }
        }

        res += tok + ' ';
    }

    return res;
    
}

function marker_cb(h, d, problematic) {
    var geocoder = new google.maps.Geocoder();
    var pos = geocoder.geocode({'address' : d[1] + ' , ' + d[3] + ' , ' + d[2]},
                            function(res, status) {
                                if(status == google.maps.GeocoderStatus.OK && res.length > 0) {
                                    marker(packLocation(res[0].geometry.location), d, h);
                                } else {
                                    problematic.push(d);
                                }
                            }

                    );
}

var allLocations = new Array();
var span = 0.1;
function packLocation(location) {
    var l = location.lat();
    if( l in allLocations) {
        var n = allLocations[l];
        allLocations[l] = allLocations[l] + 1;
        return new google.maps.LatLng(l + span * Math.random(), location.lng() + span * Math.random());
    } else {
        allLocations[l] = 1;
        return location;
    }
}

function processProblematics(problematic) {
    //alert('Problems');
    for(var i = 0; i < problematic.length; i++){
        //alert(problematic[i][1]);
    }
}

var timeout = 700;
function produceMarkers(map, data) {

    var h = data.head;
    var d = data.data;
    var p = new Array();

    for(var i = 0; i < d.length; i++){
        'i m not interested in information - but in processes and phenomenons'
        var country = d[i][2];
        var city = d[i][3];        
        var markers = new Array();

        setTimeout((function close(k, j, q) {
                    return function() {
                        marker_cb(k, d[j], q);
                    }
                    })(h, i, p),
                    timeout * i);

    }

    setTimeout((function close(q){return function(){processProblematics(q)}})(p), timeout * d.length);

}


function createContentList(r, divparent) {

    var table = document.createElement('table');
    table.setAttribute('id', 'output');
    table.setAttribute('cellspacing', '10');
    var tbody = document.createElement('tbody');
    var tr;

    tr = document.createElement('tr');
    for(var i = 0; i < 27; i++) {
        var td = document.createElement('td');
        td.setAttribute("class", "list-title");
        td.appendChild(document.createTextNode(r.head[i]));
        tr.appendChild(td);
    }
    tbody.appendChild(tr);

    for(i = 0; i < r.data.length; i++) {
        tr = document.createElement('tr');
        for(var j = 0; j < r.data[i].length; j++) {
            var td = document.createElement('td');
            td.setAttribute('class', 'list-element');
            td.appendChild(document.createTextNode(r.data[i][j]));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    document.getElementById(divparent).appendChild(table);

}
