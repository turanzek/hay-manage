sap.ui.define([
	"sap/ui/model/type/Currency"
], function (Currency) {
	"use strict";

	return {

		deleteLeadingZeros: function (value) {

			if (value) {
				var lastValue = value.replace(/^0+/, '');
			}
			else {
				lastValue = value;
			}

			return lastValue;
		},
		formatValueforChart: function (params) {
			return parseInt(params)
		},
	};
});

