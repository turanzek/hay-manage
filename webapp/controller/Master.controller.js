sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"gubretas/mm/hay/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	"sap/base/util/uid"
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, uid) {
	"use strict";

	return BaseController.extend("gubretas.mm.hay.controller.Master", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;

			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
		},
		onListItemPress: function (oEvent) {

			// BusyIndicator.show();

			this.showBusyIndicator(50, 0);
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				itemPath = oEvent.getSource().getSelectedItem().getBindingContext("application").getPath(),
				itemNo = itemPath.split("/").slice(-1).pop();




			this.oRouter.navTo("detail", { layout: oNextUIState.layout, itemNo: itemNo });
		},
		onSearch: function (oEvent) {
			// var oTableSearchState = [],
			// 	sQuery = oEvent.getParameter("query");

			// if (sQuery && sQuery.length > 0) {
			// 	oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			// }

			// this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");

			// if (oEvent.getParameters().refreshButtonPressed) {
			// Search field's 'refresh' button has been pressed.
			// This is visible if you select any master list item.
			// In this case no new search is triggered, we only
			// refresh the list binding.
			// this.onRefresh();
			// return;
			// }

			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				var aFilters = [],
					oFilter1, oFilter2, oFilter3, oFilter4;

				oFilter1 = new Filter({
					path: "RequesNo",
					operator: FilterOperator.Contains,
					value1: sQuery
				});

				aFilters.push(oFilter1);

				oFilter2 = new Filter({
					path: "Matnr",
					operator: FilterOperator.Contains,
					value1: sQuery
				});

				aFilters.push(oFilter2);


				oFilter3 = new Filter({
					path: "StatusText",
					operator: FilterOperator.Contains,
					value1: sQuery
				});

				aFilters.push(oFilter3);


				oFilter4 = new Filter({
					path: "Maktx",
					operator: FilterOperator.Contains,
					value1: sQuery
				});

				aFilters.push(oFilter4);


				this._oListFilterState.aSearch = new Filter(aFilters, false);

			} else {
				this._oListFilterState.aSearch = [];
			}

			// var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
			// var oViewModel = this.getModel("masterView");

			this._oList = this.byId("masterTable"),
				this._oList.getBinding("items").filter(this._oListFilterState.aSearch, "Application");

			// if (this._oListFilterState.aSearch === {}) {
			// 	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			// } else if (this._oListFilterState.aSearch.length > 0) {
			// 	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			// }
		},

		onAdd: function (oEvent) {

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			var application = this.getView().getModel("application").getData();
			var dataModels = application.DataModel.results;

			for (var i = 0; i < dataModels.length; i++) {
				var dataModel = dataModels[i];
				if (dataModel.Matnr === "TEMP_MATE" && dataModel.RequestNo === "TEMP_REQU") {

					MessageBox.warning("Varolan yeni malzeme talebi ile işleme devam edilmeli.");
					return;
				}
			}

			var guid = uid();

			var uiConfig = {
				OldValues: false,
				BasisViewActive: true,
				BasisViewEditable: true,
				MipViewActive: true,
				MipViewEditable: true,
				PurchaseViewActive: application.UiModel.PurchaseViewActive,
				PurchaseViewEditable: application.UiModel.PurchaseViewEditable,
				ApproveActive: false,
				RejectActive: false,
				ReviewActive: false,
				SendActive: true,
				ApproversHide: true,
				UploadEditable: true,
				WerksEditable: true,
				LgortEditable: true,
				ExpandWerksActive: false,
				ExpandLgortActive: false,
				ExpandWerksEditable: false,
				ExpandLgortEditable: false,
				CommentsActive: false,
				ApproversActive: false,
			};



			var dataModel = {
				Guid: guid,
				Matnr: "TEMP_MATE",
				RequestNo: "TEMP_REQU",
				ProcessType: '01',
				Status: "NE",
				StatusState: "Information",
				StatusText: "Yeni",
				UiConfig: uiConfig,
				MaterialKind: "",
				ActiveStep: "",
				Matkl: "",
				Mtart: "",
				Meins: "",
				Extwg: "",
				VendorChoice: "",
				StorageText: "",
				MaterialNote: "",
				Plants:
				{
					results: [
						{
							Guid: guid,
							Bstma: "0.000",
							Bstmi: "0.000",
							Dismm: "",
							Eisbe: "0.000",
							Eislo: "0.000",
							Lgfsb: "",
							Mabst: "0.000",
							Matnr: "TEMP_MATE",
							Minbe: "0.000",
							RequestNo: "TEMP_REQU",
							Werks: "",
						}
					]
				},
				Storages:
				{
					results: [
						{
							Guid: guid,
							Matnr: "TEMP_MATE",
							Werks: "",
							RequestNo: "TEMP_REQU",
							Lgort: "",
							Lgpbe: "",

						}
					]
				},
				SupplierCodes:
				{
					results: [
						{
							Guid: guid,
							Matnr: "TEMP_MATE",
							RequestNo: "TEMP_REQU",
							Idnlf: "",
							Lifnr: "",

						}
					]
				},
				Valuations:
				{
					results: [
						{
							Guid: guid,
							Matnr: "TEMP_MATE",
							RequestNo: "TEMP_REQU",
							Stprs: "0.000",
							Bklas: "",
							Bwkey: "",
							Bwtar: "",
						}
					]
				},
				Equipments:
				{
					results: [
						{
							Guid: guid,
							Matnr: "TEMP_MATE",
							RequestNo: "TEMP_REQU",
							Equnr: ""
						}
					]
				},
				ApproveSteps: {
					results: [
						{
							ApproverName: "",
							Guid: guid,
							IsActive: false,
							RequestNo: "TEMP_REQU",
							SequenceNo: "",
							Matnr: "",
							StepDescription: "",
							FromOrganization: false,
							StepCode: "",
							Approver: "",
							Bukrs: "",
							ProcessType: "",
							MaterialKind: "",
							Orgeh: ""
						}
					]
				}


			};


			var itemNo = dataModels.length;
			dataModels.push(dataModel);
			this.getView().getModel("application").setProperty("/DataModel/results", dataModels);

			var table = this.getView().byId("masterTable")
			table.setSelectedItem(table.getItems()[itemNo]);

			this.oRouter.navTo("detail", { layout: oNextUIState.layout, itemNo: itemNo });

		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("masterTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		}
	});
});
