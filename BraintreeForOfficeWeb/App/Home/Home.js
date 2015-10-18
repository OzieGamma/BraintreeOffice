/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            var publicKey = Office.context.document.settings.get("public_key");
            var privateKey = Office.context.document.settings.get("private_key");
            var merchant = Office.context.document.settings.get("merchant");
            var from = Office.context.document.settings.get("from");
            var to = Office.context.document.settings.get("to");

            $("#public_key").val(publicKey);
            $("#private_key").val(privateKey);
            $("#merchant").val(merchant);
            $("#from").val(from);
            $("#to").val(to);

            $("#public_key").change(function () {
                Office.context.document.settings.set("public_key", $("#public_key").val());
                Office.context.document.settings.saveAsync(function () { });
            });

            $("#private_key").change(function () {
                Office.context.document.settings.set("private_key", $("#private_key").val());
                Office.context.document.settings.saveAsync(function () { });
            });
            $("#merchant").change(function () {
                Office.context.document.settings.set("merchant", $("#merchant").val());
                Office.context.document.settings.saveAsync(function () { });
            });
            $("#from").change(function () {
                Office.context.document.settings.set("from", $("#from").val());
                Office.context.document.settings.saveAsync(function () { });
            });
            $("#to").change(function () {
                Office.context.document.settings.set("to", $("#to").val());
                Office.context.document.settings.saveAsync(function () { });
            });
            $('#insert-data').click(insertData);
        });
    };

    function completed(xhr, textStatus) {
        app.closeNotification();

        var answer = JSON.parse(xhr.responseText);

        var table = new Office.TableData();
        table.headers = ['Id', 'MerchantAccountId', 'Status', 'Amount', 'TaxAmount', 'CreatedAt', 'CurrencyIsoCode'];
        var matrix = [];

        for (var transaction in answer) {
            if (answer.hasOwnProperty(transaction)) {
                if (answer[transaction].TaxAmount === null) {
                    answer[transaction].TaxAmount = 0;
                }

                var row = [answer[transaction].Id, answer[transaction].MerchantAccountId, answer[transaction].Status, answer[transaction].Amount, answer[transaction].TaxAmount, new Date(answer[transaction].CreatedAt), answer[transaction].CurrencyIsoCode];
                matrix.push(row);
            }
        }

        table.rows = matrix;

        Office.context.document.setSelectedDataAsync(table,
            { coercionType: Office.CoercionType.Table },
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    app.showNotification('Data successfully inserted');
                } else {
                    app.showNotification('Error:', result.error.message);
                }
            }
        );
    }

    // Reads data from current document selection and displays a notification
    function insertData() {
        var publicKey = $("#public_key").val();
        var privateKey = $("#private_key").val();
        var merchant = $("#merchant").val();
        var from = new Date($("#from").val()).getTime();
        var to = new Date($("#to").val()).getTime();

        if (!publicKey || !privateKey || !merchant || !from || !to) {
            app.showNotification('Error:', "Please fill in connection and search data");
        } else {


            var q = "pub=" + publicKey + "&priv=" + privateKey + "&merchant=" + merchant + "&from=" + from + "&to=" + to;

            app.showNotification('Downloading...');

            $.ajax({
                url: "/api/Braintree?" + q,
                type: "GET",
                contentType: "application/json",
                data: "",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("ACCEPT", "application/json");
                },
                complete: completed
            });
        }

    }
})();