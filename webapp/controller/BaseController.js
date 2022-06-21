/* global $*/
jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/routing/History",
	'jquery.sap.global',
	'jquery.sap.script',
], function (Controller, BusyIndicator, History, jQuery/*jQuerySapScript*/) {
	"use strict";
	return Controller.extend("sap.ui.ttg.smartnew.register.controller.BaseController", {

		// get router object
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		// get global model
		getGlobalModel: function () {
			return this.getOwnerComponent().getModel("global");
		},

		// get busy dialog
		getBusyDialog: function () {

			var that = this;

			if (!this.oBusyDialog)
				this.oBusyDialog = new sap.m.BusyDialog({
					text: that.getOwnerComponent().getModel("i18n").getProperty("messagePleaseWait")
				});

			return that.oBusyDialog;
		},

		// handle back navigation
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},

		// handle navigation to home page
		navToMainPage: function () {
			this.getRouter().navTo("appHome", {}, true /*no history*/);
		},
		hideBusyIndicator: function () {
			BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function () {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},

		//		showServiceErrorMessages : function(messages) {
		//			var that = this;
		//
		//			var messageStrips = [];
		//			for (var i = 0, len = messages.length; i < len; i++) {
		//				if(!(messages[i].message) && (i == 0)){
		//					continue;
		//				}
		//				var strip = new MessageStrip({
		//					text : messages[i].message, 
		//					showIcon : true,
		//					class : "sapUiMediumMarginBottom"
		//				});
		//				switch (messages[i].severity) {
		//				case "error":
		//					strip.setType("Error");
		//					break;
		//				case "success":
		//					strip.setType("Success");
		//					break;
		//				case "info":
		//					strip.setType();
		//					break;
		//				case "warning":
		//					strip.setType("Warning");
		//					break;
		//				}
		//				messageStrips.push(strip);
		//			}
		//			var dialog = new Dialog({
		//				title : "{i18n>dialogMessageListHeaderHata}",
		//				content : messageStrips,
		//				beginButton : new Button({
		//					text : "{i18n>close}",
		//					press : function(evt) {
		//						dialog.close();
		//					}
		//				}),
		//				afterClose : function() {
		//					dialog.destroy();
		//				}
		//			});
		//			this.getView().addDependent(dialog);
		//			dialog.open();
		//		},
		// display any custom message to user
		displayMessage: function (data) {

			jQuery.sap.require("sap.m.MessageBox");

			var that = this;

			var oIcon, sTitle;

			switch (data.TYPE) {
				case "S": oIcon = sap.m.MessageBox.Icon.SUCCESS; break;
				case "I": oIcon = sap.m.MessageBox.Icon.INFORMATION; break;
				case "E": oIcon = sap.m.MessageBox.Icon.ERROR; break;
				case "W": oIcon = sap.m.MessageBox.Icon.WARNING; break;
				default: break;
			}

			sap.m.MessageBox.show(data.MESSAGE, {
				icon: oIcon,
				title: sTitle,
				actions: [sap.m.MessageBox.Action.OK]

			});

		},

		getI18NText(keyField) {
			return this.getOwnerComponent().getModel("i18n").getProperty(keyField);
		}
	});
});