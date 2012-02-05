//-- data labels ---------------------------------------------------------------

function decorate(melacase) {
	melacase.timestamp = melacase.data.col_A;	
  melacase.nameoftheinstitutionorganisation = melacase.data.col_B;
  melacase.country = melacase.data.col_C;
  melacase.city = melacase.data.col_D;
  melacase.typeofinstitutionorganisation = melacase.data.col_E;
  melacase.links = melacase.data.col_F;
  melacase.name = melacase.data.col_G;
  melacase.year = melacase.data.col_H;
  melacase.namecontactofcuratororganizer = melacase.data.col_I;
  melacase.links_2 = melacase.data.col_J;
  melacase.description = melacase.data.col_K;
  melacase.focusoftechnology = melacase.data.col_L;
  melacase.targetgroup = melacase.data.col_M;
  melacase.whyisitofinterest = melacase.data.col_N;
  melacase['impact-userperspective'] = melacase.data.col_O;
  melacase['impact-institutionorganisationperspective'] = melacase.data.col_P;
  melacase.audienceinvolvment = melacase.data.col_Q;
  melacase.audienceengagement = melacase.data.col_R;
  melacase.audienceperception = melacase.data.col_S;
  melacase.exhibitionelements = melacase.data.col_T;
  melacase.technologymetaphor = melacase.data.col_U;
  melacase.technologycontext = melacase.data.col_V;
  melacase.identityconstruction = melacase.data.col_W;
  melacase.representation = melacase.data.col_X;
  melacase.historicalperspective = melacase.data.col_Y;
  melacase.stance = melacase.data.col_Z;
  melacase.multinationalism = melacase.data.col_AA;
  melacase.affiliation = melacase.data.col_AB;
}

var columnList = [
  'timestamp', 'Time stamp',
  'nameoftheinstitutionorganisation', 'Institution',
  'country', 'Country',
  'city', 'City',
  'typeofinstitutionorganisation', 'Type of institution',
  'links', 'Links',
  'name', 'Name',
  'year', 'Year',
  'namecontactofcuratororganizer', 'Curator',
  'links_2', 'Links 2',
  'description', 'Description',
  'focusoftechnology', 'Focus of technology',
  'targetgroup', 'Target group',
  'whyisitofinterest', 'Why is it of interest?',
  'impact-userperspective', 'User perspective', 
  'impact-institutionorganisationperspective', 'Institution perspective',
  'audienceinvolvment', 'Audience involvment',
  'audienceengagement', 'Audience engagement',
  'audienceperception', 'Audience percpetion',
  'exhibitionelements', 'Exhibition elements',
  'technologymetaphor', 'Technology metaphor',
  'technologycontext', 'Technology context',
  'identityconstruction', 'Identity construction',
  'representation', 'Representation',
  'historicalperspective', 'Historical perspective',
  'stance', 'Stance',
  'multinationalism', 'Multinationalism',
  'affiliation', 'Affiliation'
];

var columnLabels = {
  'audienceinvolvment' : ['passive', 'active', 'Measure of the cases in terms of how much interaction (physical or otherwise) they expect or require.'],
  'audienceengagement' : ['individual', 'collective', 'Measure of the cases in terms of the intention or actuality of them to be experience by many people simultaneously, or by one individual at a time.'],
  'audienceperception' : ['immersive', 'reflective', 'Measure of the cases in terms of physical or cognitively engaging it is intended to be.  We place in opposition here tendencies towards "artistic" or "interpretive" forms, versus more informational, pedagogic or didactic strategies.'],
  'exhibitionelements' : ['object', 'virtual', 'Measure of the cases as to their predominantly digital, simulated, distributed features, as opposed to physical, bodily and situated applications.'],
  'technologymetaphor' : ['tool', 'map', 'Measure of the cases in terms of the facility they give audiences or users to explore or "probe" an informational or factual landscape.  This is juxtaposed to a tendency to use technologies to help situate users or audiences within this same landscape or field.'],
  'technologycontext' : ['mobile', 'stationary', 'Measure of the cases in terms of their ability to be translated, transported or movable by users or audiences.'],
  'identityconstruction' : ['personal', 'institutional', 'Measure of the cases in terms of thier capacity to reflect the opinions, experience or narratives of individual, or whether they articulates a more systematic, impersonal and formal inclination.'],
  'representation' : ['minority', 'majority', 'Measure of the cases in terms of the intention or actuality to project the views, histories, artifacts or particulars of a marginalised, minority or little know outlook or approach.'],
  'historicalperspective' : ['contempory', 'historical', 'Measure of the cases in terms of their historical emphasis.  Do they project a contemporary world view (recent events, news, accounts) in some way, or are ideas projected through a more traditionally historical viewpoint?'],
  'stance' : ['conservative', 'historical', 'Measure of the cases in terms of he degree to which they attempt to become an "agent for change", putting forward a new, challenging or provocative worldview.'],
  'multinationalism' : ['trans-national', 'national', 'Measure of the cases in terms of their emphasis or attitude towards nationalism and patriotism, opposed here to a more international or global frame of mind.']
}

var columnCategories = {
  'Categorization - User Experience' : ['audienceinvolvment', 'audienceengagement', 'audienceperception'],
  'Categorization - Exhibition Design, Technology Strategies / Methods' : ['exhibitionelements', 'technologymetaphor', 'technologycontext'],
  'Categorization - Institution / Organisation Purpose': ['identityconstruction', 'representation', 'historicalperspective', 'stance', 'multinationalism']
}
            
var docID = '0AlbpHfWQ4qzxdHRRaHUwREgxTlJUR0d6V3QwbENnUGc';