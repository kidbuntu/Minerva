$(function(){

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
		toolbar:[
		{
			iconCls:'icon-save',
			text:'Commit',
			id:'btnaccept',
			handler:function(){
				$("#dg").datagrid('acceptChanges');
				var rowfooter = $("#dg").datagrid('getFooterRows');

				var data = $("#dg").datagrid('getData');
				var total = 0;
				$.each(data.rows, function( key, value ) {
					total += parseFloat(value.subtotal);
				});

				console.log(total);

				rowfooter[0]['subtotal'] = total;
				$('#dg').datagrid('reloadFooter');
				mergeCells();
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
			n1.numberbox({
				onChange:function(newValue, oldValue){
					var subtotal = newValue*row.denominations;
					n2.numberbox('setValue',subtotal);
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
});