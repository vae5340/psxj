<#--<div class="el title">-->
    <#--<span class="t0">-->
        <#--<em class="check" onclick="selectAllprojects(this, 'delivery_em')"-->
            <#--value="" name="select_all"  id="top_select_all_projects_checkbox">-->
        <#--</em>-->
    <#--</span>-->


<#--</div>-->

<thead class="m-datatable__head">
<tr class="m-datatable__row">
    <th data-field="RecordID" class="m-datatable__cell--center m-datatable__cell m-datatable__cell--check"><span style="width: 50px;">
                  <label class="m-checkbox m-checkbox--single m-checkbox--all m-checkbox--solid m-checkbox--brand">
                    <input type="checkbox">
                    <span></span></label>
                  </span></th>
<@col_list  viewId=currentView.viewId viewCode=currentView.viewCode page=mypage  tpl="3">
<#list tag_list['metainfo'] as testKey>
<#---${testKey.listHidden}-->
<th data-field="${testKey.listName!}" class="m-datatable__cell m-datatable__cell--sort"><span style="width: ${testKey.listWidth!110}110px;">${testKey.listComment!}</span></th>
</#list>
</@col_list>
    <@view_page_list  currentDirectView=currentView>
111222222222
    </@view_page_list>
    <#--<th data-field="OrderID" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">项目编号</span></th>-->
    <#--<th data-field="ShipName" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Ship Name</span></th>-->
    <#--<th data-field="Currency" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 100px;">Currency</span></th>-->
    <#--<th data-field="ShipAddress" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Ship Address</span></th>-->
    <#--<th data-field="ShipDate" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Ship Date</span></th>-->
    <#--<th data-field="Latitude" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Latitude</span></th>-->
    <#--<th data-field="Status" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Status</span></th>-->
    <#--<th data-field="Type" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Type</span></th>-->
    <#--<th data-field="Actions" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Actions</span></th>-->
</tr>
</thead>