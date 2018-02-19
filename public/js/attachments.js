$(document).ready(function() {
	$('input[name="attachments[]"]').unbind('change').change(function() {
		var files = this.files;
		$(files).each(function() {
			var name = this.name;
			var div = '<div class="col-md-12 row"><div class="col-md-6">' + name + '</div><div class="col-md-6"><progress class="progress" name="' + name + '" value="0"></progress></div></div></div>';
			$('.current-uploading').append(div);

			var progress = $('progress[name="' + name + '"]');
			var formData = new FormData();
			formData.append('attachment', this);

			$.ajax({
				type: 'POST',
				url: $('input[name="attachments[]"]').attr('data-target'),
				data: formData,
				xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) {
						myXhr.upload.addEventListener('progress', function(e) {
							if (e.lengthComputable) {
								$('.progress[name="' + name + '"]').val(e.loaded / e.total);
							}
						}, false);
					}
					return myXhr;
				},
				contentType: false,
				processData: false,
				success: function(data) {
					data = JSON.parse(data);
					var parent = $(progress).parent().html("<span class='alert-success'>Upload</span>");
					var button_remove = "<div class='btn btn-sm btn-danger' onclick='remove($(this));'><i class='fa fa-trash'></i></div>"
					var tr = "<tr class='attachment' data-file='" + data.file + "' data-name='" + data.name + "' data-nbPages='" + data.nbPages + "'><td>" + data.name + "</td><td>" + data.nbPages + "</td><td>" + button_remove + "</td></tr>";
					$('table[name="attachments"] tbody').append(tr);
					refreshPreviewMail();
					setTimeout(function() {
						$(parent).closest('.row').remove();
					}, 5000, parent);
				},
				error: function(data) {
					var parent = $(progress).parent().html("<span class='alert-danger'>Fail</span>");
					setTimeout(function() {
						$(parent).closest('.row').remove();
					}, 10000, parent);
				}
			});

		});
	});
});


function remove(element) {
	$(element).closest('tr').remove();
	refreshPreviewMail();
}
