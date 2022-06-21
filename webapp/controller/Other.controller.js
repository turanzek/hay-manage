sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("gubretas.mm.hay.controller.Other", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
		},
		handleClose: function () {
			window.history.go(-1);
		},
		onBack: function () {
			window.history.go(-1);
		}
	});
});
