sap.ui.define([
	"sap/base/util/UriParameters",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet",
	"sap/ushell/services/UserInfo",
	"sap/base/util/uid"
], function (UriParameters, UIComponent, JSONModel, library, FlexibleColumnLayoutSemanticHelper, Filter,
	FilterOperator,
	MessageBox,
	Button,
	Text,
	Dialog,
	MessageToast,
	Spreadsheet,
	CustomLaunchpad,
	uid
) {
	"use strict";

	var LayoutType = library.LayoutType;

	var Component = UIComponent.extend("gubretas.mm.hay.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			this._initApplication();


			this.getRouter().initialize();
		},
		refreshApplication: function () {
			this._initApplication();
		},
		_initApplication: function () {
			var hashObject = new sap.ui.core.routing.HashChanger();
			var hash = hashObject.getHash();

			switch (true) {
				case hash.includes("createRequest"):
					var app = "createRequest";
					var title = "Malzeme Yaratma Talebi";
					break;
				case hash.includes("changeRequest"):
					app = "changeRequest";
					title = "Malzeme Değiştirme Talebi";
					break;
				case hash.includes("expandRequest"):
					app = "expandRequest";
					title = "Malzeme Genişletme Talebi";
					break;
				case hash.includes("deleteRequest"):
					app = "deleteRequest";
					title = "Malzeme Silme İşareti Talebi";
					break;
				case hash.includes("manageRelease"):
					app = "manageRelease";
					title = "Malzeme Anaveri Yönetim Süreci";
					break;

				default:
					break;
			}


			this.getService("ShellUIService").then(
				function (oService) {
					oService.setTitle(title);
				}.bind(this),
				function (oError) {
					jQuery.sap.log.error("Cannot get ShellUIService", oError);
				}
			);

			if (location.href.includes("localhost")) {
				app = "createRequest";
			}
			var oModel = new JSONModel();
			this.setModel(oModel);


			var model = new JSONModel();
			this.setModel(model, "application");

			var filters = [new Filter("Guid", FilterOperator.EQ, uid()), new Filter("App", FilterOperator.EQ, app)];

			var busyDialog = new sap.m.BusyDialog({});


			var parameters = {
				async: true,
				filters: filters,
				urlParameters: {
					"$expand": ["DataModel", "DataModel/Plants", "DataModel/Storages", "DataModel/SupplierCodes", "DataModel/Equipments", "DataModel/Valuations", "DataModel/ApproveSteps", "DataModel/Actions", "DataModel/ActiveValues", "DataModel/Files", "DataModel/ActiveValues/Plants", "DataModel/ActiveValues/Storages", "DataModel/ActiveValues/SupplierCodes", "DataModel/ActiveValues/Valuations", "DataModel/ActiveValues/Equipments"]
				},
				success: function (data) {

					var applicationModel = this.getModel("application");
					applicationModel.setData(data.results[0]);
					busyDialog.close();

				}.bind(this),
				error: function (error) {
					busyDialog.close();
				}.bind(this)
			};

			busyDialog.open();
			this.getModel("mainModel").read("/ApplicationSet", parameters);
		},
		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = UriParameters.fromQuery(location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
	});
	return Component;
});
