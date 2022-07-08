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

        /* 		[oExitButton, oEnterButton].forEach(function (oButton) {
				oButton.addEventDelegate({
					onAfterRendering: function () {
						if (this.bFocusFullScreenButton) {
							this.bFocusFullScreenButton = false;
							oButton.focus();
						}
					}.bind(this)
				});
			}, this); */

        this.columnModel = new JSONModel(
          sap.ui.require.toUrl("gubretas/mm/hay/json") + "/columnsModel.json"
        );
        this.valueHelpModel = new JSONModel();

        // var oJSONModel = this.initSampleDataModel();
        // var oView = this.getView();
        // oView.setModel(oJSONModel);

        // var aSelectionModes = [];
        // jQuery.each(SelectionMode, function(k, v){
        // 	if (k != SelectionMode.Multi) {
        // 		aSelectionModes.push({key: k, text: v});
        // 	}
        // });

        // var aSelectionBehaviors = [];
        // jQuery.each(SelectionBehavior, function(k, v){
        // 	aSelectionBehaviors.push({key: k, text: v});
        // });

        // // create JSON model instance
        // var oModel = new JSONModel({
        // 	"selectionitems": aSelectionModes,
        // 	"behavioritems": aSelectionBehaviors
        // });

        // oView.setModel(oModel, "selectionmodel");
      }, 
      onPressAddServiceEntry: function (event) {
        //this.getView().getModel().setProperty("/Items(BookingId='123',ItemId='Fridge')")

        // var oEntry = {};
        // oEntry = this.getView().getModel("application").getData();
        // oEntry.ActionType = type;
        // oEntry.Revisions = [{

        // 	Id: subHeader.Id,
        // 	Dokno: subHeader.Dokno,
        // 	Rno: subHeader.Rno,
        // 	DokTarih: subHeader.DokTarih,
        // 	Rstatus: subHeader.Rstatus,
        // 	Statu: subHeader.Statu,
        // 	TraPk: subHeader.TraPk,
        // 	TraYuk: subHeader.TraYuk,
        // 	Tra: subHeader.Tra,
        // 	TraAlici: subHeader.TraAlici,
        // 	TraNo: subHeader.TraNo

        // }];

        var model = this.getView().getBindingContext("application").getModel();
        var bindingObject = this.getView().getBindingContext("application").getObject();
        var path = event.getSource().getBindingContext("application").getPath() + "/ServiceEntries/results";
        var poService = bindingObject.ServiceEntries.results;

        var sequenceNo  = (poService.length + 1).toString(); 

        poService.push({
          Sequence : sequenceNo,
          Files:
            {
            results: [ 
            ]
          }
          ,
          Details: {
            results: [
              {
                UiConfig: {
                  AddButtonActive: true,
                  UploadEditable: true,
                },
                ServiceEntryItems: [
                  {
                    results: [ {
                        UiConfig: { 
                          EditFieldsActive  : true
                         }
                      },
                    ],
                  },
                ],
              },
            ],
          },

          


        });
        model.setProperty(path, poService);
        model.refresh(true);
      },

      onPressAddServiceItem: function (event) {
        var model = this.getView().getBindingContext("application").getModel();
        var bindingObject = this.getView()
          .getBindingContext("application")
          .getObject();
        var path =
          event.getSource().getBindingContext("application").getPath() +
          "/Details/results/0/ServiceEntryItems/results";
        var poServiceItems =
          bindingObject.Items.results[0].ServiceEntryItems.results;

        for (var index = 0; index < poServiceItems.length; index++) {
			var element = poServiceItems[index];
			element.UiConfig.EditFieldsActive = true;	
		}
		
        model.setProperty(path, poServiceItems);
        model.refresh(true);
      },

      onPressDeleteLine: function (event) {
        var table = event.getSource().getParent().getParent();
        var indices = table.getSelectedIndices();
        var rows = table.getRows();
        var selectedIndexes = [];
        var newLines = [];

        if (rows.length < 2) {
          return;
        }

        for (var i = 0; i < indices.length; i++) {
          var index = indices[i];
          var context = rows[index].getBindingContext("application");
          var path = context.getPath();
          var bindingIndex = path.split("/").slice(-1)[0];
          var mainPathArray = path.split("/").slice(0, 6);
          var mainPath = mainPathArray.join("/");

          selectedIndexes.push(parseInt(bindingIndex));
        }

        var dontAdd = false;

        var line = {};

        var lines = this.getView()
          .getModel("application")
          .getProperty(mainPath);
        for (var k = 0; k < lines.length; k++) {
          line = {};

          dontAdd = false;

          for (i = 0; i < selectedIndexes.length; i++) {
            var selectedIndex = selectedIndexes[i];
            if (k === selectedIndex) {
              dontAdd = true;
              // k--;
            }
          }

          if (!dontAdd) {
            line = lines[k];
            newLines.push(line);
          }
        }

        this.getView().getModel("application").setProperty(mainPath, newLines);
        this.getView().getModel("application").refresh(true);
        table.clearSelection();
      },

      /**
       * @override
       */
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
      handleItemPress: function (oEvent) {
        var oNextUIState = this.getOwnerComponent()
            .getHelper()
            .getNextUIState(2),
          supplierPath = oEvent
            .getSource()
            .getSelectedItem()
            .getBindingContext("products")
            .getPath(),
          supplier = supplierPath.split("/").slice(-1).pop();

        this.oRouter.navTo("detailDetail", {
          layout: oNextUIState.layout,
          product: this._itemNo,
          supplier: supplier,
        });
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

        // var oUploadSet = this.getView().byId("UploadSet");

        // oUploadSet.getBinding("items").refresh(true);

        // Fragment.load({
        // 	name: fragmentName
        // }).then(function (sections) {

        // this.getView().addDependent(sections);
        // sections.bindElement(sPathToBind);
        // this.getView().addDependent(sections);
        // var sectionsOld = this.byId("ObjectPageLayout").getSections();

        // for (var i = 0; i < sectionsOld.length; i++) {
        // 	var sectionOld = sectionsOld[i];
        // 	sectionOld.destroy();
        // }
        // var uploadSet = this.getView().byId("UploadSet");
        // if (uploadSet !== undefined) {
        // 	uploadSet.destroy();
        // }
        // this.byId("ObjectPageLayout").removeAllSections();
        // this.sections = sap.ui.xmlfragment(fragmentName, this);

        // for (var i = 0; i < this.sections.length; i++) {
        // 	var section = this.sections[i];
        // 	this.byId("ObjectPageLayout").addSection(section);
        // }

        // BusyIndicator.hide();

        // setTimeout(() => {
        // 	this.byId("UploadSet").setUploadUrl(this.getOwnerComponent().getModel("mainModel").sServiceUrl + "/FilesSet");
        // }, 1000);

        // }.bind(this));
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

            var bindingObject = this.getView()
              .getBindingContext("application")
              .getObject();
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

                this._oValueHelpDialog.getTableAsync().then(
                  function (oTable) {

                    this.valueHelpTable = oTable;
                    oTable.setModel(this.valueHelpModel);
                    oTable.setModel(this.columnModel, "columns");

                    if (oTable.bindRows) {
                      oTable.bindAggregation("rows", "/");
                    }

                    if (oTable.bindItems) {
                      oTable.bindAggregation("items", "/", function () {
                        return new ColumnListItem({
                          cells: aCols.map(function (column) {
                            return new Label({
                              text: "{" + column.template + "}",
                            });
                          }),
                        });
                      });
                    }

                    this._oValueHelpDialog.update();

                    busyDialog.close();
                  }.bind(this)
                );
              }.bind(this),
              error: function (error) {
                busyDialog.close();
              }.bind(this),
            };

            this.getOwnerComponent()
              .getModel("valueModel")
              .read("/ValueHelpSet", parameters);

            var oToken = new Token();
            oToken.setKey(this._oInput.getSelectedKey());
            oToken.setText(this._oInput.getValue());
            this._oValueHelpDialog.setTokens([oToken]);

            var title = "";

            // typeof me.onChange === "function"
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
        var aTokens = oEvent.getParameter("tokens");

        if (aTokens.length > 0) {
          this._oInput.setValue(aTokens[0].getKey());

          if (
            this._oInput.getBindingInfo("value").parts[0].path ===
            "Pernr"
          ) {
          
            var path = this._oInput.getBindingContext("application").getPath();
            var model = this.getView().getBindingContext("application").getModel();
            model.setProperty(path + "/Pernr", "");

            var key = this._oInput.setValue(aTokens[0].getKey());
            var aData = this.valueHelpTable.getModel().getData();
            for (var index = 0; index < aData.length; index++) {

              var aOrgeh =  aData[index];
              if (aOrgeh.Key ===  aTokens[0].getKey() ) {
                
                var aOrgehValue =  aData[index].Value2; 
                var aSnameValue =  aData[index].Value1; 
              }
              
            
            }
            


            model.setProperty(path + "/Orgeh", aOrgehValue);
            model.setProperty(path + "/Sname", aSnameValue);
          }

          // if (this._oInput.getBindingInfo("value").parts[0].path === "Mtart") {
          //   var path = this.getView()
          //     .getBindingContext("application")
          //     .getPath();
          //   var model = this.getView()
          //     .getBindingContext("application")
          //     .getModel();
          //   model.setProperty(path + "/Bklas", "");
          // }
        } else {
          this._oInput.setValue("");
        }
        this._oValueHelpDialog.close();
      },

      onValueHelpCancelPress: function () {
        this._oValueHelpDialog.close();
      },

      onValueHelpAfterClose: function () {
        this._oValueHelpDialog.destroy();
      },
      onPressAction: function (event) {
        var commentActive = false;
        var obligatory = false;

        var actionType = event.getSource().getFieldGroupIds()[0];

        if (actionType !== "Reject" && actionType !== "Review") {
          if (!this._applyValidation()) {
            return;
          }
        }

        var bindingObject = this.getView()
          .getBindingContext("application")
          .getObject();

        var process = {
          Guid: bindingObject.Guid,
          ActionType: actionType,
          MaterialKind: bindingObject.MaterialKind,
          Matkl: bindingObject.Matkl,
          Matnr: bindingObject.Matnr,
          Mtart: bindingObject.Mtart,
          Maktx: bindingObject.Maktx,
          ProcessType: bindingObject.ProcessType,
          RequestNo: bindingObject.RequestNo,
          Status: bindingObject.Status,
          StatusState: bindingObject.StatusState,
          StatusText: bindingObject.StatusText,
          ActiveStep: bindingObject.ActiveStep,
          Meins: bindingObject.Meins,
          Extwg: bindingObject.Extwg,
          VendorChoice: bindingObject.VendorChoice,
          StorageText: bindingObject.StorageText,
          MaterialNote: bindingObject.MaterialNote,
          CreateDate: bindingObject.CreateDate,
          CreateTime: bindingObject.CreateTime,
          CreateUname: bindingObject.CreateUname,
          Storages: bindingObject.Storages.results,
          SupplierCodes: bindingObject.SupplierCodes.results,
          Equipments: bindingObject.Equipments.results,
          Valuations: bindingObject.Valuations.results,
          Plants: bindingObject.Plants.results,
          ApproveSteps: bindingObject.ApproveSteps.results,
          UiConfig: bindingObject.UiConfig,
        };

        switch (actionType) {
          case "Send":
            var dialogText = "Onaya göndermek istediğinize emin misiniz?";
            commentActive = true;
            break;
          case "Approve":
            dialogText = "Onaylamak istediğinize emin misiniz?";
            commentActive = true;
            break;
          case "Reject":
            dialogText = "Reddetmek istediğinize emin misiniz?";
            commentActive = true;
            obligatory = true;
            break;
          case "Review":
            dialogText = "Gözden geçirlmesini istediğinize emin misiniz?";
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

                  // processReturn.StatusState  =
                  // processReturn.StatusText   =
                  // processReturn.Status	   =
                  // processReturn.CreateDate   =
                  // processReturn.CreateTime   =
                  // processReturn.CreateUname  =
                  // processReturn.RequestNo
                  // processReturn.ActiveStep

                  // this.startUpload(processReturn);
                  this.completeItemCount = 0;
                  var oUploadSet = sap.ui.getCore().byId("UploadSet");

                  var cFiles = oUploadSet.getIncompleteItems().length;

                  if (cFiles > 0) {
                    this.FileGuid = uid();
                    oUploadSet.upload();
                  } else {
                    this.BusyDialog.close();
                    MessageBox.success("İşlem başarı ile gerçekleştirildi", {
                      onClose: function (params) {
                        this.getOwnerComponent().refreshApplication();
                      }.bind(this),
                    });
                  }
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

      _applyValidation: function () {
        var emptyFieldExist = false;
        var inputs = sap.ui
          .getCore()
          .byFieldGroupId("")
          .filter((c) => c.isA("sap.m.Input"));

        for (var i = 0; i < inputs.length; i++) {
          var item = inputs[i];
          if (item.getRequired() && item.getVisible() && item.getEditable()) {
            if (
              item.getValue() === "" ||
              item.getValue() === undefined ||
              parseFloat(item.getValue()) === 0
            ) {
              emptyFieldExist = true;
              item.setValueState("Error");
              item.setValueStateText("Zorunlu Alan");
              item.focus();
            } else {
              item.setValueState("None");
              item.setValueStateText("");
            }
          }
        }

        if (emptyFieldExist) {
          MessageBox.error("Lütfen zorunlu alanları doldurunuz");
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
    });
  }
);
