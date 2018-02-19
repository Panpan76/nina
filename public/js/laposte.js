$(document).ready(function() {
	$('input[name="ville"]').change(function() {
		chercheVille($(this).val());
	});
	$('input[name="code_postal"]').change(function() {
		chercheCP($(this).val());
	});
});

function chercheCP(val) {
	var data = {};
	data.dataset = 'laposte_hexasmal';
	data.lang = 'fr';
	data.q = 'code_postal=' + val;
	data.format = 'json';
	data.rows = 50;
	$.get('https://datanova.laposte.fr/api/records/1.0/search/', data, function(data) {
		$('#villes').empty();
		for (var i = 0; i < data.records.length; i++) {
			var ville_name = data.records[i].fields.nom_de_la_commune;
			var cp = data.records[i].fields.code_postal;
			var option = '<option value="' + ville_name + '">' + cp + ' - ' + ville_name + '</option>';
			$('#villes').append(option);
		}
	});
	verif();
}

function chercheVille(val) {
	var data = {};
	data.dataset = 'laposte_hexasmal';
	data.lang = 'fr';
	data.q = 'nom_de_la_commune=' + val;
	data.format = 'json';
	data.rows = 50;
	$.get('https://datanova.laposte.fr/api/records/1.0/search/', data, function(data) {
		$('#cps').empty();
		for (var i = 0; i < data.records.length; i++) {
			var ville_name = data.records[i].fields.nom_de_la_commune;
			var cp = data.records[i].fields.code_postal;
			var option = '<option value="' + cp + '"/>';
			$('#cps').append(option);
		}
	});
	verif();
}

function verif() {
	$('input[name="ville"]').removeClass('is-valid');
	$('input[name="ville"]').removeClass('is-invalid');
	$('input[name="code_postal"]').removeClass('is-valid');
	$('input[name="code_postal"]').removeClass('is-invalid');
	$('input[name="ville"]').val($('input[name="ville"]').val().toUpperCase());
	var data = {};
	data.dataset = 'laposte_hexasmal';
	data.lang = 'fr';
	data.q = 'code_postal=' + $('input[name="code_postal"]').val() + ' AND nom_de_la_commune=' + $('input[name="ville"]').val();
	data.format = 'json';
	data.rows = 50;
	$.get('https://datanova.laposte.fr/api/records/1.0/search/', data, function(data) {
		// Obligé de revérifier le nom de la ville car on a bien 1 seul résultat quand le nom de la commune comporte un espace
		if (data.records.length == 1 && data.records[0].fields.nom_de_la_commune == $('input[name="ville"]').val()) {
			$('input[name="ville"]').addClass('is-valid');
			$('input[name="code_postal"]').addClass('is-valid');
		} else {
			$('input[name="ville"]').addClass('is-invalid');
			$('input[name="code_postal"]').addClass('is-invalid');
		}
	});
}
