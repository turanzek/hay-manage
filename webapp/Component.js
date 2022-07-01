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
					var app = "createServis";
					var title = "Hakediş Ekleme Süreci";
					break;

				case hash.includes("manageRelease"):
					app = "manageRelease";
					title = "Hakediş Onay Süreci";
					break;

				default:
					break;
			}


			var oModel = new JSONModel();
			this.setModel(oModel);

			// var app = "createRequest";
			// var title = "Malzeme Yaratma Talebi";
			
			var model = new JSONModel();
			this.setModel(model, "application");

			var filters = [new Filter("Guid", FilterOperator.EQ, uid()), new Filter("App", FilterOperator.EQ, app)];

			var busyDialog = new sap.m.BusyDialog({});


			var parameters = {
				async: true,
				filters: filters,
				urlParameters: {
					"$expand": ["DataModel", "DataModel/ApproveSteps", "DataModel/Items","DataModel/ServiceEntries","DataModel/Items/ServiceEntryItems","DataModel/ServiceEntries/Files","DataModel/ServiceEntries/Details/ServiceEntryItems"]
				},
				success: function (data) {

					var applicationModel = this.getModel("application");
					var result = data.results[0]
					result.listCount = result.DataModel.results.length;
					applicationModel.setData(result);
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
