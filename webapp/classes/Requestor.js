sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/List",
	"sap/m/StandardListItem",
	"gubretas/mm/hay/classes/Helper",
	"sap/m/TextArea"
], function (Object,
	JSONModel,
	Controller,
	MessageToast,
	MessageBox,
	Dialog,
	Label,
	Button,
	library,
	List,
	StandardListItem,
	Helper,
	TextArea
) {

	var ButtonType = library.ButtonType;
	var serviceUrl = (function () {

		var apiUrl = "";

		switch (true) {
			case window.location.hostname.includes("localhost"):
				apiUrl = "http://127.0.0.1:5000/api";
				break;
			default:
				apiUrl = "https://route-planner-server.herokuapp.com/api"
				break;
		}

		return apiUrl;
	})();

	var Backend = Object.extend("gubretas.mm.hay.classes.Backend", {

		oBusyDialog: new sap.m.BusyDialog("apiDialog"),
		initApplicationData: function (type, endpoint, data) {

			this.oBusyDialog.open();

			return jQuery.ajax({
				type: type,
				url: serviceUrl + endpoint,
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(data),
				beforeSend: function (xhr) {
					let token = localStorage.getItem('token')
					xhr.setRequestHeader('Authorization', `Bearer ${(token ? token : '')}`);
				},
				success: function (result) {
					this.oBusyDialog.close();
					console.log(`Success response ${type}  ${data} ` + data + " " + result);
				}.bind(this),
				error: this.errorHandler.bind(this)
			});
		},

		errorHandler: function (jqXHR) {
			this.oBusyDialog.close();

			console.log(jqXHR.status, jqXHR.responseJSON)
			if (jqXHR.status === 401) {
				return
			}

			var errorType = undefined;

			if (jqXHR && jqXHR.hasOwnProperty("responseJSON") && jqXHR.responseJSON) {

				if (jqXHR.responseJSON.hasOwnProperty("message") && jqXHR.responseJSON.message) {
					errorType = "messageError"
				}

				if (jqXHR.responseJSON.hasOwnProperty("message_table") &&
					jqXHR.responseJSON.return_table.length > 0) {
					errorType = "dialogError"
				}
			}

			if (!errorType) {
				errorType = "technicalError";
			}

			switch (errorType) {
				case "technicalError":
					MessageBox.error("Teknik hata oluştu.Sistem yöneticisine başvurun", {
						title: ""
					})
					break;
				case "dialogError":
					this._errorPopup(jqXHR.responseJSON.message_table)
					break;
				case "messageError":
					MessageBox.error(jqXHR.responseJSON.message, {
						title: "",
					});
					break;
				default:
					break;
			}
		},
		_errorPopup: function (messages) {

			var infoState = "";
			var info = "";
			var list = new List();


			for (var k = 0; k < messages.length; k++) {
				var message = messages[k];

				switch (message.type) {
					case "E":
						infoState = "Error";
						info = "Hatalı";
						break;
					case "S":
						infoState = "Success";
						info = "Başarılı";
						break;
					case "W":
						infoState = "Warning";
						info = "Uyarı";
						break;
					default:
						break;
				}

				list.addItem(new StandardListItem({
					title: message.message,
					infoState: infoState,
					info: info,
					wrapping: true
				}))
			}

			var oDialog = new Dialog({
				title: 'Hata Mesajları',
				type: 'Message',
				contentWidth: "720px",
				contentHeight: "440px",
				content: [
					list
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: 'Tamam',
					press: function () {
						oDialog.close();
						oDialog.destroy();
					}.bind(this)
				}),
				afterClose: function () {
					oDialog.close();
					oDialog.destroy();
				}.bind(this)
			});

			oDialog.open();
		},
	});

	return Backend;
});