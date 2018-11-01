<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html style="overflow-x: hidden;height: 100%;
		margin: 0;
		padding: 0;
		border: 0;
		overflow: hidden;">
<head>
	<title>流程起草管理</title>
	<!-- 所有JSP必须引入的公共JSP子页面 -->
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>
	<!-- 引入页面模板 -->
	<%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/jsp/lib-sortable1.jsp"%>
</head>
<body style="width: 100%">
	<div style="width: 100%;">
		<div>
			<nav class="agcloud-navbar">
				<div class="agcloud-navbar-container">
					<a class="agcloud-navbar-brand agcloud-icon-data-dictionary" href="#" style="font-size: 16px">草拟工作</a>
					<div class="agcloud-navbar-collapse">
						<ul class="agcloud-navbar-tabs">
							<li class="agcloud-nav-item">
								<a href="#" class="agcloud-nav-icon  agcloud-navbar-icon-question"> </a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
		<div style="width: 100%;padding-top: 10px">
			<div class="m-portlet border-0">
				<!-- 循环分类 start-->
				<c:forEach items="${categList}" var="categ" varStatus="categStatus">
					<div class="m-portlet__head bg-light border-0">
						<div class="m-portlet__head-caption">
							<div class="m-portlet__head-title">
								<h3 class="m-portlet__head-text font-weight-bold">
										${categ.categoryName} (<c:if test="${categ.tplAppList==null}">0</c:if><c:if test="${categ.tplAppList!=null}">${categ.tplAppList.size()}</c:if>)
								</h3>
							</div>
						</div>
					</div>
					<div class="m-portlet__body m--padding-top-0">
						<!--begin: Datatable -->
						<div class="m_datatable m-datatable m-datatable--default m-datatable--loaded" id="">
							<c:if test="${categ.tplAppList!=null}">
								<table class="m-datatable__table" style="display: block;  overflow-x: auto;">
									<tbody class="m-datatable__body">
									<c:forEach items="${categ.tplAppList}" var="tplApp" varStatus="status">
										<tr data-row="0" class="m-datatable__row  border-bottom" style="left: 0px;">
											<td data-field="CompanyAgent" class="m-datatable__cell text-left" style="width: 70%;padding: 10px 10px; ">
												<span>
													<div class="m-card-user m-card-user--sm">
														<div class="m-card-user__pic">
														<img src="${pageContext.request.contextPath}/front/process/getAppIconImg.do?appId=${tplApp.appId}" class="m--img-rounded m--marginless" alt="photo">
														</div>
														<div class="m-card-user__details">
															<span class="h5" style="display:block;">${tplApp.appComment}</span>
															<a href="#" class="m--font-metal">${tplApp.updateTimeStr}&nbsp;更新</a>
														</div>
													</div>
												</span>
											</td>
											<td  class="m-datatable__cell text-center" style="width: 30%;float: right">
												<button class="btn btn-large btn-primary" type="button" style="margin-top: 7px"
														onclick="window.open('${pageContext.request.contextPath}/front/process/initDraftProcess.do?appId=${tplApp.appId}','_blank');">起草</button>&nbsp;
											</td>
										</tr>
									</c:forEach>
									</tbody>
								</table>
							</c:if>
						</div>
						<!--end: Datatable -->
					</div>
				</c:forEach>
				<c:if test="${categList == null}">
					<div style="font-size: 20px;text-align: center;background-color: #f4f3f8;color: #595959">您当前还没有可草拟的工作，请联系管理员开通！</div>
				</c:if>
			</div>
		</div>
	</div>
</div>
</body>
</html>