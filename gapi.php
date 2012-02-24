<?php

set_include_path("./lib");
  
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets_DocumentQuery');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets_ListQuery');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');

// set credentials for ClientLogin authentication
$user = "woodenboxmadeoutofplastic@gmail.com";
$pass = "plasticisfantastic";

try {
  $action = $_GET['action'];
  
  // connect to API
  $service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
  $client = Zend_Gdata_ClientLogin::getHttpClient($user, $pass, $service);
  $service = new Zend_Gdata_Spreadsheets($client);
  
  //find out what's the id of the first worksheet
  $query = new Zend_Gdata_Spreadsheets_DocumentQuery(); 
  $query->setSpreadsheetKey($_GET['spreadsheet']); 
  $feed = $service->getWorksheetFeed($query); 
  $currWkshtId = explode('/', $feed->entries[0]->id->text); 
  $firstWorksheet = $currWkshtId[8];

  // set target spreadsheet and worksheet
  $ssKey = $_GET['spreadsheet'];
  $wsKey = $firstWorksheet;
  
  //list column names
  //$query = new Zend_Gdata_Spreadsheets_ListQuery();
  //$query->setSpreadsheetKey($ssKey);
  //$query->setWorksheetId($wsKey);
  //$listFeed = $service->getListFeed($query);
  //$rowData = $listFeed->entries[1]->getCustom();
  //foreach($rowData as $customEntry) {
  //  echo $customEntry->getColumnName() . ", ";
  //}
  
  // create row content
  $rowData = $_GET['data'];
  
  if ($action == "add") {
    $entryResult = $service->insertRow($rowData, $ssKey, $wsKey);
    echo 'The ID of the new row entry is: ' . $entryResult->id;      
  }
  else if ($action == "update") {
    $rowId = $_GET['row'];      
    $query = new Zend_Gdata_Spreadsheets_ListQuery();
    $query->setSpreadsheetKey($ssKey);
    $query->setWorksheetId($wsKey);
    $listFeed = $service->getListFeed($query);  

    $rowToUpdate = $listFeed->offsetGet($rowId-2);
    $entryResult = $service->updateRow($rowToUpdate, $rowData);    
    echo 'The ID of the updated row entry is: ' . $entryResult->id;        
  }
  else {
    echo "ApacheRequest";
  }        
} catch (Exception $e) {
  die('ERROR: ' . $e->getMessage());
}


?>