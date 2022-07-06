sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "gubretas/mm/hay/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/base/util/uid",
  ],
  function (
    JSONModel,
    BaseController,
    Filter,
    FilterOperator,
    Sorter,
    MessageBox,
    uid
  ) {
    "use strict";

    return BaseController.extend("gubretas.mm.hay.controller.Master", {
      onInit: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        this._bDescendingSort = false;

        this._oListFilterState = {
          aFilter: [],
          aSearch: [],
        };

      },
      onListItemPress: function (oEvent) {
        // BusyIndicator.show();

        this.showBusyIndicator(50, 0);
        var oNextUIState = this.getOwnerComponent()
          .getHelper()
          .getNextUIState(1);


        var itemPath = oEvent.getSource().getBindingContext("application").getPath();
        var itemNo = itemPath.split("/").slice(-1).pop();

        this.oRouter.navTo("detail", {
          layout: oNextUIState.layout,
          itemNo: itemNo,
        });
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
            oFilter1,
            oFilter2,
            oFilter3,
            oFilter4;

          oFilter1 = new Filter({
            path: "EbelnPo",
            operator: FilterOperator.Contains,
            value1: sQuery,
          });

          aFilters.push(oFilter1);

          oFilter2 = new Filter({
            path: "EbelnContract",
            operator: FilterOperator.Contains,
            value1: sQuery,
          });

          aFilters.push(oFilter2);



          this._oListFilterState.aSearch = new Filter(aFilters, false);
        } else {
          this._oListFilterState.aSearch = [];
        }

        // var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
        //var oViewModel = this.getModel("masterView");

        (this._oList = this.byId("masterTable")),
          this._oList.getBinding("items").filter(this._oListFilterState.aSearch, "Application");

        // if (this._oListFilterState.aSearch === {}) {
        // 	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
        // } else if (this._oListFilterState.aSearch.length > 0) {
        // 	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
        // }
      },

      onSort: function (oEvent) {
        this._bDescendingSort = !this._bDescendingSort;
        var oView = this.getView(),
          oTable = oView.byId("masterTable"),
          oBinding = oTable.getBinding("items"),
          oSorter = new Sorter("Name", this._bDescendingSort);

        oBinding.sort(oSorter);
      },
    });
  }
);
