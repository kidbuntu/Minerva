$(function(){
	// SKELETAL DATA
	var data = {"total":7,"rows":[
			{"denominations":1000, "quantity":0, "subtotal":0, },
			{"denominations":500, "quantity":0, "subtotal":0, },
			{"denominations":200, "quantity":0, "subtotal":0, },
			{"denominations":100, "quantity":0, "subtotal":0, },
			{"denominations":50, "quantity":0, "subtotal":0, },
			{"denominations":20, "quantity":0, "subtotal":0, },
			{"denominations":"Coins", "quantity":0, "subtotal":0.00},
				],"footer":[
				{"denominations":"Total","subtotal":0.00},
		]};
	var lastIndex;

	// MERGE
	function mergeCells(){
		var merges = [{
                index: 6,
                colspan: 2,
                type:'body'
            },{
                index: 0,
                colspan: 2,
                type:'footer'
            }];

        for(var i=0; i<merges.length; i++){
                $("#dg").datagrid('mergeCells',{
                    index: merges[i].index,
                    field: 'denominations',
                    colspan: merges[i].colspan,
                    type:merges[i].type
                });
            }
	}
// DATAGRID
	$('#dg').datagrid({
		editorHeight:50,
		rowStyler:function(){
			return 'height:300';
		},
		title:'Cash Management',
		columns:[[
			{field:'denominations', title:'Denominations',width:100, align:'center', halign:'left',},
			{field:'quantity', title:'Quantity',width:100,
				editor:{
					type:'numberbox',
					options:{
						spinAlign:'horizontal',
						min:0,
						value:0
					}
				}
			},
			{field:'subtotal', title:'Sub Total',width:100,
				editor:{
					type:'numberbox',
					options:{
						value:0,
						editable:false
					}
				}
			},
			{field:'edit', title:'edit',width:100, hidden:true}
		]],
		fit:true,
		autoRowHeight:false,
		fitColumns:true,
		singleSelect:true,
		data: data,
		showFooter:true,
		toolbar:[{
			iconCls:'icon-save',
			text:'Commit',
			id:'btnacommit',
			handler:function(){
				dlg.dialog('open').dialog('center');
			}	
		},'-',{
			iconCls:'icon-ok',
			text:'Accept',
			id:'btnaccept',
			handler:function(){
				$("#dg").datagrid('acceptChanges');
				$("#dg").datagrid('unselectAll');
			}
		},'-',{
			iconCls:'icon-undo',
			text:'Clear',
			handler: function(){
				$("#dg").datagrid('rejectChanges');
			}
		}],
		onClickRow:function(rowIndex, row){
			if (lastIndex != rowIndex){
				$(this).datagrid('endEdit', lastIndex);
				$(this).datagrid('beginEdit', rowIndex);
			}
			lastIndex = rowIndex;
		},
		onBeginEdit:function(rowIndex){
			var row = $("#dg").datagrid('getSelected');
			var editors = $('#dg').datagrid('getEditors', rowIndex);
			var n1 = $(editors[0].target);
			var n2 = $(editors[1].target);
			var total = 0;
			n1.numberbox({
				onChange:function(newValue, oldValue){
					var subtotal = newValue*row.denominations;
					n2.numberbox('setValue',subtotal);
				}
			});
			n2.numberbox({
				onChange:function(newValue, oldValue){
					var footer = $("#dg").datagrid('getFooterRows');
					footer[0]['subtotal'] = (footer[0]['subtotal'] - parseFloat(oldValue)+parseFloat(newValue));
					$('#dg').datagrid('reloadFooter');	
					mergeCells();
				}
			});
			if (rowIndex == 6) {
				n2.numberbox({
					editable:true,
					precision:2,
				});
			}
		},
		onLoadSuccess: mergeCells,
		onAfterEdit: mergeCells
	});
// DATAGRID END
// DIALOG
	var dlg = $("#dlg").dialog({});
	dlg.dialog({
		title:'Batch Confirmation',
		width: 400,
		modal: true,
		border: 'thin',
		closed:true,
		buttons:[{
			iconCls:'icon-ok',
			text:'OK',
			handler: () => {
				// dlg.dialog('close');
			}
		},{
			iconCls:'icon-cancel',
			text:'Cancel',
			handler:() => {
				dlg.dialog('close');
			}
		}]
	});


});