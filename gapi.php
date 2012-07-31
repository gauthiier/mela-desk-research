<?php

set_include_path("./lib");
require_once 'gapi_user.php';
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets_DocumentQuery');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets_ListQuery');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');

try {
  $action = $_POST['action'];

  // connect to API
  $service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
  $client = Zend_Gdata_ClientLogin::getHttpClient($user, $pass, $service);
  $service = new Zend_Gdata_Spreadsheets($client);

  //find out what's the id of the first worksheet
  $query = new Zend_Gdata_Spreadsheets_DocumentQuery();
  $query->setSpreadsheetKey($_POST['spreadsheet']);
  $feed = $service->getWorksheetFeed($query);
  $currWkshtId = explode('/', $feed->entries[0]->id->text);
  $firstWorksheet = $currWkshtId[8];

  // set target spreadsheet and worksheet
  $ssKey = $_POST['spreadsheet'];
  $wsKey = $firstWorksheet;

  // create row content
  $rowData = $_POST['data'];

  if ($action == "add") {
    $entryResult = $service->insertRow($rowData, $ssKey, $wsKey);
    echo 'The ID of the new row entry is: ' . $entryResult->id;
  }
  else if ($action == "update") {
    $query = new Zend_Gdata_Spreadsheets_ListQuery();
    $query->setSpreadsheetKey($ssKey);
    $query->setWorksheetId($wsKey);
    $query->setSpreadsheetQuery('id='.$rowData['id']);
    $listFeed = $service->getListFeed($query);

    //remove escape characters
    foreach($rowData as $field => $value) {
      $rowData[$field] = preg_replace("/[\\\]+/", "", $rowData[$field]);
    }
    $rowToUpdate = $listFeed->offsetGet(0);
    $entryResult = $service->updateRow($rowToUpdate, $rowData);
    echo 'Updating row ' . $rowData['id'] . '\n';
    echo 'The ID of the updated row entry is: ' . $entryResult->id;
  }
  else if ($action == "delete") {


    $query = new Zend_Gdata_Spreadsheets_ListQuery();
    $query->setSpreadsheetKey($ssKey);
    $query->setWorksheetId($wsKey);
    $query->setSpreadsheetQuery('id='.$rowData['id']);
    $listFeed = $service->getListFeed($query);

    $rowToUpdate = $listFeed->offsetGet(0);
    $entryResult = $service->deleteRow($rowToUpdate);
    echo 'Deleting row ' . $rowData['id'] . '\n';
  }
  else {
    echo "Unknown request";
  }
} catch (Exception $e) {
  die('ERROR: ' . $e->getMessage());
}


?>