
; /* Start:"a:4:{s:4:"full";s:93:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?14161453191966";s:6:"source";s:78:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var waitDiv=null;var waitPopup=null;var waitTimeout=null;var waitTime=500;function __SASSetAdmin(){__SASShowWait();BX.ajax({url:"/bitrix/components/bitrix/socialnetwork.admin.set/ajax.php",method:"POST",dataType:"json",data:{ACTION:"SET",sessid:BX.bitrix_sessid(),site:BX.util.urlencode(BX.message("SASSiteId"))},onsuccess:function(e){__SASProcessAJAXResponse(e)}})}function __SASProcessAJAXResponse(e){if(e["SUCCESS"]!="undefined"&&e["SUCCESS"]=="Y"){BX.reload();return false}else if(e["ERROR"]!="undefined"&&e["ERROR"].length>0){if(e["ERROR"].indexOf("SESSION_ERROR",0)===0){__SASShowError(BX.message("SASErrorSessionWrong"));BX.reload()}else if(e["ERROR"].indexOf("CURRENT_USER_NOT_ADMIN",0)===0){__SASShowError(BX.message("SASErrorNotAdmin"));return false}else if(e["ERROR"].indexOf("CURRENT_USER_NOT_AUTH",0)===0){__SASShowError(BX.message("SASErrorCurrentUserNotAuthorized"));return false}else if(e["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED",0)===0){__SASShowError(BX.message("SASErrorModuleNotInstalled"));return false}else{__SASShowError(e["ERROR"]);return false}}}function __SASShowError(e){__SASCloseWait();var t=new BX.PopupWindow("sas-error"+Math.random(),window,{autoHide:true,lightShadow:false,zIndex:2,content:BX.create("DIV",{props:{className:"sonet-adminset-error-text-block"},html:e}),closeByEsc:true,closeIcon:true});t.show()}function __SASShowWait(e){if(e!==0){return waitTimeout=setTimeout(function(){__SASShowWait(0)},50)}if(!waitPopup){waitPopup=new BX.PopupWindow("sas_wait",window,{autoHide:true,lightShadow:true,zIndex:2,content:BX.create("DIV",{props:{className:"sonet-adminset-wait-cont"},children:[BX.create("DIV",{props:{className:"sonet-adminset-wait-icon"}}),BX.create("DIV",{props:{className:"sonet-adminset-wait-text"},html:BX.message("SASWaitTitle")})]})})}else waitPopup.setBindElement(window);waitPopup.show()}function __SASCloseWait(){if(waitTimeout){clearTimeout(waitTimeout);waitTimeout=null}if(waitPopup)waitPopup.close()}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:85:"/bitrix/components/bitrix/tasks.list/templates/.default/script.min.js?144932595415042";s:6:"source";s:65:"/bitrix/components/bitrix/tasks.list/templates/.default/script.js";s:3:"min";s:69:"/bitrix/components/bitrix/tasks.list/templates/.default/script.min.js";s:3:"map";s:69:"/bitrix/components/bitrix/tasks.list/templates/.default/script.map.js";}"*/
var loadedTasks={};var newTaskParent=0;var newTaskDepth=0;var newTaskGroup=0;var newTaskGroupObj;var tasksMenuPopup={};var quickInfoData={};var preOrder={};var TaskListFilterPopup={popup:null,init:function(e){if(this.popup!=null)return;this.popup=new BX.PopupWindow("task-list-filter",e,{content:BX("task-list-filter"),offsetLeft:-263+e.offsetWidth-10,offsetTop:3,className:"task-filter-popup-window",zIndex:-120,closeByEsc:true,events:{onPopupClose:function(e){if(tasksTagsPopUp!=null){tasksTagsPopUp.popupWindow.close()}}}});BX.bind(BX("task-list-filter"),"click",BX.delegate(this.onFilterSwitch,this))},show:function(e){if(!this.popup)this.init(e);if(BX.hasClass(e,"task-title-button-filter-pressed")){this.popup.close();BX.removeClass(e,"task-title-button-filter-pressed");this.adjustListHeight()}else{this.popup.show();BX.addClass(e,"task-title-button-filter-pressed");this.adjustListHeight();BX.bind(BX("task-list-filter"),"click",BX.proxy(this.onFilterClick,this));window.setTimeout(function(e,t){return function(){t.bindElement=e;BX.bind(document,"click",BX.proxy(t.onDocumentClick,t))}}(e,this),100)}},onFilterClick:function(e){if(!e)e=event;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true},onDocumentClick:function(){this.popup.close();BX.removeClass(this.bindElement,"task-title-button-filter-pressed");BX.removeClass(this.bindElement,"webform-small-button-active");this.adjustListHeight();BX.unbind(document,"click",BX.proxy(this.onDocumentClick,this));BX.unbind(BX("task-list-filter"),"click",BX.proxy(this.onFilterClick,this))},adjustListHeight:function(){var e=BX("task-list-container",true);if(!e)return;var t=e.offsetHeight-(parseInt(e.style.paddingBottom)||0);var s=this.popup?this.popup.popupContainer.offsetHeight:0;if(s>t)BX("task-list-container",true).style.paddingBottom=s-t+"px";else BX("task-list-container",true).style.paddingBottom="0px"},onFilterSwitch:function(e){e=e||window.event;var t=e.target||e.srcElement;if(BX.hasClass(t,"task-filter-mode-selected"))this.adjustListHeight()}};var tasksListTemplateDefaultInit=function(){if(BX("task-title-button-search-input",true)){BX.bind(BX("task-title-button-search-input",true),"click",function(e){if(!e)e=window.event;BX.addClass(this.parentNode.parentNode.parentNode,"task-title-button-search-full")});BX.bind(BX("task-title-button-search-input",true),"blur",function(e){if(!e)e=window.event;if(this.value==""){BX.removeClass(this.parentNode.parentNode.parentNode,"task-title-button-search-full")}});BX.bind(BX("task-title-button-search-input",true),"keyup",function(e){if(!e)e=window.event;if(e.keyCode==13){BX.submit(document.forms["task-filter-title-form"])}});BX.bind(BX("task-title-button-search-icon"),"click",function(e){if(!e)e=window.event;BX.submit(document.forms["task-filter-title-form"])})}};function showAjaxErrorPopup(){var e=new BX.PopupWindow("gantt-ajax-error-popup",null,{lightShadow:true,overlay:true,buttons:[new BX.PopupWindowButton({text:BX.message("JS_CORE_WINDOW_CLOSE"),className:"",events:{click:function(){BX.reload();this.popupWindow.close()}}})]});var t=[];for(var s=0;s<arguments.length;s++){var a=arguments[s];if(BX.type.isArray(a)){t=BX.util.array_merge(t,a)}else if(BX.type.isString(a)){t.push(a)}}var i="";for(s=0;s<t.length;s++){i+=(typeof t[s].MESSAGE!=="undefined"?t[s].MESSAGE:t[s])+"<br>"}e.setContent("<div class='task-new-item-error-popup'>"+i+"</div>");e.show()}function isLeftClick(e){if(!e.which&&e.button!==undefined){if(e.button&1)e.which=1;else if(e.button&4)e.which=2;else if(e.button&2)e.which=3;else e.which=0}return e.which==1||e.which==0&&BX.browser.IsIE()}function ShowPopupTask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;if(isLeftClick(t)){if(typeof tasksIFrameList=="undefined")tasksIFrameList=[];taskIFramePopup.view(e,tasksIFrameList);BX.PreventDefault(t)}}function AddQuickPopupTask(e,t){t=t||{};if(!e)e=window.event;if(!isLeftClick(e))return;BX.PreventDefault(e);BX.Tasks.lwPopup.showCreateForm(t)}function AddPopupTask(e,t){t=t||0;if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!e)e=window.event;if(isLeftClick(e)){var s=null;if(t>0)s={GROUP_ID:t};taskIFramePopup.add(s);BX.PreventDefault(e)}}function EditPopupTask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;if(isLeftClick(t)){taskIFramePopup.edit(e);BX.PreventDefault(t)}}function AddPopupSubtask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;if(isLeftClick(t)){taskIFramePopup.add({PARENT_ID:e});BX.PreventDefault(t)}}function CopyPopupTask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;if(isLeftClick(t)){taskIFramePopup.add({COPY:e});BX.PreventDefault(t)}}function AddPopupTemplateTask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;taskIFramePopup.add({TEMPLATE:e});BX.PreventDefault(t)}function AddPopupTemplateSubtask(e,t,s){if(!s)s=window.event;taskIFramePopup.add({TEMPLATE:e,PARENT_ID:t});BX.PreventDefault(s)}function AddPopupGroupTask(e,t){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i))return false;if(!t)t=window.event;taskIFramePopup.add({GROUP_ID:e});BX.PreventDefault(t)}function SetCSSStatus(e,t,s){BX.removeClass(e,s+"overdue");BX.removeClass(e,s+"new");BX.removeClass(e,s+"accepted");BX.removeClass(e,s+"in-progress");BX.removeClass(e,s+"delayed");BX.removeClass(e,s+"waiting");BX.removeClass(e,s+"completed");var a=e.getElementsByTagName("TD");var i=BX.findChild(a[0],{tagName:"a"},true);BX.style(i,"text-decoration","none");BX.addClass(e,s+t)}function SetServerStatus(e,t,s){var a=null;var i={mode:t,sessid:BX.message("bitrix_sessid"),path_to_task:BX.message("TASKS_PATH_TO_TASK"),id:e};if(typeof tasksListNS!=="undefined"&&tasksListNS.getColumnsOrder){a=tasksListNS.getColumnsOrder();i["columnsOrder"]=a}if(s){for(var n in s){i[n]=s[n]}}BX.ajax({method:"POST",dataType:"json",url:tasksListAjaxUrl,data:i,processData:true,onsuccess:function(e){return function(t){if(t.status!="success")return;var s=BX.parseJSON(t.tasksRenderJSON);quickInfoData[e].menuItems=s.menuItems;quickInfoData[e].realStatus=s.realStatus;tasksMenuPopup[e]=s.menuItems;if(typeof ganttChart!="undefined"){ganttChart.getTaskById(e).setMenuItems(__FilterMenuByStatus(quickInfoData[e]));var a=ganttChart.getTaskById(e);if(a){ganttChart.updateTask(a.id,s)}}if(BX.TasksTimerManager)BX.TasksTimerManager.reLoadInitTimerDataFromServer();if(window.BX.TasksIFrameInst)window.BX.TasksIFrameInst.onTaskChanged(s,null,null,null,s.html)}}(e)});__InvalidateMenus([e,"c"+e])}function ShowMenuPopup(e,t){if(tasksMenuPopup[e])BX.PopupMenu.show(e,t,__FilterMenuByStatus(quickInfoData[e]),{events:{onPopupClose:__onMenuPopupClose}});BX.addClass(t,"task-menu-button-selected");return false}function __onMenuPopupClose(){BX.removeClass(this.bindElement,"task-menu-button-selected")}function ShowMenuPopupContext(e,t){var s=t.target||t.srcElement;if(s&&s.tagName.toUpperCase()=="A")return true;if(tasksMenuPopup[e]){BX.PopupMenu.show("c"+e,t,__FilterMenuByStatus(quickInfoData[e]),{});BX.PopupMenu.getCurrentMenu().popupWindow.setBindElement(t);BX.PopupMenu.getCurrentMenu().popupWindow.adjustPosition()}BX.PreventDefault(t)}function __InvalidateMenus(e){for(var t=0,s=e.length;t<s;t++){BX.PopupMenu.destroy(e[t])}}function __FilterMenuByStatus(e){var t=[];for(var s=0,a=e.menuItems.length;s<a;s++){if(typeof e.menuItems[s].status=="undefined"||BX.util.in_array(e.realStatus,e.menuItems[s].status)){t.push(e.menuItems[s])}}return t}var titleBuffer="";function ShowTaskQuickInfo(e,t){if(quickInfoData[e]){titleBuffer=BX("task-"+e).title;BX("task-"+e).title="";BX.fixEventPageXY(t);var s={left:t.pageX,top:t.pageY,bottom:t.pageY};BX.TaskQuickInfo.show(s,quickInfoData[e],{offsetTop:10,dateFormat:"DD.MM.YYYY",onDetailClick:TaskQuickInfoDetail,userProfileUrl:"/company/personal/user/#user_id#/"})}}function HideTaskQuickInfo(e,t){BX("task-"+e).title=titleBuffer;BX.TaskQuickInfo.hide()}function TaskQuickInfoDetail(e,t,s){t.close();ShowPopupTask(s.task.id,e)}function ShowTemplatesPopup(e){var t=BX("task-popup-templates-popup-content",true);BX.PopupWindowManager.create("task-templates-popup",e,{autoHide:true,offsetTop:1,events:{onPopupClose:__onTemplatesPopupClose},content:t}).show();BX.addClass(e,"webform-button-active");return false}function __onTemplatesPopupClose(){BX.removeClass(this.bindElement,"webform-button-active")}function SwitchTaskFilter(e){if(BX.hasClass(e,"task-filter-mode-selected"))return false;BX.toggleClass(e.parentNode.parentNode.parentNode,"task-filter-advanced-mode");var t=e.parentNode.getElementsByTagName("a");for(var s=0;s<t.length;s++)BX.toggleClass(t[s],"task-filter-mode-selected");return false}function Add2Timeman(e,t){var s=false;var a=BX.findChild(e.popupWindow.contentContainer,{tagName:"a",className:"menu-popup-item-add-to-tm"},true);BX.remove(BX.findPreviousSibling(a));BX.remove(a);e.popupWindow.close();if(BX.addTaskToPlanner)BX.addTaskToPlanner(t);else if(window.top.BX.addTaskToPlanner)window.top.BX.addTaskToPlanner(t)}function ShowQuickTask(e,t){if(t){if(t.parent){var s=BX("task-"+t.parent);if(s)e=BX.findParent(s,{tag:"table"})}else if(t.group){var a=BX("task-project-"+t.group.id);if(a)e=BX.findParent(a,{tag:"table"})}}if(!e)e=BX.findParent(BX("task-new-item-row",true),{tag:"table"});if(BX("task-detail-subtasks-block")&&BX("task-detail-subtasks-block").style.display=="none")BX("task-detail-subtasks-block").style.display="";var i=e.tBodies[0];if(!t){t={}}if(typeof newTaskGroup==="undefined"){newTaskDepth=newTaskParent=newTaskGroup=0;newTaskGroupObj=null}var n=i.rows[0];if(t.group||t.parent){if(t.group){var o=function(e,t,s){if(typeof window["groupsPopup"]==="undefined"){if(t>0){window.setTimeout(function(){o(e,t-e,s)},e)}}else{groupsPopup.select(s)}};o(100,15e3,t.group);if(t.group.id>0){newTaskGroup=t.group.id;if(BX("task-project-"+newTaskGroup)){n=BX.findNextSibling(BX("task-project-"+newTaskGroup),{tag:"tr"})}}}if(t.parent){newTaskParent=parseInt(t.parent)>0?parseInt(t.parent):0;if(BX("task-"+newTaskParent,true)){newTaskDepth=Depth(BX("task-"+newTaskParent,true))+1;n=BX.findNextSibling(BX("task-"+newTaskParent,true),{tag:"tr"})}}BX.removeClass(BX("task-new-item-icon"),"task-list-mode-selected")}if(!t.parent){newTaskDepth=0;newTaskParent=0}if(n!=BX("task-new-item-row",true)){if(n){i.insertBefore(BX("task-new-item-row",true),n)}else{i.appendChild(BX("task-new-item-row",true))}}BX.removeClass(BX("task-new-item-row",true),"task-list-item-hidden");BX("task-new-item-name").focus();var r=0;if(t.group&&t.group.id)r=t.group.id;var u=BX.message("USER_ID");if(t.user&&t.user.id)u=t.user.id;if(BX("task-new-item-responsible")){if(!window.groupsPopup){BX("task-new-item-responsible").disabled=true;BX("task-new-item-link-group").style.display="none";BX.Tasks.lwPopup.__initSelectors([{requestedObject:"intranet.user.selector.new",selectedUsersIds:u,anchorId:"task-new-item-responsible",bindClickTo:"task-new-item-responsible",userInputId:"task-new-item-responsible",multiple:"N",GROUP_ID_FOR_SITE:r,callbackOnSelect:function(e){BX("task-new-item-responsible-hidden").value=e.id},onLoadedViaAjax:function(){BX("task-new-item-responsible").disabled=false}},{requestedObject:"socialnetwork.group.selector",bindElement:"task-new-item-link-group",callbackOnSelect:function(e,t){onGroupSelect(e)},onLoadedViaAjax:function(e){var t=function(s,a){if(typeof window[e]==="undefined"){if(a>0)window.setTimeout(function(){t(s,a-s)},s)}else{window.groupsPopup=window[e];BX("task-new-item-link-group").style.display=""}};t(100,15e3)}}])}}}function ToggleSubtasks(e,t,s){if(!tasksListNS||!tasksListNS.isReady){window.setTimeout(function(e,t,s){return function(){ToggleSubtasks(e,t,s)}}(e,t,s),500);return}if(loadedTasks[s]){var a=BX.findNextSibling(e,{tagName:"tr"});while(a&&Depth(a)>t){if(BX.hasClass(e,"task-list-item-opened")){BX.addClass(a,"task-list-item-hidden");BX.removeClass(a,"task-list-item-opened")}else if(BX.hasClass(a,"task-depth-"+(t+1))){BX.removeClass(a,"task-list-item-hidden")}a=BX.findNextSibling(a,{tagName:"tr"})}BX.toggleClass(e,"task-list-item-opened")}else{var i={sessid:BX.message("bitrix_sessid"),id:s,depth:t,filter:tasksListNS.arFilter,order:arOrder,columnsOrder:tasksListNS.getColumnsOrder(),path_to_user:BX.message("TASKS_PATH_TO_USER_PROFILE"),path_to_task:BX.message("TASKS_PATH_TO_TASK"),mode:"load"};loadedTasks[s]=true;BX.ajax({method:"POST",dataType:"html",url:tasksListAjaxUrl,data:i,processData:false,onsuccess:function(){var a=function(a){var i=document.createElement("div");i.innerHTML="<table>"+a+"</table>";var n=i.firstChild.getElementsByTagName("TR");var o=i.firstChild.getElementsByTagName("SCRIPT");for(var r=n.length-1;r>=0;r--){if(!BX(n[r].id)){e.parentNode.insertBefore(n[r],e.nextSibling);if(!BX.browser.IsIE()||!!document.documentMode&&document.documentMode>=10){var u=BX.create("script",{props:{type:"text/javascript"},html:o[r].innerHTML})}else{var u=o[r]}e.parentNode.insertBefore(u,e.nextSibling)}}ToggleSubtasks(e,t,s)};return a}()})}}function Depth(e){var t=/task-depth-([0-9]+)/;var s=t.exec(e.className);if(s){return parseInt(s[1])}else{return 0}}function ShowGradePopup(e,t,s){BX.TaskGradePopup.show(e,t,s,{events:{onPopupClose:__onGradePopupClose,onPopupChange:__onGradePopupChange}});BX.addClass(t,"task-grade-and-report-selected");return false}function __onGradePopupClose(){BX.removeClass(this.bindElement,"task-grade-and-report-selected")}function __onGradePopupChange(){this.bindElement.className="task-grade-and-report"+(this.listValue!="NULL"?" task-grade-"+this.listItem.className:"")+(this.report?" task-in-report":"");this.bindElement.title=BX.message("TASKS_MARK")+": "+this.listItem.name;var e={mode:"mark",sessid:BX.message("bitrix_sessid"),id:this.id,mark:this.listValue,report:this.report};BX.ajax.post(tasksListAjaxUrl,e)}function ShowPriorityPopup(e,t,s){BX.TaskPriorityPopup.show(e,t,s,{events:{onPopupClose:__onPriorityPopupClose,onPopupChange:__onPriorityChange}});BX.addClass(t,"task-priority-box-selected");return false}function __onPriorityPopupClose(){BX.removeClass(this.bindElement,"task-priority-box-selected")}function __onPriorityChange(){BX.removeClass(this.bindElement,"task-priority-box-selected");this.bindElement.title=BX.message("TASKS_PRIORITY")+": "+this.listItem.name;this.bindElement.childNodes[0].className="task-priority-icon task-priority-"+this.listValue;var e={mode:"priority",sessid:BX.message("bitrix_sessid"),id:this.id,path_to_user:BX.message("TASKS_PATH_TO_USER_PROFILE"),path_to_task:BX.message("TASKS_PATH_TO_TASK"),priority:this.listValue};BX.ajax.post(tasksListAjaxUrl,e)}function tasksFormatDate(e){return BX.date.format(BX.date.convertBitrixFormat(BX.message("FORMAT_DATETIME")),e)}function onDetails(e){ShowPopupTask(this.id,e.event)}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:88:"/bitrix/components/bitrix/tasks.list/templates/.default/gantt-view.min.js?14493259543755";s:6:"source";s:69:"/bitrix/components/bitrix/tasks.list/templates/.default/gantt-view.js";s:3:"min";s:73:"/bitrix/components/bitrix/tasks.list/templates/.default/gantt-view.min.js";s:3:"map";s:73:"/bitrix/components/bitrix/tasks.list/templates/.default/gantt-view.map.js";}"*/
var tasksListNS={approveTask:function(t){ganttChart.updateTask(t,{status:"completed",dateCompleted:new Date});SetServerStatus(t,"approve")},disapproveTask:function(t){ganttChart.updateTask(t,{status:"new",dateCompleted:null});SetServerStatus(t,"disapprove")}};function CloseTask(t){ganttChart.updateTask(t,{status:"completed",dateCompleted:new Date});SetServerStatus(t,"close")}function StartTask(t){ganttChart.updateTask(t,{status:"in-progress",dateCompleted:null});SetServerStatus(t,"start")}function AcceptTask(t){ganttChart.updateTask(t,{status:"accepted",dateCompleted:null});SetServerStatus(t,"accept")}function PauseTask(t){ganttChart.updateTask(t,{status:"accepted",dateCompleted:null});SetServerStatus(t,"pause")}function RenewTask(t){ganttChart.updateTask(t,{status:"new",dateCompleted:null});SetServerStatus(t,"renew")}function DeferTask(t){ganttChart.updateTask(t,{status:"delayed"});SetServerStatus(t,"defer")}function DeclineTask(t){BX.TaskDeclinePopup.show(link,{offsetLeft:-100,taskId:this.id,events:{onPopupChange:function(){ganttChart.updateTask(t,{status:"declined"});SetServerStatus(t,"decline",{reason:this.textarea.value})}}})}function AddToFavorite(t,e){var a={mode:"favorite",add:1,sessid:BX.message("bitrix_sessid"),id:t};BX.ajax({method:"POST",dataType:"html",url:tasksListAjaxUrl,data:a,processData:false,onsuccess:function(t){return function(t){}}(t)})}function DeleteFavorite(t,e){var a={mode:"favorite",sessid:BX.message("bitrix_sessid"),id:t};BX.ajax({method:"POST",dataType:"html",url:tasksListAjaxUrl,data:a,processData:false,onsuccess:function(t){if(e.rowDelete){return function(a){TASKS_table_view_onDeleteClick_onSuccess(t,a,e)}}}(t)})}function DeleteTask(t){var e={mode:"delete",sessid:BX.message("bitrix_sessid"),id:t};BX.ajax({method:"POST",dataType:"html",url:tasksListAjaxUrl,data:e,processData:false,onsuccess:function(t){return function(e){TASKS_table_view_onDeleteClick_onSuccess(t,e)}}(t)})}function TASKS_table_view_onDeleteClick_onSuccess(t,e){if(e&&e.length>0){}else{ganttChart.removeTask(t);BX.onCustomEvent("onTaskListTaskDelete",[t])}}function onPopupTaskChanged(t){__RenewMenuItems(t);__InvalidateMenus([t.id,"c"+t.id]);if(t.parentTaskId){var e=ganttChart.getTaskById(t.parentTaskId);if(e){if(e.hasChildren){e.expand();ganttChart.updateTask(t.id,t)}else{ganttChart.updateTask(t.id,t);e.expand()}}else{ganttChart.updateTask(t.id,t)}}else if(t.projectId&&!ganttChart.getProjectById(t.projectId)){var a=ganttChart.addProjectFromJSON({id:t.projectId,name:t.projectName,opened:true,canCreateTasks:t.projectCanCreateTasks,canEditTasks:t.projectCanEditTasks});ganttChart.updateTask(t.id,t)}else{ganttChart.updateTask(t.id,t)}}function onPopupTaskAdded(t){BX.onCustomEvent("onTaskListTaskAdd",[t]);__RenewMenuItems(t);if(t.projectId&&!ganttChart.getProjectById(t.projectId)){ganttChart.addProjectFromJSON({id:t.projectId,name:t.projectName,opened:true,canCreateTasks:t.projectCanCreateTasks,canEditTasks:t.projectCanEditTasks})}ganttChart.addTaskFromJSON(t);if(t.parentTaskId){var e=ganttChart.getTaskById(t.parentTaskId);if(e){e.expand()}}}function onPopupTaskDeleted(t){ganttChart.removeTask(t)}var lastScroll;function onBeforeShow(){if(BX.browser.IsOpera()){lastScroll=ganttChart.layout.timeline.scrollLeft}}function onAfterShow(){if(typeof lastScroll!="undefined"&&BX.browser.IsOpera()){ganttChart.layout.timeline.scrollLeft=lastScroll}}function onBeforeHide(){if(BX.browser.IsOpera()){lastScroll=ganttChart.layout.timeline.scrollLeft}}function onAfterHide(){if(typeof lastScroll!="undefined"&&BX.browser.IsOpera()){ganttChart.layout.timeline.scrollLeft=lastScroll}}function __RenewMenuItems(t){quickInfoData[t.id]=BX.clone(t,true);t.menuItems=__FilterMenuByStatus(t)}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:86:"/bitrix/components/bitrix/tasks.filter.v2/templates/.default/script.js?141874981312025";s:6:"source";s:70:"/bitrix/components/bitrix/tasks.filter.v2/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var filterResponsiblePopup, filterCreatedByPopup, filterAccomplicePopup, filterAuditorPopup;

function clearUser(e) {
	if(!e) e = window.event;

	BX.findPreviousSibling(this, {tagName : "input"}).value = "";
	var parent = this.parentNode.parentNode;
	var input = BX.findNextSibling(parent, {tagName : "input"})
	window[input.name.replace("F_", "O_FILTER_")].unselect(input.value);
	input.value = "0";
	BX.addClass(parent, "webform-field-textbox-empty");

	BX.PreventDefault(e);
}


if ( ! BX.Tasks )
	BX.Tasks = {};

// This is wrapper for ON DEMAND loading of filter constructor.
// Because in more than 99% cases users will not be use filter constructor,
// it is too expensive to initialize filter constructor every time.
if ( ! BX.Tasks.filterV2 )
{
	BX.Tasks.filterV2 = {
		engine             : null,
		isEngineLoaded     : false,
		isLockedForLoading : false,
		usePresetAfterLoad : null,
		pathToEngineScript : null,

		__loadEngine : function(params)
		{
			BX.addCustomEvent(
				BX.Tasks.filterV2,
				'onConstructorLoad',
				(function(params)
				{
					return function()
					{
						params.onAfterLoad();
					}
				})(params)
			);

			BX.loadScript(
				this.pathToEngineScript,
				function()
				{
					var postData = {
						sessid :  BX.message('bitrix_sessid'),
						action : 'loadFilterConstructorJs'
					};

					BX.ajax({
						method      : 'POST',
						dataType    : 'html',
						url         : '/bitrix/components/bitrix/tasks.filter.v2/ajax.php',
						data        :  postData,
						processData :  true,
						onsuccess   : (function(){
							return function(reply){
							}
						})()
					});
				}
			);
		},

		editPreset : function (presetId, isIgnoreLock)
		{
			isIgnoreLock = (typeof isIgnoreLock === 'undefined') ? false : isIgnoreLock;

			if ( !isIgnoreLock && this.isLockedForLoading)
			{
				this.usePresetAfterLoad = presetId;
				return;
			}

			if ( ! this.isEngineLoaded )
			{
				this.isLockedForLoading = true;
				this.usePresetAfterLoad = presetId;

				this.__loadEngine({
					onAfterLoad : (function(objSelf)
					{
						return function()
						{
							objSelf.isEngineLoaded = true;
							objSelf.editPreset(objSelf.usePresetAfterLoad, true);
							objSelf.isLockedForLoading = false;
						};
					})(this, presetId)
				});

				return;
			}

			if (presetId)
				this.engine.editPreset(presetId);
			else
				this.engine.createPreset();
		}
	};
}


var tasksFilterV2DefaultTemplateInit = function() {
	
	if (BX("filter-field-responsible"))
	{
		BX.bind(BX("filter-field-responsible"), "click", function(e) {

			if(!e) e = window.event;

			filterResponsiblePopup = BX.PopupWindowManager.create("filter-responsible-employee-popup", this.parentNode, {
				offsetTop : 1,
				autoHide : true,
				closeByEsc : true,
				content : BX("FILTER_RESPONSIBLE_selector_content")
			});

			filterResponsiblePopup.show();
			
			BX.addCustomEvent(filterResponsiblePopup, "onPopupClose", onFilterResponsibleClose);
			
			this.value = "";
			BX.focus(this);

			BX.PreventDefault(e);
		});
		BX.bind(BX.findNextSibling(BX("filter-field-responsible"), {tagName : "a"}), "click", clearUser);
		BX.bind(BX("filter-field-director"), "click", function(e) {

			if(!e) e = window.event;

			filterCreatedByPopup = BX.PopupWindowManager.create("filter-director-employee-popup", this.parentNode, {
				offsetTop : 1,
				autoHide : true,
				closeByEsc : true,
				content : BX("FILTER_CREATED_BY_selector_content")
			});

			filterCreatedByPopup.show();
			
			BX.addCustomEvent(filterCreatedByPopup, "onPopupClose", onFilterCreatedByClose);
			
			this.value = "";
			BX.focus(this);

			BX.PreventDefault(e);
		});
		BX.bind(BX.findNextSibling(BX("filter-field-director"), {tagName : "a"}), "click", clearUser);
		BX.bind(BX("filter-field-assistant"), "click", function(e) {

			if(!e) e = window.event;

			filterAccomplicePopup = BX.PopupWindowManager.create("filter-assistant-employee-popup", this.parentNode, {
				offsetTop : 1,
				autoHide : true,
				closeByEsc : true,
				content : BX("FILTER_ACCOMPLICE_selector_content")
			});

			filterAccomplicePopup.show();
			
			BX.addCustomEvent(filterAccomplicePopup, "onPopupClose", onFilterAccompliceClose);
			
			this.value = "";
			BX.focus(this);

			BX.PreventDefault(e);
		});
		BX.bind(BX.findNextSibling(BX("filter-field-assistant"), {tagName : "a"}), "click", clearUser);
		BX.bind(BX("filter-field-auditor"), "click", function(e) {

			if(!e) e = window.event;

			filterAuditorPopup = BX.PopupWindowManager.create("filter-auditor-employee-popup", this.parentNode, {
				offsetTop : 1,
				autoHide : true,
				closeByEsc : true,
				content : BX("FILTER_AUDITOR_selector_content")
			});

			filterAuditorPopup.show();
			
			BX.addCustomEvent(filterAuditorPopup, "onPopupClose", onFilterAuditorClose);
			
			this.value = "";
			BX.focus(this);

			BX.PreventDefault(e);
		});
		BX.bind(BX.findNextSibling(BX("filter-field-auditor"), {tagName : "a"}), "click", clearUser);
	
		BX.bind(BX("filter-field-group"), "click", function(e) {

			if(!e) e = window.event;

			filterGroupsPopup.show();

			BX.PreventDefault(e);
		});
		BX.bind(BX.findNextSibling(BX("filter-field-group"), {tagName : "a"}), "click", function(e){
			if(!e) e = window.event;

			var parent = this.parentNode.parentNode;
			var input = BX.findNextSibling(parent, {tagName : "input"})
			filterGroupsPopup.deselect(input.value);
			input.value = "0";
			BX.addClass(parent, "webform-field-textbox-empty");

			BX.PreventDefault(e);
		});

		BX.bind(BX("filter-date-interval-calendar-from"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_DATE_FROM", "F_DATE_FROM", "task-filter-advanced-form", true, curTimestamp, '', false);
			BX.calendar({
				node: this, 
				field: "F_DATE_FROM", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});
	
			BX.PreventDefault(e);
		});
	
		BX.bind(BX("filter-date-interval-calendar-to"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_DATE_TO", "F_DATE_TO", "task-filter-advanced-form", true, curTimestamp, '', false);
			BX.calendar({
				node: this, 
				field: "F_DATE_TO", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});

			BX.PreventDefault(e);
		});
		
		BX.bind(BX("filter-closed-interval-calendar-from"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_CLOSED_FROM", "F_CLOSED_FROM", "task-filter-advanced-form", true, curTimestamp, '', false);
			BX.calendar({
				node: this, 
				field: "F_CLOSED_FROM", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});
	
			BX.PreventDefault(e);
		});
	
		BX.bind(BX("filter-active-interval-calendar-to"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_ACTIVE_TO", "F_ACTIVE_TO", "task-filter-advanced-form", true, curTimestamp, '', false);
				BX.calendar({
				node: this, 
				field: "F_ACTIVE_TO", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});

			BX.PreventDefault(e);
		});
		
		BX.bind(BX("filter-active-interval-calendar-from"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_ACTIVE_FROM", "F_ACTIVE_FROM", "task-filter-advanced-form", true, curTimestamp, '', false);
				BX.calendar({
				node: this, 
				field: "F_ACTIVE_FROM", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});

			BX.PreventDefault(e);
		});
	
		BX.bind(BX("filter-closed-interval-calendar-to"), "click", function(e) {
			if (!e) e = window.event;
			
			var curDate = new Date();
			var curTimestamp = Math.round(curDate / 1000) - curDate.getTimezoneOffset()*60;
			//jsCal endar. Show(this, "F_CLOSED_TO", "F_CLOSED_TO", "task-filter-advanced-form", true, curTimestamp, '', false);
			BX.calendar({
				node: this, 
				field: "F_CLOSED_TO", 
				form: "task-filter-advanced-form", 
				bTime: true, 
				currentTime: curTimestamp, 
				bHideTimebar: false
			});
	
			BX.PreventDefault(e);
		});
		
		BX.bind(BX("filter-field-tags-link"), "click", TasksShowTagsPopup);
		
		BX.addCustomEvent(tasksTagsPopUp, "onUpdateTagLine", function (e) {
			var tags = this.windowArea.getSelectedTags();
			var tagsString = "";
			for (var i = 0, length = tags.length; i < length; i++)
			{
				if (i > 0)
					tagsString += ", ";
				tagsString += tags[i].name
			}
			var tagLine = BX("task-filter-tags-line");
			BX.cleanNode(tagLine);
			BX.adjust(tagLine, {text : tagsString} );
			
			document.forms["task-filter-advanced-form"]["F_TAGS"].value = tagsString;
		});
	
	}
};

/*=====================Filter Popups===============================*/

function onFilterResponsibleSelect(arUser)
{
	document.forms["task-filter-advanced-form"]["F_RESPONSIBLE"].value = arUser.id;
	
	BX.removeClass(BX("filter-field-responsible").parentNode.parentNode, "webform-field-textbox-empty");
	
	filterResponsiblePopup.close();
}

function onFilterResponsibleClose()
{
	var emp = O_FILTER_RESPONSIBLE.arSelected.pop();
	if (emp)
	{
		O_FILTER_RESPONSIBLE.arSelected.push(emp);
		O_FILTER_RESPONSIBLE.searchInput.value = emp.name;
	}
}

function onFilterCreatedBySelect(arUser)
{
	document.forms["task-filter-advanced-form"]["F_CREATED_BY"].value = arUser.id;
	
	BX.removeClass(BX("filter-field-director").parentNode.parentNode, "webform-field-textbox-empty");
	
	filterCreatedByPopup.close();
}

function onFilterCreatedByClose()
{
	var emp = O_FILTER_CREATED_BY.arSelected.pop();
	if (emp)
	{
		O_FILTER_CREATED_BY.arSelected.push(emp);
		O_FILTER_CREATED_BY.searchInput.value = emp.name;
	}
}

function onFilterAccompliceSelect(arUser)
{
	document.forms["task-filter-advanced-form"]["F_ACCOMPLICE"].value = arUser.id;
	
	BX.removeClass(BX("filter-field-assistant").parentNode.parentNode, "webform-field-textbox-empty");
	
	filterAccomplicePopup.close();
}

function onFilterAccompliceClose()
{
	var emp = O_FILTER_ACCOMPLICE.arSelected.pop();
	if (emp)
	{
		O_FILTER_ACCOMPLICE.arSelected.push(emp);
		O_FILTER_ACCOMPLICE.searchInput.value = emp.name;
	}
}

function onFilterAuditorSelect(arUser)
{
	document.forms["task-filter-advanced-form"]["F_AUDITOR"].value = arUser.id;
	
	BX.removeClass(BX("filter-field-auditor").parentNode.parentNode, "webform-field-textbox-empty");
	
	filterAuditorPopup.close();
}

function onFilterAuditorClose()
{
	var emp = O_FILTER_AUDITOR.arSelected.pop();
	if (emp)
	{
		O_FILTER_AUDITOR.arSelected.push(emp);
		O_FILTER_AUDITOR.searchInput.value = emp.name;
	}
}

function onFilterGroupSelect(arGroups)
{
	if (arGroups[0])
	{
		document.forms["task-filter-advanced-form"]["F_GROUP_ID"].value = arGroups[0].id;

		BX.removeClass(BX("filter-field-group").parentNode.parentNode, "webform-field-textbox-empty");
	}
}

function onUpdateTagLine(e) {
	var tags = this.windowArea.getSelectedTags();
	var tagsString = "";
	for (var i = 0, length = tags.length; i < length; i++)
	{
		if (i > 0)
			tagsString += ", ";
		tagsString += tags[i].name
	}
	var tagLine = BX("task-filter-tags-line");
	BX.cleanNode(tagLine);
	BX.adjust(tagLine, {text : tagsString} );

	document.forms["task-filter-advanced-form"]["F_TAGS"].value = tagsString;
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?144872421613896";s:6:"source";s:80:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.js";s:3:"min";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js";s:3:"map";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.map.js";}"*/
(function(){if(window.IntranetUsers)return;window.IntranetUsers=function(e,t,a){this.name=e;this.multiple=t;this.arSelected=[];this.arFixed=[];this.bSubordinateOnly=a;this.ajaxUrl="";this.lastSearchTime=0};IntranetUsers.arStructure={};IntranetUsers.bSectionsOnly=false;IntranetUsers.arEmployees={group:{}};IntranetUsers.arEmployeesData={};IntranetUsers.ajaxUrl="";IntranetUsers.prototype.loadGroup=function(e){var t=BX(this.name+"_group_section_"+e);function a(t){IntranetUsers.arEmployees["group"][e]=t;this.show(e,t,"g")}e=parseInt(e);if(IntranetUsers.arEmployees["group"][e]!=null){this.show(e,IntranetUsers.arEmployees["group"][e],"g")}else{var s=this.getAjaxUrl()+"&MODE=EMPLOYEES&GROUP_ID="+e;BX.ajax.loadJSON(s,BX.proxy(a,this))}BX.toggleClass(t,"company-department-opened");BX.toggleClass(BX(this.name+"_gchildren_"+e),"company-department-children-opened")};IntranetUsers.prototype.load=function(e,t,a,s){this.bSectionsOnly=s;function n(t){IntranetUsers.arStructure[e]=t.STRUCTURE;IntranetUsers.arEmployees[e]=t.USERS;this.show(e,false,"",this.bSectionsOnly)}if(null==t)t=false;if(null==a)a=false;if(null==s)s=false;if(e!="extranet")e=parseInt(e);var r=BX(this.name+"_employee_section_"+e);if(!r.BX_LOADED){if(IntranetUsers.arEmployees[e]!=null){this.show(e,false,"",this.bSectionsOnly)}else{var i=this.getAjaxUrl()+"&MODE=EMPLOYEES&SECTION_ID="+e;BX.ajax.loadJSON(i,BX.proxy(n,this))}}if(a){BX(this.name+"_employee_search_layout").scrollTop=r.offsetTop-40}BX.toggleClass(r,"company-department-opened");BX.toggleClass(BX(this.name+"_children_"+e),"company-department-children-opened")};IntranetUsers.prototype.show=function(e,t,a,s){s=!!s;a=a||"";var n=BX(this.name+"_"+a+"employee_section_"+e);var r=t||IntranetUsers.arEmployees[e];if(n!==null){n.BX_LOADED=true}var i=BX(this.name+"_"+a+"employees_"+e);if(i){if(IntranetUsers.arStructure[e]!=null&&!a){var l=IntranetUsers.arStructure[e];var o=BX(this.name+"_"+a+"children_"+e);if(o){for(var c=0;c<l.length;c++){obSectionRow1=BX.create("div",{props:{className:"company-department"},children:[s?BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-arrow"},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+", false, false, true)"}}),BX.create("div",{props:{className:"company-department-text"},attrs:{"data-section-id":l[c].ID,onclick:"O_"+this.name+".selectSection("+this.name+"_employee_section_"+l[c].ID+")"},text:l[c].NAME})]}):BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+")"},children:[BX.create("div",{props:{className:"company-department-arrow"}}),BX.create("div",{props:{className:"company-department-text"},text:l[c].NAME})]})]});obSectionRow2=BX.create("div",{props:{className:"company-department-children",id:this.name+"_children_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-employees",id:this.name+"_employees_"+l[c].ID},children:[BX.create("span",{props:{className:"company-department-employees-loading"},text:BX.message("INTRANET_EMP_WAIT")})]})]});o.appendChild(obSectionRow1);o.appendChild(obSectionRow2)}o.appendChild(i)}}i.innerHTML="";for(var c=0;c<r.length;c++){var d;var p=false;IntranetUsers.arEmployeesData[r[c].ID]={id:r[c].ID,name:r[c].NAME,sub:r[c].SUBORDINATE=="Y"?true:false,sup:r[c].SUPERORDINATE=="Y"?true:false,position:r[c].WORK_POSITION,photo:r[c].PHOTO};var m=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){m.name=this.name+"[]";m.type="checkbox"}else{m.name=this.name;m.type="radio"}var h=document.getElementsByName(m.name);var u=0;while(!p&&u<h.length){if(h[u].value==r[c].ID&&h[u].checked){p=true}u++}m.value=r[c].ID;d=BX.create("div",{props:{className:"company-department-employee"+(p?" company-department-employee-selected":"")},events:{click:BX.proxy(this.select,this)},children:[m,BX.create("div",{props:{className:"company-department-employee-avatar"},style:{background:r[c].PHOTO?"url('"+r[c].PHOTO+"') no-repeat center center":""}}),BX.create("div",{props:{className:"company-department-employee-icon"}}),BX.create("div",{props:{className:"company-department-employee-info"},children:[BX.create("div",{props:{className:"company-department-employee-name"},text:r[c].NAME}),BX.create("div",{props:{className:"company-department-employee-position"},html:!r[c].HEAD&&!r[c].WORK_POSITION?"&nbsp;":BX.util.htmlspecialchars(r[c].WORK_POSITION)+(r[c].HEAD&&r[c].WORK_POSITION?", ":"")+(r[c].HEAD?BX.message("INTRANET_EMP_HEAD"):"")})]})]});i.appendChild(d)}}};IntranetUsers.prototype.select=function(e){var t;var a=0;var s=e.target||e.srcElement;if(e.currentTarget){t=e.currentTarget}else{t=s;while(!BX.hasClass(t,"finder-box-item")&&!BX.hasClass(t,"company-department-employee")){t=t.parentNode}}var n=BX.findChild(t,{tag:"input"});if(!this.multiple){var r=document.getElementsByName(this.name);for(var a=0;a<r.length;a++){if(r[a].value!=n.value){BX.removeClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}else{BX.addClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}n.checked=true;BX.addClass(t,BX.hasClass(t,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected");this.searchInput.value=IntranetUsers.arEmployeesData[n.value].name;this.arSelected=[];this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}else{var r=document.getElementsByName(this.name+"[]");if(!BX.util.in_array(n,r)&&!BX.util.in_array(n.value,this.arFixed)){n.checked=false;BX.toggleClass(n.parentNode,BX.hasClass(n.parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}for(var a=0;a<r.length;a++){if(r[a].value==n.value&&!BX.util.in_array(n.value,this.arFixed)){r[a].checked=false;BX.toggleClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(BX.hasClass(n.parentNode,"finder-box-item-selected")||BX.hasClass(n.parentNode,"company-department-employee-selected")){n.checked=true}if(n.checked){var i=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});if(!BX(this.name+"_employee_selected_"+n.value)){var l=BX.create("DIV");l.id=this.name+"_employee_selected_"+n.value;l.className="finder-box-selected-item";var o=BX.findChild(t,{tag:"DIV",className:"finder-box-item-text"},true)||BX.findChild(t,{tag:"DIV",className:"company-department-employee-name"},true);l.innerHTML='<div class="finder-box-selected-item-icon" id="user-selector-unselect-'+n.value+'" onclick="O_'+this.name+".unselect("+n.value+', this);"></div><span class="finder-box-selected-item-text">'+o.innerHTML+"</span>";i.appendChild(l);var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)+1;this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}}else{BX.remove(BX(this.name+"_employee_selected_"+n.value));var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)-1;this.arSelected[n.value]=null}}var d=BX.util.array_search(n.value,IntranetUsers.lastUsers);if(d>=0)IntranetUsers.lastUsers.splice(d,1);IntranetUsers.lastUsers.unshift(n.value);BX.userOptions.save("intranet","user_search","last_selected",IntranetUsers.lastUsers.slice(0,10));if(this.onSelect){var p=this.arSelected.pop();this.arSelected.push(p);this.onSelect(p)}BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.toObject=function(e){var t={};for(var a in e){a=parseInt(a);if(typeof a=="number"&&e[a]!==null){t[a]=BX.clone(e[a])}}return t};IntranetUsers.prototype.selectSection=function(e){var t=BX(e);if(!t){return false}else{var a=BX.findChild(t,{tag:"div",className:"company-department-text"});if(a){if(this.onSectionSelect){this.onSectionSelect({id:a.getAttribute("data-section-id"),name:a.innerHTML})}}}};IntranetUsers.prototype.unselect=function(e){var t=BX("user-selector-unselect-"+e);var a=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var s=0;s<a.length;s++){if(a[s].value==e){a[s].checked=false;BX.removeClass(a[s].parentNode,BX.hasClass(a[s].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(this.multiple){if(t){BX.remove(t.parentNode)}var n=BX(this.name+"_current_count");n.innerHTML=parseInt(n.innerHTML)-1}this.arSelected[e]=null;BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.getSelected=function(){return this.arSelected};IntranetUsers.prototype.setSelected=function(e){for(var t=0,a=this.arSelected.length;t<a;t++){if(this.arSelected[t]&&this.arSelected[t].id)this.unselect(this.arSelected[t].id)}if(!this.multiple){e=[e[0]]}this.arSelected=[];for(var t=0,a=e.length;t<a;t++){this.arSelected[e[t].id]=e[t];var s=BX.create("input",{props:{className:"intranet-hidden-input",value:e[t].id,checked:"checked",name:this.name+(this.multiple?"[]":"")}});BX(this.name+"_last").appendChild(s);if(this.multiple){var n=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});var r=BX.create("div",{props:{className:"finder-box-selected-item",id:this.name+"_employee_selected_"+e[t].id},html:'<div class="finder-box-selected-item-icon" id="user-selector-unselect-'+e[t].id+'" onclick="O_'+this.name+".unselect("+e[t].id+', this);"></div><span class="finder-box-selected-item-text">'+BX.util.htmlspecialchars(e[t].name)+"</span>"});n.appendChild(r)}var i=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var l=0;l<i.length;l++){if(i[l].value==e[t].id){BX.toggleClass(i[l].parentNode,BX.hasClass(i[l].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}}if(this.multiple){BX.adjust(BX(this.name+"_current_count"),{text:e.length})}};IntranetUsers.prototype.setFixed=function(e){if(typeof e!="object")e=[];this.arFixed=e;var t=BX.findChildren(BX(this.name+"_selected_users"),{className:"finder-box-selected-item-icon"},true);for(i=0;i<t.length;i++){var a=t[i].id.replace("user-selector-unselect-","");BX.adjust(t[i],{style:{visibility:BX.util.in_array(a,this.arFixed)?"hidden":"visible"}})}};IntranetUsers.prototype.search=function(e){this.searchRqstTmt=clearTimeout(this.searchRqstTmt);if(typeof this.searchRqst=="object"){this.searchRqst.abort();this.searchRqst=false}if(!e)e=window.event;if(this.searchInput.value.length>0){this.displayTab("search");var t=this.getAjaxUrl()+"&MODE=SEARCH&SEARCH_STRING="+encodeURIComponent(this.searchInput.value);if(this.bSubordinateOnly)t+="&S_ONLY=Y";var a=this;this.searchRqstTmt=setTimeout(function(){var e=(new Date).getTime();a.lastSearchTime=e;a.searchRqst=BX.ajax.loadJSON(t,BX.proxy(function(t){if(a.lastSearchTime==e)a.showResults(t)},a))},400)}};IntranetUsers.prototype.showResults=function(e){var t=e;var a=BX(this.name+"_search");var s=a.getElementsByTagName("input");for(var n=0,r=s.length;n<r;n++){if(s[n].checked){BX(this.name+"_last").appendChild(s[n])}}if(a){a.innerHTML="";var i=BX.create("table",{props:{className:"finder-box-tab-columns",cellspacing:"0"},children:[BX.create("tbody")]});var l=BX.create("tr");i.firstChild.appendChild(l);var o=BX.create("td");l.appendChild(o);a.appendChild(i);for(var n=0;n<t.length;n++){var c;var d=false;IntranetUsers.arEmployeesData[t[n].ID]={id:t[n].ID,name:t[n].NAME,sub:t[n].SUBORDINATE=="Y"?true:false,sup:t[n].SUPERORDINATE=="Y"?true:false,position:t[n].WORK_POSITION,photo:t[n].PHOTO};var p=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){p.name=this.name+"[]";p.type="checkbox"}else{p.name=this.name;p.type="radio"}var s=document.getElementsByName(p.name);var m=0;while(!d&&m<s.length){if(s[m].value==t[n].ID&&s[m].checked){d=true}m++}p.value=t[n].ID;var h=t[n].NAME;var u="finded_anchor_user_id_"+t[n].ID;c=BX.create("div",{props:{className:"finder-box-item"+(d?" finder-box-item-selected":""),id:u},events:{click:BX.proxy(this.select,this)},children:[p,BX.create("div",{props:{className:"finder-box-item-text"},text:h}),BX.create("div",{props:{className:"finder-box-item-icon"}})]});o.appendChild(c);if(n==Math.ceil(t.length/2)-1){o=BX.create("td");i.firstChild.appendChild(o)}BX.tooltip(t[n].ID,u,"")}}};IntranetUsers.prototype.displayTab=function(e){BX.removeClass(BX(this.name+"_last"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_search"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_structure"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_groups"),"finder-box-tab-content-selected");BX.addClass(BX(this.name+"_"+e),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_tab_last"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_search"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_structure"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_groups"),"finder-box-tab-selected");BX.addClass(BX(this.name+"_tab_"+e),"finder-box-tab-selected")};IntranetUsers.prototype._onFocus=function(){this.searchInput.value=""};IntranetUsers.prototype.getAjaxUrl=function(){return this.ajaxUrl||IntranetUsers.ajaxUrl}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:102:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js?14316053936107";s:6:"source";s:83:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.js";s:3:"min";s:87:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js";s:3:"map";s:87:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.map.js";}"*/
(function(t){var e={};BX.GroupsPopup={create:function(t,i,a){if(!e[t])e[t]=new s(t,i,a);return e[t]}};var s=function(e,s,i){this.tabs=[];this.items2Objects=[];this.selected=[];this.lastGroups=[];this.myGroups=[];this.featuresPerms=null;var a=[];if(i){if(i.lastGroups){this.lastGroups=i.lastGroups}if(i.myGroups){this.myGroups=i.myGroups}if(i.featuresPerms){this.featuresPerms=i.featuresPerms}if(i.events){for(var o in i.events)BX.addCustomEvent(this,o,i.events[o])}if(i.selected&&i.selected.length){this.selected=i.selected;BX.onCustomEvent(this,"onGroupSelect",[this.selected,{onInit:true}])}if(i.searchInput){this.searchInput=i.searchInput}else{this.searchInput=BX.create("input",{props:{className:"bx-finder-box-search-textbox"}});a.push(BX.create("div",{props:{className:"bx-finder-box-search"},style:{},children:[this.searchInput]}))}}BX.adjust(this.searchInput,{events:{keyup:BX.proxy(function(e){if(!e)e=t.event;this.search((e.target||e.srcElement).value)},this),focus:function(){this.value=""},blur:BX.proxy(function(){setTimeout(BX.proxy(function(){if(this.selected[0]){this.searchInput.value=this.selected[0].title}},this),150)},this)}});this.ajaxURL="/bitrix/components/bitrix/socialnetwork.group.selector/ajax.php";if(this.lastGroups.length>0){this.addTab("last",this.lastGroups)}if(this.myGroups.length>0){this.addTab("my",this.myGroups)}this.addTab("search");this.tabsOuter=BX.create("div",{props:{className:"bx-finder-box-tabs"}});this.tabsContentOuter=BX.create("td",{props:{className:"bx-finder-box-tabs-content-cell"}});a.splice(a.length,0,this.tabsOuter,BX.create("div",{props:{className:"popup-window-hr popup-window-buttons-hr"},html:"<i></i>"}),BX.create("div",{props:{className:"bx-finder-box-tabs-content"},children:[BX.create("table",{props:{className:"bx-finder-box-tabs-content-table"},children:[BX.create("tr",{children:[this.tabsContentOuter]})]})]}));this.content=BX.create("div",{props:{className:"bx-finder-box bx-lm-box sonet-groups-finder-box"},style:{padding:"2px 6px 6px 6px",minWidth:"500px"},children:a});this.popupWindow=BX.PopupWindowManager.create(e,s,{content:"",autoHide:true,events:{onPopupFirstShow:BX.proxy(function(t){t.setContent(this.content)},this),onPopupShow:BX.proxy(function(t){this.__render()},this)},buttons:[new BX.PopupWindowButton({text:BX.message("SONET_GROUP_BUTTON_CLOSE"),className:"popup-window-button-accept task-edit-popup-close-but",events:{click:function(){this.popupWindow.close()}}})]})};s.prototype.show=function(){this.popupWindow.show();this.searchInput.focus()};s.prototype.selectTab=function(t){for(var e in this.tabs){BX.removeClass(this.tabs[e].tab,"bx-finder-box-tab-selected");BX.adjust(this.tabs[e].content,{style:{display:"none"}})}BX.addClass(t.tab,"bx-finder-box-tab-selected");BX.adjust(t.content,{style:{display:"block"}})};s.prototype.addTab=function(t,e,s){var i=BX.create("div",{props:{className:"bx-finder-box-tab-content bx-lm-box-tab-content-sonetgroup"}});if(s){BX.adjust(i,{style:{display:"block"}})}var a=BX.create("span",{props:{className:"bx-finder-box-tab"+(s?" bx-finder-box-tab-selected":"")},text:BX.message("SONET_GROUP_TABS_"+t.toUpperCase())});this.tabs[t]={tab:a,content:i};BX.adjust(this.tabs[t].tab,{events:{click:BX.proxy(function(){this.selectTab(this.tabs[t])},this)}});if(e){this.setItems(this.tabs[t],e)}};s.prototype.setItems=function(t,e){BX.cleanNode(t.content);for(var s=0,i=e.length;s<i;s++){t.content.appendChild(this.__renderItem(e[s]))}};s.prototype.select=function(t){this.selected=[t];if(this.items2Objects[t.id]){for(var e=0,s=this.items2Objects[t.id].length;e<s;e++){BX.addClass(this.items2Objects[t.id][e],"bx-finder-box-item-t7-selected")}}BX.onCustomEvent(this,"onGroupSelect",[this.selected,{onInit:false}]);var i=[t.id];for(var e=0,s=this.lastGroups.length;e<s;e++){if(!BX.util.in_array(this.lastGroups[e].id,i)){i.push(this.lastGroups[e].id)}}BX.userOptions.save("socialnetwork","groups_popup","last_selected",i.slice(0,10));this.popupWindow.close()};s.prototype.deselect=function(t){this.selected=[];if(t&&this.items2Objects[t]){for(var e=0,s=this.items2Objects[t].length;e<s;e++){BX.removeClass(this.items2Objects[t][e],"bx-finder-box-item-t7-selected")}}this.searchInput.value=""};s.prototype.search=function(t){if(t.length>0){this.selectTab(this.tabs["search"]);var e=this.ajaxURL+"?mode=search&SITE_ID="+__bx_group_site_id+"&query="+encodeURIComponent(t);if(this.featuresPerms){e+="&features_perms[0]="+encodeURIComponent(this.featuresPerms[0]);e+="&features_perms[1]="+encodeURIComponent(this.featuresPerms[1])}BX.ajax.loadJSON(e,BX.proxy(function(t){this.setItems(this.tabs["search"],t)},this))}};s.prototype.__render=function(){var t=false;BX.cleanNode(this.tabsOuter);BX.cleanNode(this.tabsContentOuter);for(var e in this.tabs){if(!t){t=BX.hasClass(this.tabs[e].tab,"bx-finder-box-tab-selected")}this.tabsOuter.appendChild(this.tabs[e].tab);this.tabsContentOuter.appendChild(this.tabs[e].content)}if(!t){this.selectTab(this.tabs["last"]||this.tabs["my"]||this.tabs["search"])}};s.prototype.__renderItem=function(t){var e=BX.create("div",{props:{className:"bx-finder-box-item-t7-avatar bx-finder-box-item-t7-group-avatar"}});if(t.image){BX.adjust(e,{style:{background:"url('"+t.image+"') no-repeat center center",backgroundSize:"24px 24px"}})}var s=false;for(var i=0;i<this.selected.length;i++){if(this.selected[i].id==t.id){s=true;break}}var a=BX.create("div",{props:{className:"bx-finder-box-item-t7 bx-finder-element bx-lm-element-sonetgroup"+(typeof t.IS_EXTRANET!="undefined"&&t.IS_EXTRANET=="Y"?" bx-lm-element-extranet":"")+(s?" bx-finder-box-item-t7-selected":"")},children:[e,BX.create("div",{props:{className:"bx-finder-box-item-t7-space"}}),BX.create("div",{props:{className:"bx-finder-box-item-t7-info"},children:[BX.create("div",{text:t.title,props:{className:"bx-finder-box-item-t7-name"}})]})],events:{click:BX.proxy(function(){this.select(t)},this)}});if(!this.items2Objects[t.id]){this.items2Objects[t.id]=[a]}else if(!BX.util.in_array(a,this.items2Objects[t.id])){this.items2Objects[t.id].push(a)}return a}})(window);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:94:"/bitrix/components/bitrix/tasks.list.controls/templates/.default/script.min.js?144932595415597";s:6:"source";s:74:"/bitrix/components/bitrix/tasks.list.controls/templates/.default/script.js";s:3:"min";s:78:"/bitrix/components/bitrix/tasks.list.controls/templates/.default/script.min.js";s:3:"map";s:78:"/bitrix/components/bitrix/tasks.list.controls/templates/.default/script.map.js";}"*/
BX.namespace("BX.Tasks");(function(){if(BX.Tasks.ListControlsNS)return;BX.Tasks.ListControlsNS={ready:false,params:{appendUrlParams:{SW_FF:"FOR"}},init:function(){this.ready=true},menu:{menus:{},create:function(t){this.menus[t]={items:[]}},show:function(t,e,i){if(!self.ready)return;if(!this.menus[t])return;if(!this.menus[t].items.length)return;if(typeof i=="undefined")i={};var s=BX.pos(e);var o=BX.clone(this.menus[t].items);var a=[];if(i.useAppendParams){for(var r in self.params.appendUrlParams){a.push(r+"="+self.params.appendUrlParams[r])}for(var n=0;n<o.length;n++){o[n].href=o[n].href+"&"+a.join("&")}}BX.PopupMenu.show("task-top-panel-menu"+t+a.join("_"),e,o,{autoHide:true,offsetTop:4,events:{onPopupClose:function(t){}}})},addItem:function(t,e,i,s){this.menus[t].items.push({text:e,className:i,href:s})},addDelimiter:function(t){this.menus[t].items.push({delimiter:true})}},createGanttHint:function(){var t=BX("gantt-hint");var e=BX("gantt-hint-close");if(BX.type.isElementNode(t)&&BX.type.isElementNode(e)){BX.bind(e,"click",function(){BX.remove(t);BX.userOptions.save("tasks","task_list","enable_gantt_hint","N",false)})}},createViewModeHint:function(){this.viewModeHint=BX.PopupWindowManager.create("view_mode_hint",BX("task-top-panel-view-mode-selector"),{offsetTop:-1,autoHide:true,closeByEsc:false,angle:{position:"bottom",offset:24},events:{onPopupClose:BX.delegate(this.onViewModeHintClose,this)},content:BX.create("DIV",{attrs:{className:"task-hint-popup-contents"},children:[BX.create("SPAN",{attrs:{className:"task-hint-popup-title"},text:BX.message("TASKS_PANEL_VM_HINT_TITLE")}),BX.create("P",{text:BX.message("TASKS_PANEL_VM_HINT_BODY")}),BX.create("P",{children:[BX.create("A",{props:{href:"javascript:void(0)"},text:BX.message("TASKS_PANEL_VM_HINT_DISABLE"),events:{click:BX.delegate(this.onViewModeDisableHint,this)}})]})]})});this.viewModeHint.show()},onViewModeDisableHint:function(t){if(this.viewModeHint){this.viewModeHint.close();BX.userOptions.save("tasks","task_list","enable_viewmode_hint","N",false)}return BX.PreventDefault(t)},onViewModeHintClose:function(){if(this.viewModeHint){this.viewModeHint.destroy();this.viewModeHint=null}}};var self=BX.Tasks.ListControlsNS;BX.Tasks.QuickForm=function(t,e){var i=BX(t);if(!i){throw"BX.Tasks.QuickForm: wrong container id"}this.parameters=e||{};this.layout={container:i,form:BX("task-new-item-form"),responsible:BX("task-new-item-responsible"),responsibleId:BX("task-new-item-responsible-id"),deadline:BX("task-new-item-deadline"),menu:BX("task-new-item-menu"),title:BX("task-new-item-title"),projectLink:BX("task-new-item-project-link"),projectClearing:BX("task-new-item-project-clearing"),projectId:BX("task-new-item-project-id"),descriptionBlock:BX("task-new-item-description-block"),descriptionLink:BX("task-new-item-description-link"),description:BX("task-new-item-description"),saveButton:BX("task-new-item-save"),cancelButton:BX("task-new-item-cancel")};this.messages=this.parameters.messages||{};BX.bind(this.layout.title,"keypress",BX.proxy(this.fireEnterKey,this));BX.bind(this.layout.menu,"click",BX.proxy(this.show,this));BX.bind(this.layout.cancelButton,"click",BX.proxy(this.hide,this));BX.bind(this.layout.saveButton,"click",BX.proxy(this.submit,this));BX.bind(this.layout.descriptionLink,"click",BX.proxy(this.toggleDescription,this));BX.bind(this.layout.deadline,"click",BX.proxy(this.calendar,this));BX.bind(this.layout.deadline,"focus",BX.proxy(this.calendar,this));this.query=new BX.Tasks.Util.Query({url:"/bitrix/components/bitrix/tasks.task.list/ajax.php"});this.query.bindEvent("executed",BX.proxy(this.onQueryExecuted,this));this.operation="taskQuickAdd";this.errorPopup=null;this.notification=new BX.Tasks.QuickForm.Notification(this);this.projectSelector=new BX.Tasks.QuickForm.ProjectSelector("task-new-item-project-selector",this);this.userSelector=new BX.Tasks.QuickForm.UserSelector("task-new-item-user-selector",this)};BX.Tasks.QuickForm.prototype.submit=function(){var t=this.layout.title.value;if(BX.util.trim(t).length===0){return false}var e={title:t,responsible:this.layout.responsibleId.value,deadline:this.layout.deadline.value,description:this.layout.description.value,columnsOrder:window.tasksListNS&&tasksListNS.getColumnsOrder?tasksListNS.getColumnsOrder():null,project:this.layout.projectId.value,pathToUser:BX.message("TASKS_PATH_TO_USER_PROFILE"),pathToTask:BX.message("TASKS_PATH_TO_TASK"),siteId:BX.message("SITE_ID"),nameTemplate:this.parameters.nameTemplate,filter:this.parameters.filter,order:this.parameters.order,navigation:this.parameters.navigation,select:this.parameters.select,ganttMode:this.parameters.ganttMode};this.disable();this.query.deleteAll();this.query.add("ui.listcontrols.add",{data:e,parameters:{}},{code:this.operation});this.query.execute()};BX.Tasks.QuickForm.prototype.onQueryExecuted=function(result){if(!result.success){return this.showError(result.clientProcessErrors,result.serverProcessErrors)}else if(!result.data[this.operation]){return this.showError("Could not process this operation.")}else if(!result.data[this.operation].SUCCESS){return this.showError(result.data[this.operation].ERRORS)}var data=result.data[this.operation].RESULT;var taskId=data["taskId"];var found=data.position&&data.position.found===true;if(found){if(data.task){var task=null;try{eval("result = "+data.task);task=result}catch(e){}this.insertIntoGantt(task,data.position)}else if(data.html){this.insertIntoList(data.html,data.position)}this.highlight(taskId,false)}var title=data["taskRaw"]&&data["taskRaw"]["TITLE"]?data["taskRaw"]["TITLE"]:"";var path=data["taskPath"];this.notification.show(taskId,title,path,found);this.enable();this.clear();this.focus()};BX.Tasks.QuickForm.prototype.insertIntoGantt=function(t,e){if(!window.ganttChart||!t){return}BX.onCustomEvent("onTaskListTaskAdd",[t]);if(t.projectId&&!ganttChart.getProjectById(t.projectId)){ganttChart.addProjectFromJSON({id:t.projectId,name:t.projectName,opened:true,canCreateTasks:t.projectCanCreateTasks,canEditTasks:t.projectCanEditTasks})}var i=ganttChart.addTaskFromJSON(t);if(i.parentTaskId){var s=ganttChart.getTaskById(i.parentTaskId);if(s){s.expand()}}var o=ganttChart.getTaskById(e.nextTaskId);var a=ganttChart.getTaskById(e.prevTaskId);if(o&&o.projectId===i.projectId){ganttChart.moveTask(i.id,o.id)}else if(a&&a.projectId===i.projectId){ganttChart.moveTask(i.id,a.id,true)}};BX.Tasks.QuickForm.prototype.insertIntoList=function(t,e){var i=document.createElement("div");i.innerHTML="<table>"+t+"</table>";var s=i.firstChild.getElementsByTagName("tr");var o=i.firstChild.getElementsByTagName("script");var a=BX.create("script",{props:{type:"text/javascript"},html:o[0].innerHTML});var r=s[0];var n=BX("task-list-table-body");var l=this.projectSelector.projectId;if(l&&!BX("task-project-"+l)){var u=__CreateProjectRow({id:l,title:BX.util.htmlspecialcharsback(this.projectSelector.projectName)});var c=this.getNextProject(n,l);if(c!==null){n.insertBefore(u,c)}else{n.appendChild(u)}}var p=BX("task-"+e.nextTaskId);var h=BX("task-"+e.prevTaskId);var d=p?parseInt(p.getAttribute("data-project-id"),10):null;var m=h?parseInt(h.getAttribute("data-project-id"),10):null;if(p&&d===l){n.insertBefore(r,p);n.insertBefore(a,p)}else if(h&&m===l){var f=BX.findNextSibling(h,{tagName:"tr",className:"task-depth-0"});if(f){n.insertBefore(r,f);n.insertBefore(a,f)}else{n.appendChild(r);n.appendChild(a)}}else{c=this.getNextProject(n,l);if(c){n.insertBefore(r,c);n.insertBefore(a,c)}else{n.appendChild(r);n.appendChild(a)}}var k=BX("task-list-no-tasks");if(k){k.style.display="none"}};BX.Tasks.QuickForm.prototype.getNextProject=function(t,e){var i=BX.findChildrenByClassName(t,"task-list-project-item");if(!e&&i.length){return i[0]}var s=null;for(var o=0;o<i.length;o++){if(parseInt(i[o].getAttribute("data-project-id"),10)>e){s=i[o];break}}return s};BX.Tasks.QuickForm.prototype.showError=function(){if(this.errorPopup===null){this.errorPopup=new BX.PopupWindow(this.operation,null,{lightShadow:true,buttons:[new BX.PopupWindowButton({text:BX.message("JS_CORE_WINDOW_CLOSE"),className:"",events:{click:BX.proxy(this.onPopupErrorClose,this)}})]})}var t=[];for(var e=0;e<arguments.length;e++){var i=arguments[e];if(BX.type.isArray(i)){t=BX.util.array_merge(t,i)}else if(BX.type.isString(i)){t.push(i)}}var s="";for(e=0;e<t.length;e++){s+=(typeof t[e].MESSAGE!=="undefined"?t[e].MESSAGE:t[e])+"<br>"}this.errorPopup.setContent("<div class='task-new-item-error-popup'>"+s+"</div>");this.errorPopup.show()};BX.Tasks.QuickForm.prototype.onPopupErrorClose=function(){this.errorPopup.close();this.enable();this.clear();this.focus()};BX.Tasks.QuickForm.prototype.calendar=function(t){BX.PreventDefault(t);var e=this.layout.deadline;BX.calendar({node:e,field:e.name,bTime:true,bSetFocus:false,value:BX.CJSTask.ui.getInputDateTimeValue(e),bHideTimebar:false,callback_after:function(){var t=BX.CJSTask.ui.extractDefaultTimeFromDataAttribute(e);e.value=BX.CJSTask.addTimeToDateTime(e.value,t)}});BX.SocNetLogDestination.closeDialog()};BX.Tasks.QuickForm.prototype.show=function(){BX.addClass(this.layout.container,"task-top-panel-righttop-open");this.focus()};BX.Tasks.QuickForm.prototype.hide=function(){BX.removeClass(this.layout.container,"task-top-panel-righttop-open");this.focus()};BX.Tasks.QuickForm.prototype.toggleDescription=function(t){BX.toggleClass(this.layout.descriptionBlock,"task-top-panel-leftmiddle-open");if(BX.hasClass(this.layout.descriptionBlock,"task-top-panel-leftmiddle-open")){this.layout.description.focus()}else{this.focus()}BX.PreventDefault(t)};BX.Tasks.QuickForm.prototype.fireEnterKey=function(t){t=t||window.event;if(t.keyCode===13){this.submit();BX.PreventDefault(t)}};BX.Tasks.QuickForm.prototype.disable=function(){this.layout.title.disabled=true;this.layout.deadline.disabled=true;this.layout.responsible.disabled=true;this.layout.description.disabled=true;BX.addClass(this.layout.saveButton,"webform-small-button-wait webform-button-disable")};BX.Tasks.QuickForm.prototype.enable=function(){this.layout.title.disabled=false;this.layout.deadline.disabled=false;this.layout.responsible.disabled=false;this.layout.description.disabled=false;BX.removeClass(this.layout.saveButton,"webform-small-button-wait webform-button-disable")};BX.Tasks.QuickForm.prototype.clear=function(){this.layout.title.value="";this.layout.deadline.value="";this.layout.description.value=""};BX.Tasks.QuickForm.prototype.focus=function(){this.layout.title.focus()};BX.Tasks.QuickForm.prototype.highlight=function(t,e){if(window.ganttChart){var i=ganttChart.getTaskById(t);if(i){i.highlight();if(e===true){i.scrollIntoView(false)}}}else{var s=BX("task-"+t);if(s){BX.addClass(s,"task-list-item-highlighted");setTimeout(function(){BX.removeClass(s,"task-list-item-highlighted")},1e3);if(e===true){s.scrollIntoView(false)}}}};BX.Tasks.QuickForm.Notification=function(t){this.form=t;this.taskId=0;this.layout={block:BX("task-new-item-notification"),message:BX("task-new-item-message"),openLink:BX("task-new-item-open"),highlightLink:BX("task-new-item-highlight"),hideLink:BX("task-new-item-notification-hide")};BX.bind(this.layout.hideLink,"click",BX.proxy(this.hide,this));BX.bind(this.layout.highlightLink,"click",BX.proxy(this.highlight,this))};BX.Tasks.QuickForm.Notification.prototype.show=function(t,e,i,s){this.taskId=t;this.layout.message.innerHTML=e;this.layout.openLink.href=i;if(s){this.layout.highlightLink.style.display="inline"}else{this.layout.highlightLink.style.display="none"}BX.addClass(this.layout.block,"task-top-notification-active")};BX.Tasks.QuickForm.Notification.prototype.hide=function(){BX.removeClass(this.layout.block,"task-top-notification-active")};BX.Tasks.QuickForm.Notification.prototype.highlight=function(){this.form.highlight(this.taskId,true)};BX.Tasks.QuickForm.ProjectSelector=function(t,e){this.id=t;this.form=e;this.projectName=this.form.layout.projectLink.innerHTML;this.projectId=parseInt(this.form.layout.projectId.value,10);var i=this.form.parameters.destination||{};BX.SocNetLogDestination.init({name:t,searchInput:null,departmentSelectDisable:true,bindMainPopup:{node:this.form.layout.projectLink},bindSearchPopup:{node:this.form.layout.projectLink},callback:{select:BX.proxy(this.onSelect,this)},items:{users:{},groups:{},department:{},departmentRelation:{},sonetgroups:i["SONETGROUPS"]||{}},itemsLast:{users:{},groups:{},department:{},sonetgroups:i["LAST"]["SONETGROUPS"]||{}},itemsSelected:{}});BX.bind(this.form.layout.projectLink,"click",BX.proxy(this.openDialog,this));BX.bind(this.form.layout.projectClearing,"click",BX.proxy(this.clearProject,this))};BX.Tasks.QuickForm.ProjectSelector.prototype.openDialog=function(){if(!BX.SocNetLogDestination.isOpenDialog()){BX.SocNetLogDestination.openDialog(this.id)}BX.PreventDefault(event)};BX.Tasks.QuickForm.ProjectSelector.prototype.onSelect=function(t){this.projectId=parseInt(t.entityId,10);this.projectName=t.name;this.form.layout.projectId.value=this.projectId;this.form.layout.projectLink.innerHTML=this.projectName;BX.addClass(this.form.layout.projectClearing,"task-top-panel-tab-close-active");BX.SocNetLogDestination.deleteLastItem(this.id);BX.SocNetLogDestination.closeDialog()};BX.Tasks.QuickForm.ProjectSelector.prototype.clearProject=function(){this.form.layout.projectLink.innerHTML=this.form.messages.taskInProject;this.form.layout.projectId.value=0;this.projectId=0;this.projectName="";BX.removeClass(this.form.layout.projectClearing,"task-top-panel-tab-close-active");BX.SocNetLogDestination.closeDialog()};BX.Tasks.QuickForm.UserSelector=function(t,e){this.id=t;this.form=e;this.userName=this.form.layout.responsible.value;this.userId=this.form.layout.responsibleId.value;var i=this.form.parameters.destination||{};BX.SocNetLogDestination.init({name:t,searchInput:this.form.layout.responsible,departmentSelectDisable:true,bindMainPopup:{node:this.form.layout.responsible},bindSearchPopup:{node:this.form.layout.responsible},callback:{select:BX.proxy(this.onSelect,this)},items:{users:i["USERS"],department:i["DEPARTMENT"]||{},departmentRelation:i["DEPARTMENT_RELATION"]||{}},itemsLast:{users:i["LAST"]["USERS"]},itemsSelected:i["SELECTED"]||{}});BX.bind(this.form.layout.responsible,"focus",BX.proxy(this.openDialog,this));BX.bind(this.form.layout.responsible,"click",BX.proxy(this.openDialog,this));BX.bind(this.form.layout.responsible,"blur",BX.proxy(this.onBlur,this));var s={formName:this.id,inputName:this.form.layout.responsible.getAttribute("id")};BX.bind(this.form.layout.responsible,"keyup",BX.proxy(BX.SocNetLogDestination.BXfpSearch,s));BX.bind(this.form.layout.responsible,"keydown",BX.proxy(BX.SocNetLogDestination.BXfpSearchBefore,s))};BX.Tasks.QuickForm.UserSelector.prototype.openDialog=function(t){BX.calendar.get().Close();BX.PreventDefault(t);this.form.layout.responsible.value="";if(!BX.SocNetLogDestination.isOpenDialog()){BX.SocNetLogDestination.openDialog(this.id)}};BX.Tasks.QuickForm.UserSelector.prototype.onSelect=function(t,e,i){this.userName=BX.util.htmlspecialcharsback(t.name);this.userId=t.entityId;this.form.layout.responsible.value=this.userName;this.form.layout.responsibleId.value=this.userId;BX.SocNetLogDestination.deleteLastItem(this.id);BX.SocNetLogDestination.closeDialog()};BX.Tasks.QuickForm.UserSelector.prototype.onBlur=function(){setTimeout(BX.proxy(function(){if(!BX.SocNetLogDestination.isOpenDialog()&&!BX.SocNetLogDestination.isOpenSearch()&&this.form.layout.responsible.value.length<=0){this.form.layout.responsible.value=this.userName;this.form.layout.responsibleId.value=this.userId}},this),100)}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?14161453191966*/
; /* /bitrix/components/bitrix/tasks.list/templates/.default/script.min.js?144932595415042*/
; /* /bitrix/components/bitrix/tasks.list/templates/.default/gantt-view.min.js?14493259543755*/
; /* /bitrix/components/bitrix/tasks.filter.v2/templates/.default/script.js?141874981312025*/
; /* /bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?144872421613896*/
; /* /bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js?14316053936107*/
; /* /bitrix/components/bitrix/tasks.list.controls/templates/.default/script.min.js?144932595415597*/

//# sourceMappingURL=default_43b443e3ac59263d0e5eca9f46de90da.map.js