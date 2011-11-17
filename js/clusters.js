function Clusters(casesList) {
	$("#clusters .sidebar").html(
		$("#caseDetails").render(casesList[0])
	);
}