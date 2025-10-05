$(document).ready(function () {

    $('.glyphicon-calendar').closest("div.date").datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: false,
        format: 'dd/mm/yyyy',
        autoclose: true,
        language: 'pt-BR',
    });

    $('#form').validate({
        rules: {
            Assunto: {
                required: true,
                maxlength: 25
            },
            Solicitante: {
                required: true,
                maxlength: 15
            },
            IdDepartamento: {
                required: true
            },
            DataAbertura: {
                required: true
            }
        },
        messages: {
            Assunto: {
                required: "O assunto é obrigatório",
                maxlength: "O assunto deve ter no máximo 25 caracteres"
            },
            Solicitante: {
                required: "O solicitante é obrigatório",
                maxlength: "O solicitante deve ter no máximo 15 caracteres"
            },
            IdDepartamento: {
                required: "O departamento é obrigatório"
            },
            DataAbertura: {
                required: "A data de abertura é obrigatória",
                date: "Por favor, informe uma data válida"
            }
        },
        errorElement: 'span',
        errorClass: 'text-danger',
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        }
    });

    $('#btnCancelar').click(function () {
        Swal.fire({
            html: "Deseja cancelar essa operação? O registro não será salvo.",
            type: "warning",
            showCancelButton: true,
        }).then(function (result) {
            if (result.value) {
                history.back();
            } else {
                console.log("Cancelou a inclusão.");
            }
        });
    });

    $('#btnSalvar').click(function () {

        if ($('#form').valid() != true) {
            FormularioInvalidoAlert();
            return;
        }

        let chamado = SerielizeForm($('#form'));
        let url = $('#form').attr('action');
        //debugger;

        $.ajax({
            type: "POST",
            url: url,
            data: chamado,
            success: function (result) {

                Swal.fire({
                    type: result.Type,
                    title: result.Title,
                    text: result.Message,
                }).then(function () {
                    window.location.href = config.contextPath + result.Controller + '/' + result.Action;
                });

            },
            
            error: function (xhr) {
                let errorMessage = 'Ocorreu um erro ao processar a requisição';

                // Tenta pegar a mensagem do responseJSON primeiro
                if (xhr.responseJSON) {
                    errorMessage = xhr.responseJSON.message ||
                        xhr.responseJSON.Message ||
                        JSON.stringify(xhr.responseJSON);
                } else if (xhr.responseText) {
                    errorMessage = xhr.responseText;
                }

                Swal.fire({
                    title: 'Erro',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            },
        });
    });

});
