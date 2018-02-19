$(document).ready(function() {
	$('a.nav-link').click(function() {
		setTimeout(function() {
			refreshPreviewMail()
		}, 200);
	});
	$('input, select').change(function() {
		refreshPreviewMail();
	});
	refreshPreviewMail();
});

function save(mail) {
	if (verifForm()) {
		var data = $('form').serializeArray();
		var p = {};
		$('fieldset.paragraph').each(function() {
			var paragraph_id = $(this).attr('data-id');
			var v = {};
			$(this).children('div.var').each(function() {
				var variable_id = $(this).attr('data-id');
				v[variable_id] = $(this).find('input').val();
			});
			p[paragraph_id] = v;
		});
		data.push({
			name: 'paragraphs[]',
			value: JSON.stringify(p)
		});

		if (typeof mail !== 'undefined') {
			data.push({
				name: 'mail',
				value: mail
			});
		}

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: $('div[name="save"]').attr('data-target'),
			data: data,
			success: function(data) {
				console.log(data);
			}
		});
	} else {
		alert('pas ok');
	}
}

function verifForm() {
	$('input, select').removeClass('is-valid').removeClass('is-invalid');
	if ($('a[href="#tab-company"]').hasClass('active')) {

		$('input[name="raison_sociale"]').val($('input[name="raison_sociale"]').val().toUpperCase());
		$('input[name="service"]').val($('input[name="service"]').val().toUpperCase());

		if ($('input[name="raison_sociale"]').val().length <= 38) {
			$('input[name="raison_sociale"]').addClass('is-valid');
		} else {
			$('input[name="raison_sociale"]').addClass('is-invalid');
		}

		if ($('input[name="service"]').val().length <= 38) {
			$('input[name="service"]').addClass('is-valid');
		} else {
			$('input[name="service"]').addClass('is-invalid');
		}

	} else {

		$('input[name="nom"]').val($('input[name="nom"]').val().toUpperCase());
		$('input[name="prenom"]').val($('input[name="prenom"]').val().toUpperCase());
		$('input[name="appartement"]').val($('input[name="appartement"]').val().toUpperCase());
		$('input[name="etage"]').val($('input[name="etage"]').val().toUpperCase());

		if (($('select[name="civilite"]').val().length + $('input[name="nom"]').val().length + $('input[name="prenom"]').val().length) <= 38) {
			$('select[name="civilite"]').addClass('is-valid');
			$('input[name="nom"]').addClass('is-valid');
			$('input[name="prenom"]').addClass('is-valid');
		} else {
			$('select[name="civilite"]').addClass('is-invalid');
			$('input[name="nom"]').addClass('is-invalid');
			$('input[name="prenom"]').addClass('is-invalid');
		}

		if (($('input[name="appartement"]').val().length + $('input[name="etage"]').val().length + 5) <= 38) {
			$('input[name="appartement"]').addClass('is-valid');
			$('input[name="etage"]').addClass('is-valid');
		} else {
			$('input[name="appartement"]').addClass('is-invalid');
			$('input[name="etage"]').addClass('is-invalid');
		}

	}

	$('input[name="residence"]').val($('input[name="residence"]').val().toUpperCase());
	$('input[name="adresse"]').val($('input[name="adresse"]').val().toUpperCase());
	$('input[name="complement_adresse"]').val($('input[name="complement_adresse"]').val().toUpperCase());
	$('input[name="ville"]').val($('input[name="ville"]').val().toUpperCase());

	if ($('input[name="residence"]').val().length <= 38) {
		$('input[name="residence"]').addClass('is-valid');
	} else {
		$('input[name="residence"]').addClass('is-invalid');
	}

	if ($('input[name="adresse"]').val().length <= 38) {
		$('input[name="adresse"]').addClass('is-valid');
	} else {
		$('input[name="adresse"]').addClass('is-invalid');
	}

	if ($('input[name="complement_adresse"]').val().length <= 38) {
		$('input[name="complement_adresse"]').addClass('is-valid');
	} else {
		$('input[name="complement_adresse"]').addClass('is-invalid');
	}

	if (($('input[name="code_postal"]').val().length + $('input[name="ville"]').val().length) <= 38) {
		$('input[name="code_postal"]').addClass('is-valid');
		$('input[name="ville"]').addClass('is-valid');
	} else {
		$('input[name="code_postal"]').addClass('is-invalid');
		$('input[name="ville"]').addClass('is-invalid');
	}

	return $('input.is-invalid, select.is-invalid').length == 0;
}

function refreshPreviewMail() {
	var data = {
		'adresse': {}
	};
	if ($('a[href="#tab-company"]').hasClass('active')) {
		data.adresse.ligne1 = {};
		data.adresse.ligne1.raison_sociale = $('input[name="raison_sociale"]').val().toUpperCase();
		if ($('input[name="service"]').val().length > 0) {
			data.adresse.ligne2 = {};
			data.adresse.ligne2.service = $('input[name="service"]').val().toUpperCase();
		}
	} else {
		data.adresse.ligne1 = {};
		data.adresse.ligne2 = {};
		if ($('select[name="civilite"]').val().length > 0) {
			data.adresse.ligne1.civilite = $('select[name="civilite"]').val();
		}
		if ($('input[name="nom"]').val().length > 0) {
			data.adresse.ligne1.nom = $('input[name="nom"]').val().toUpperCase();
		}
		if ($('input[name="prenom"]').val().length > 0) {
			data.adresse.ligne1.prenom = $('input[name="prenom"]').val().toUpperCase();
		}
		if ($('input[name="appartement"]').val().length > 0) {
			data.adresse.ligne2.appartement = $('input[name="appartement"]').val().toUpperCase();
		}
		if ($('input[name="etage"]').val().length > 0) {
			data.adresse.ligne2.etage = $('input[name="etage"]').val();
		}
	}

	if ($('input[name="residence"]').val().length > 0) {
		data.adresse.ligne3 = {};
		data.adresse.ligne3.residence = $('input[name="residence"]').val().toUpperCase();
	}
	if ($('input[name="adresse"]').val().length > 0) {
		data.adresse.ligne4 = {};
		data.adresse.ligne4.adresse = $('input[name="adresse"]').val().toUpperCase();
	}
	if ($('input[name="complement_adresse"]').val().length > 0) {
		data.adresse.ligne5 = {};
		data.adresse.ligne5.complement = $('input[name="complement_adresse"]').val().toUpperCase();
	}
	if ($('input[name="code_postal"]').val().length > 0 && $('input[name="ville"]').val().length > 0) {
		data.adresse.ligne6 = {};
		data.adresse.ligne6.code_postal = $('input[name="code_postal"]').val();
		data.adresse.ligne6.ville = $('input[name="ville"]').val().toUpperCase();
	}

	data.paragraphs = {};
	$('fieldset.paragraph').each(function() {
		var paragraph_id = $(this).attr('data-id');
		data.paragraphs[paragraph_id] = {};
		$(this).children('div.var').each(function() {
			var variable_id = $(this).attr('data-id');
			data.paragraphs[paragraph_id][variable_id] = $(this).find('input').val();
		});
	});

	if ($('input[name="with-attachments"]:checked').length) {
		data.attachments = {};
		var n = 0;
		$('table[name="attachments"] tr').each(function() {
			var attachment = $(this).attr('data-file');
			data.attachments[n] = attachment;
			n++;
		});
	}

	$('iframe').attr('src', $('iframe').attr('data-wait'));

	$.post($('iframe').attr('data-src'), data, function(data) {
		data = JSON.parse(data);
		$('iframe').attr('src', $('iframe').attr('data-render') + '/' + data.name);
	});
}
