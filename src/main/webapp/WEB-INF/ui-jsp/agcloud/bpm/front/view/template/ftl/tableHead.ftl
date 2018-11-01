<div class="el title">

    <!--  <em class="check" onclick="selectAllprojects(this, &#39;delivery_em&#39;)"
    value="" name="select_all" id="top_select_all_projects_checkbox">

    </em> -->
    <span class="t0">
        <em class="check" onclick="selectAllprojects(this, 'delivery_em')"
            value="" name="select_all"  id="top_select_all_projects_checkbox">
        </em>
    </span>

     <@col_list viewCode="leave_request_on_view"  tpl="3">
         <#list tag_list['metainfo'] as testKey>
              <span class="t${testKey_index+1} text-left"> ${testKey.listComment!}
                  <i class="la la-arrow-down"></i>
              </span>
         </#list>
     </@col_list>
    <#--<span class="t2 text-left">项目名称</span> <span class="t3">地区</span> <span
        class="t4 text-center">总投资（万元）<i class="la la-arrow-down"></i></span>-->

</div>