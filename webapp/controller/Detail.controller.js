sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "gubretas/mm/hay/controller/BaseController",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/Token",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/TextArea",
    "sap/m/StandardListItem",
    "sap/m/Column",
    "sap/base/util/uid",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/thirdparty/jquery",
    "../model/formatter"
  ],
  function (
    JSONModel,
    BaseController,
    ColumnListItem,
    Label,
    Token,
    Fragment,
    Filter,
    FilterOperator,
    MessageBox,
    Dialog,
    Button,
    library,
    TextArea,
    StandardListItem,
    Column,
    uid,
    BusyIndicator,
    MessageToast,
    DateFormat,
    jQuer,
    formatterx
  ) {
    "use strict";

    var ButtonType = library.ButtonType;

    return BaseController.extend("gubretas.mm.hay.controller.Detail", {
      formatter: formatterx,
      onInit: function () {
        var oExitButton = this.getView().byId("exitFullScreenBtn"),
          oEnterButton = this.getView().byId("enterFullScreenBtn");

        this.oRouter = this.getOwnerComponent().getRouter();
        this.oModel = this.getOwnerComponent().getModel();

        this.oRouter
          .getRoute("detail")
          .attachPatternMatched(this._onMasterMatched, this);
        this.oRouter
          .getRoute("detailDetail")
          .attachPatternMatched(this._onMasterMatched, this);


        this.columnModel = new JSONModel(
          sap.ui.require.toUrl("gubretas/mm/hay/json") + "/columnsModel.json"
        );
        this.valueHelpModel = new JSONModel();

      },
      onAfterRendering: function () {
        // var uiConfig = this.getModel("application").getProperty("UiConfig")
        // var formBasisView = this.byId("formBasisView");
        // var formMipView = this.byId("formMipView");
        // var formPurchaseView = this.byId("formPurchaseView");
        // var items = formBasisView.getContent()
        // for (var i = 0; i < items.length; i++) {
        // 	var item = items[i];
        // 	// item.setVisib
        // }
        // uiConfig.BasisViewEditable
        // uiConfig.MipViewEditable
        // uiConfig.PurchaseViewEditable
      },
      onPressAddServiceEntry: function (event) {

        var model = this.getView().getBindingContext("application").getModel();
        var bindingObject = this.getView().getBindingContext("application").getObject();
        var mainPath = event.getSource().getBindingContext("application").getPath()
        var path = mainPath + "/ServiceEntries/results";
        var servicesEntries = bindingObject.ServiceEntries.results;

        var sequenceNo = (servicesEntries.length + 1).toString();

        servicesEntries.push({
          Sequence: sequenceNo,
          Waers: bindingObject.Items.results[0].Waers,
          Brtwr: "0.00",
          Frggr: "",
          Process: false,
          Frgsx: "",
          Lblni: "",
          Frgzu: "",
          Lwert: "0.00",
          Frgrl: true,
          MatklDescription: "",
          NextFrgco: "",
          Status: "",
          Authorized: false,
          Xblnr: "",
          Guid: "",
          EbelnPo: bindingObject.Items.results[0].EbelnPo,
          Ebelp: bindingObject.Items.results[0].Ebelp,
          Kostl: "",
          Txz01: "",
          Knttp: "",
          Wgbez: "",
          Menge: "0.000",
          Meins: bindingObject.Items.results[0].Meins,
          Matkl: "",
          Netpr: "0.00",
          Final: false,
          // CreateDate: "",
          // CreateUzeit: "",
          CreateUname: "",
          // Budat: "",
          Pernr: "",
          Ename: "",
          Orgeh: "",
          OrgehText: "",
          Description: "",
          Files:
          {
            results: [
            ]
          },
          UiConfig: {
            PanelExpandedActive: true,
            AddButtonActive: true,
            SaveButtonActive: true,
            CancelButtonActive: true,
            FinalButtonActive: false,
            EditFieldsActive: true,
            StatusState: "Warning",
            StatusText: "İşleniyor",
            PrintButtonActive:false
          },
          ServiceEntryItems: [
            {
              results: [
              ],
            },
          ]
        });

        model.setProperty(path, servicesEntries);
        model.setProperty(mainPath + "/UiConfig/AddSheetActive", false);
        model.refresh(true);
      },

      onPressCancel: function (event) {
        var model = this.getView().getBindingContext("application").getModel();
        var bindingObject = this.getView().getBindingContext("application").getObject();
        var mainPath = this.getView().getBindingContext("application").getPath();
        var path = mainPath + "/ServiceEntries/results";

        var servicesEntries = bindingObject.ServiceEntries.results;

        servicesEntries.pop();

        model.setProperty(path, servicesEntries);
        model.setProperty(mainPath + "/UiConfig/AddSheetActive", true);
        model.refresh(true);
      },
      onPressAddServiceItem: function (event) {
        var model = this.getView().getBindingContext("application").getModel();

        var bindingObject = this.getView().getBindingContext("application").getObject();

        var path = event.getSource().getBindingContext("application").getPath() + "/ServiceEntryItems/results";

        var poServiceItems = bindingObject.Items.results[0].ServiceEntryItems.results;

        for (var index = 0; index < poServiceItems.length; index++) {
          var element = poServiceItems[index];
          element.UiConfig.EditFieldsActive = true;
        }

        model.setProperty(path, poServiceItems);
        model.refresh(true);
      },

      handleFullScreen: function () {
        this.bFocusFullScreenButton = true;
        var sNextLayout = this.oModel.getProperty(
          "/actionButtonsInfo/midColumn/fullScreen"
        );
        this.oRouter.navTo("detail", {
          layout: sNextLayout,
          itemNo: this._itemNo,
        });
      },
      handleExitFullScreen: function () {
        this.bFocusFullScreenButton = true;
        var sNextLayout = this.oModel.getProperty(
          "/actionButtonsInfo/midColumn/exitFullScreen"
        );
        this.oRouter.navTo("detail", {
          layout: sNextLayout,
          itemNo: this._itemNo,
        });
      },
      handleClose: function () {
        var sNextLayout = this.oModel.getProperty(
          "/actionButtonsInfo/midColumn/closeColumn"
        );
        this.oRouter.navTo("master", { layout: sNextLayout });
      },
      _onMasterMatched: function (oEvent) {
        this._itemNo =
          oEvent.getParameter("arguments").itemNo || this._itemNo || "0";
        var path = "/DataModel/results/" + this._itemNo;

        this.getView().bindElement({
          path: path,
          model: "application",
        });

        var model = this.getView().getModel("application").getProperty(path);

        var detailModel = new JSONModel(model);

        this.getView().setModel(detailModel, "detail");

        if (model === undefined) {
          return;
        }

        var oldValues = model.UiConfig.OldValues;

        switch (oldValues) {
          case true:
            var fragmentName = "gubretas.mm.hay.fragments.SectionsDouble";
            break;

          default:
            fragmentName = "gubretas.mm.hay.fragments.Sections";
            break;
        }

      },
      onValueHelpRequested: function (event) {
        var aCols = this.columnModel.getData().cols;
        var path = event.getSource().getBindingInfo("value").parts[0].path;
        var arrayPaths = path.split("/");
        var valueHelpname = arrayPaths[arrayPaths.length - 1];

        this._oInput = event.getSource();
        var busyDialog = new sap.m.BusyDialog({});

        busyDialog.open();
        Fragment.load({
          name: "gubretas.mm.hay.fragments.ValueHelpDialogSingleSelect",
          controller: this,
        }).then(
          function name(oFragment) {
            this._oValueHelpDialog = oFragment;
            this.getView().addDependent(this._oValueHelpDialog);

            var filters = [
              new Filter("Name", FilterOperator.EQ, valueHelpname),
            ];

            var bindingObject = this.getView().getBindingContext("application").getObject();
            // if (valueHelpname === "Mtart") {
            //   if (
            //     bindingObject.MaterialKind !== undefined &&
            //     bindingObject.MaterialKind !== ""
            //   ) {
            //     filters.push(
            //       new Filter(
            //         "Criteria1",
            //         FilterOperator.EQ,
            //         bindingObject.MaterialKind
            //       )
            //     );
            //   }
            // }



            var parameters = {
              async: true,
              filters: filters,
              urlParameters: {
                $expand: ["Values"],
              },
              success: function (data) {
                this.valueHelpModel.setData(data.results[0].Values.results);

                this._oValueHelpDialog.setModel(this.valueHelpModel);
                this._oValueHelpDialog.setModel(this.columnModel, "columns");

                if (this._oValueHelpDialog.bindRows) {
                  this._oValueHelpDialog.bindAggregation("rows", "/");
                }

                if (this._oValueHelpDialog.bindColumns) {
                  this._oValueHelpDialog.bindColumns("columns>/cols", function () {
                    return new Column({
                      header: new Label({
                        text: "{columns>label}",
                      }),
                    });
                  });
                }

                if (this._oValueHelpDialog.bindItems) {
                  this._oValueHelpDialog.bindItems("/", function () {
                    return new ColumnListItem({
                      cells: aCols.map(function (column) {
                        return new Label({
                          text: "{" + column.template + "}",
                        });
                      }),
                    });
                  });
                }

                // this._oValueHelpDialog.update();

                busyDialog.close();

                // }.bind(this)
                // );
              }.bind(this),
              error: function (error) {
                busyDialog.close();
              }.bind(this),
            };

            this.getOwnerComponent()
              .getModel("valueModel")
              .read("/ValueHelpSet", parameters);


            var title = "";

            if (typeof this._oInput.getLabels()[0].getText === "function") {
              title = this._oInput.getLabels()[0].getText();
            } else {
              title = this._oInput.getLabels()[0].getLabel().getText();
            }

            this._oValueHelpDialog.setTitle(title + " seçiniz");

            this._oValueHelpDialog.open();
          }.bind(this)
        );



      },

      onValueHelpOkPress: function (oEvent) {
        // var aTokens = oEvent.getParameter("tokens");
        var objects = oEvent.getParameters().selectedContexts[0].getObject()

        if (objects.Key) {
          this._oInput.setValue(objects.Key);

          if (
            this._oInput.getBindingInfo("value").parts[0].path ===
            "Pernr"
          ) {

            var path = this._oInput.getBindingContext("application").getPath();
            var model = this.getView().getBindingContext("application").getModel();
            model.setProperty(path + "/Pernr", objects.Key);
            var aData = this.valueHelpModel.getData();
            for (var index = 0; index < aData.length; index++) {

              var aOrgeh = aData[index];
              if (aOrgeh.Key === objects.Key) {
                var aOrgehValue = aData[index].Value2;
                var aSnameValue = aData[index].Value1;
              }

            }

            model.setProperty(path + "/OrgehText", aOrgehValue);
            model.setProperty(path + "/Ename", aSnameValue);
          }


        } else {
          this._oInput.setValue("");
        }

      },

      onValueHelpCancelPress: function () {
        // this._oValueHelpDialog.close();
      },

      onValueHelpAfterClose: function () {
        this._oValueHelpDialog.destroy();
      },
      onPressAction: function (event) {
        var commentActive = false;
        var obligatory = false;
        var serviceEntries = [];

        var actionType = event.getSource().getFieldGroupIds()[0];


        var serviceEntry = event.getSource().getBindingContext("application").getObject();

        if (actionType === "Send") {
          if (!this._applyValidation(serviceEntry)) {
            return;
          }
        }

        var bindingObject = this.getView().getBindingContext("application").getObject();


        if (actionType === "Send" || actionType === "SetFinal") {
          serviceEntries.push(serviceEntry);
        }
        else {
          serviceEntries = bindingObject.ServiceEntries.results;
        }


        var serviceEntryConverted = {};
        var serviceEntriesConverted = [];

        var itemConverted = {};
        var itemsConverted = [];


        for (var i = 0; i < serviceEntries.length; i++) {
          entry = {};
          var entry = serviceEntries[i];

          serviceEntryConverted = Object.assign({}, entry);
          serviceEntryConverted.ServiceEntryItems = entry.ServiceEntryItems.results
          serviceEntryConverted.Files = entry.Files.results;
          serviceEntryConverted.Releasers = [];
          // delete serviceEntryConverted.results;
          serviceEntriesConverted.push(serviceEntryConverted)
        }

        for (i = 0; i < bindingObject.Items.results.length; i++) {
          var item = {};

          item = bindingObject.Items.results[i];
          itemConverted = Object.assign({}, item);
          itemConverted.ServiceEntryItems = item.ServiceEntryItems.results;
          // delete itemConverted.results;
          itemsConverted.push(itemConverted)
        }



        var process = {
          Status: bindingObject.Status,
          Ekorg: bindingObject.Ekorg,
          PersonInfo: bindingObject.PersonInfo,
          CreateContractUser: bindingObject.CreateContractUser,
          UiConfig: bindingObject.UiConfig,
          CreatePoTime: bindingObject.CreatePoTime,
          Guid: bindingObject.Guid,
          CreatePoUname: bindingObject.CreatePoUname,
          EbelnPo: bindingObject.EbelnPo,
          Ebelp: bindingObject.Ebelp,
          Description: bindingObject.Description,
          EbelnContract: bindingObject.EbelnContract,
          Lifnr: bindingObject.Lifnr,
          Name1: bindingObject.Name1,
          Ekgrp: bindingObject.Ekgrp,
          Kdatb: bindingObject.Kdatb,
          Kdate: bindingObject.Kdate,
          CreateContractDate: bindingObject.CreateContractDate,
          CreatePoDate: bindingObject.CreatePoDate,
          BsartPo: bindingObject.BsartPo,
          BsartContract: bindingObject.BsartContract,
          LastUser: bindingObject.LastUser,
          Items: itemsConverted,
          ServiceEntries: serviceEntriesConverted,
          ActionType: actionType,
        };

        switch (actionType) {
          case "Send":
            var dialogText = "Onaya göndermek istediğinize emin misiniz?";
            commentActive = false;
            break;
          case "Release":
            dialogText = "Onaylamak istediğinize emin misiniz?";
            commentActive = true;
            break;
          case "SetFinal":
            dialogText = "Son hakediş belgesi olarak belirlemek istediğinize emin misiniz?";
            commentActive = false;
            break;
          case "Reject":
            dialogText = "Reddetmek istediğinize emin misiniz?";
            commentActive = true;
            obligatory = true;
            break;
          default:
            break;
        }

        this._handleDialog(
          dialogText,
          commentActive,
          obligatory,
          function (dialog, event) {
            if (sap.ui.getCore().byId("dialogTextarea") !== undefined) {
              var note = sap.ui.getCore().byId("dialogTextarea").getValue();
            }

            process.Note = note;
            this.BusyDialog = new sap.m.BusyDialog({});

            this.BusyDialog.open();

            this.getOwnerComponent()
              .getModel("mainModel")
              .create("/ProcessModelSet", process, {
                success: function (processReturn) {
                  var path = this.getView()
                    .getBindingContext("application")
                    .getPath();
                  var model = this.getView()
                    .getBindingContext("application")
                    .getModel();
                  model.setProperty(path, processReturn);


                  // this.completeItemCount = 0;
                  // var oUploadSet = sap.ui.getCore().byId("UploadSet");

                  // var cFiles = oUploadSet.getIncompleteItems().length;

                  // if (cFiles > 0) {
                  //   this.FileGuid = uid();
                  //   oUploadSet.upload();
                  // } else {
                  this.BusyDialog.close();
                  MessageBox.success("İşlem başarı ile gerçekleştirildi", {
                    onClose: function (params) {
                      this.getOwnerComponent().refreshApplication();
                    }.bind(this),
                  });
                  // }


                }.bind(this),
                error: function (error) {
                  MessageBox.error(
                    JSON.parse(error.responseText).error.message.value
                  );
                  this.BusyDialog.close();
                }.bind(this),
              });

            event.getSource().getParent().close();
          }.bind(this)
        );
      },

      _applyValidation: function (serviceEntry) {
        var emptyFieldExist = false;

        // var inputs = sap.ui.getCore().byFieldGroupId("").filter((c) => c.isA("sap.m.Input"));

        // for (var i = 0; i < inputs.length; i++) {
        //   var item = inputs[i];
        //   if (item.getRequired() && item.getVisible() && item.getEditable()) {
        //     if (
        //       item.getValue() === "" ||
        //       item.getValue() === undefined ||
        //       parseFloat(item.getValue()) === 0
        //     ) {
        //       emptyFieldExist = true;
        //       item.setValueState("Error");
        //       item.setValueStateText("Zorunlu Alan");
        //       item.focus();
        //     } else {
        //       item.setValueState("None");
        //       item.setValueStateText("");
        //     }
        //   }
        // }

        if (serviceEntry.Xblnr === "" || serviceEntry.Xblnr === undefined) {
          MessageBox.error("Fatura no alanını doldurunuz.");
          return false;
        }

        if (serviceEntry.Lwert === "" || serviceEntry.Lwert === undefined) {
          MessageBox.error("Fatura tutarını doldurunuz.");
          return false;
        }

        if (serviceEntry.Pernr === "" || serviceEntry.Pernr === undefined) {
          MessageBox.error("Personel alanını doldurunuz.");
          return false;
        }

        var entryAmountEmpty = false;
        var entryQuantityEmpty = false;
        var filledLine = false;

        for (var i = 0; i < serviceEntry.ServiceEntryItems.results.length; i++) {
          var item = serviceEntry.ServiceEntryItems.results[i];

          if (item.EntryAmount === "" || item.EntryAmount === undefined || parseInt(item.EntryAmount) === 0) {
            entryAmountEmpty = true;
          }

          if (item.EntryQuantity === "" || item.EntryQuantity === undefined || parseInt(item.EntryQuantity) === 0) {
            entryQuantityEmpty = true;
          }

          if (entryQuantityEmpty && !entryAmountEmpty) {
            MessageBox.error("Kalemdeki miktar alanı doldurulmalı");
            return false;
          }


          if (!entryQuantityEmpty && entryAmountEmpty) {
            MessageBox.error("Kalemdeki tutar alanını doldurulmalı");
            return false;
          }

          if (!(entryQuantityEmpty && !entryQuantityEmpty)) {
            filledLine = true;
          }
        }

        if (!filledLine) {
          MessageBox.error("En az bir kalem doldurulmalı");
          return false;
        }

        return true;
      },
      _handleDialog: function (
        text,
        commentActive,
        obligatory,
        successCallback
      ) {
        var content = [];

        content.push(new Label({ text: text, labelFor: "dialogTextarea" }));

        if (commentActive) {
          if (obligatory) {
            var textArea = new TextArea("dialogTextarea", {
              liveChange: function (oEvent) {
                var sText = oEvent.getParameter("value");
                var parent = oEvent.getSource().getParent();

                parent.getBeginButton().setEnabled(sText.length > 0);
              },
              width: "100%",
              placeholder: "Açıklama Ekle - Zorunlu ",
            });
          } else {
            textArea = new TextArea("dialogTextarea", {
              width: "100%",
              placeholder: "Açıklama Ekle",
            });
          }
          content.push(textArea);
        }

        var oDialog = new Dialog({
          title: "Onaylama",
          type: "Message",
          content: content,
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: "Evet",
            press: successCallback.bind(this, oDialog),
          }),
          endButton: new Button({
            text: "Hayır",
            press: function () {
              oDialog.close();
            },
          }),
          afterClose: function () {
            oDialog.destroy();
          },
        });

        oDialog.open();
      },
      // startUpload: function (processReturn) {
      // 	// var oUploadSet = this.byId("UploadSet");
      // 	// var oUploadSet = this.sections[3].getSubSections()[0].getBlocks()[0]
      // 	// var oUploadSet = this.getView().byId("UploadSet");

      // },

      onBeforeUploadStarts: function (oEvent) {
        var oUploadSet = oEvent.getSource();
        var oItemToUpload = oEvent.getParameter("item");
        var oCustomerHeaderToken = new sap.ui.core.Item({
          key: "x-csrf-token",
          text: this.getOwnerComponent()
            .getModel("mainModel")
            .getSecurityToken(),
        });

        var bindingObject = this.getView()
          .getBindingContext("application")
          .getObject();

        // Header Slug
        var oCustomerHeaderSlug = new sap.ui.core.Item({
          key: "slug",
          text: encodeURIComponent(
            oItemToUpload.getFileName() +
            ";" +
            bindingObject.RequestNo +
            ";" +
            bindingObject.Matnr +
            ";" +
            this.FileGuid
          ),
        });

        oUploadSet.removeAllHeaderFields();
        oUploadSet.addHeaderField(oCustomerHeaderToken);
        oUploadSet.addHeaderField(oCustomerHeaderSlug);
      },

      onUploadCompleted: function (event) {
        // this.getView().getModel("application").refresh(true);
        // this.getOwnerComponent().refreshApplication();
        this.completeItemCount = this.completeItemCount + 1;

        if (
          event.getSource().getIncompleteItems().length ===
          this.completeItemCount
        ) {
          this.BusyDialog.close();
          MessageBox.success("İşlem başarı ile gerçekleştirildi", {
            onClose: function (params) {
              this.getOwnerComponent().refreshApplication();
            }.bind(this),
          });
        }
      },

      onSelectionModeChange: function (oEvent) {
        if (oEvent.getParameter("selectedItem").getKey() === "All") {
          MessageToast.show(
            "selectionMode:All is deprecated. Please select another one."
          );
          return;
        }
        var oTable = this.byId("table1");
        oTable.setSelectionMode(oEvent.getParameter("selectedItem").getKey());
      },

      onBehaviourModeChange: function (oEvent) {
        var oTable = this.byId("table1");
        oTable.setSelectionBehavior(
          oEvent.getParameter("selectedItem").getKey()
        );
      },

      onSwitchChange: function (oEvent) {
        var oTable = this.byId("table1");
        oTable.setEnableSelectAll(oEvent.getParameter("state"));
      },

      getSelectedIndices: function (evt) {
        var aIndices = this.byId("table1").getSelectedIndices();
        var sMsg;
        if (aIndices.length < 1) {
          sMsg = "no item selected";
        } else {
          sMsg = aIndices;
        }
        MessageToast.show(sMsg);
      },

      getContextByIndex: function (evt) {
        var oTable = this.byId("table1");
        var iIndex = oTable.getSelectedIndex();
        var sMsg;
        if (iIndex < 0) {
          sMsg = "no item selected";
        } else {
          sMsg = oTable.getContextByIndex(iIndex);
        }
        MessageToast.show(sMsg);
      },

      clearSelection: function (evt) {
        this.byId("table1").clearSelection();
      },

      formatAvailableToObjectState: function (bAvailable) {
        return bAvailable ? "Success" : "Error";
      },

      formatAvailableToIcon: function (bAvailable) {
        return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
      },

      handleDetailsPress: function (oEvent) {
        MessageToast.show(
          "Details for product with id " +
          this.getView()
            .getModel()
            .getProperty("ProductId", oEvent.getSource().getBindingContext())
        );
      },
      onFilterBarSearch: function (oEvent) {
        var sSearchQuery = this._oBasicSearchField.getValue(),
          aSelectionSet = oEvent.getParameter("selectionSet");
        var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
          if (oControl.getValue()) {
            aResult.push(new Filter({
              path: oControl.getName(),
              operator: FilterOperator.Contains,
              value1: oControl.getValue()
            }));
          }

          return aResult;
        }, []);

        aFilters.push(new Filter({
          filters: [
            new Filter({ path: "ProductId", operator: FilterOperator.Contains, value1: sSearchQuery }),
            new Filter({ path: "Name", operator: FilterOperator.Contains, value1: sSearchQuery }),
            new Filter({ path: "Category", operator: FilterOperator.Contains, value1: sSearchQuery })
          ],
          and: false
        }));

        this._filterTable(new Filter({
          filters: aFilters,
          and: true
        }));
      },

      _filterTable: function (oFilter) {
        var oValueHelpDialog = this._oValueHelpDialog;

        oValueHelpDialog.getTableAsync().then(function (oTable) {
          if (oTable.bindRows) {
            oTable.getBinding("rows").filter(oFilter);
          }

          if (oTable.bindItems) {
            oTable.getBinding("items").filter(oFilter);
          }

          oValueHelpDialog.update();
        });
      },

      onPressPrint: function (event) {

        var serviceEntry = event.getSource().getBindingContext("application").getObject();

        var serviceUrl = this.getOwnerComponent().getModel("mainModel").sServiceUrl;
        var url = serviceUrl + "/PrintSet(" + "Lblni='" + serviceEntry.Lblni + "')/$value";

        parent.window.open(url, "_blank");
      },
    });
  }
);
