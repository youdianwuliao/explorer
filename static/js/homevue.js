function addMessage(list, msg) {
	list.unshift(msg.data.block);
	list.splice(10,10);
	$('#message-list').parent().animate({
		scrollTop: $('#message-list').height()
	}, 1000);
}
function addTxs(list, msg) {
	msg.data.block.transactions.forEach( tx => list.unshift(tx) );
	list.splice(10,10);
	$('#tx-list').parent().animate({
		scrollTop: $('#tx-list').height()
	}, 1000);
}
function addMoac(list, msg) {
	list.unshift(msg.data.info_moac);
	list.splice(10,10);
}
function addStat(list, msg) {
	list.unshift(msg.data.info_stat);
	list.splice(10,10);
}

$(function () {
	var vmMessageList = new Vue({
		el: '#scrollbar2',
		data: {
			messages: []
		},
		methods: {
			block: function (msg) {
				window.open(`/api/block/${msg.hash}`);
			}
		}
	});
	window.vmMessageList = vmMessageList;
	var vmTxList = new Vue({
		el: '#scrollbar',
		data: {
			txs: []
		},
		methods: {
			transaction: function (tx) {
				window.open(`/api/tx/${tx}`);
			},
		}
	});
	window.vmTxList = vmTxList;
	var vmJsonStat = new Vue({
		el: '#jsonstat',
		data: {
			info_stat: [],
			info_moac: []
		}
	});
	window.vmJsonStat = vmJsonStat;

	var ws_conncted = true;

	ws.onmessage = function(event) {
		var data = event.data;
		var msg = JSON.parse(data);
		if (msg.type === 'datafeed') {
			if (msg.data.block) {
				addMessage(vmMessageList.messages, msg);
				addTxs(vmTxList.txs, msg);
			}
			if (msg.data.info_stat) {
				addStat(vmJsonStat.info_stat, msg);
			}
			if (msg.data.info_moac) {
				addMoac(vmJsonStat.info_moac, msg);
			}
		}
	};
	ws.onclose = function (evt) {
		console.log('[closed] ' + evt.code);
		ws_connected = false;
	};
	ws.onerror = function (code, msg) {
		console.log('[ERROR] ' + code + ': ' + msg);
		ws_connected = false;
	};

});
