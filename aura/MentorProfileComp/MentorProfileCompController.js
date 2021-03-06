({
    doInit : function(component, event, helper) {
        helper.showSpinner(component);
        helper.getMentorAndMenteeInformation(component,event,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.menteesList",response.getReturnValue());
                helper.hideSpinner(component);
            }
            else if (state === "INCOMPLETE") {
                helper.hideSpinner(component);
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                            helper.hideSpinner(component);
                        }
                    } else {
                        console.log("Unknown error");
                        helper.hideSpinner(component);
                    }
                }
        });
    },
    updateOnDataChange : function(c,e,h){
        h.showSpinner(c);
        //c.set('v.selectedMentee',c.find('assignProgramComp').get('v.menteeDetail'));  
        h.getMenteeAssigmentInfo(c,e,true);
        h.hideSpinner(c);
    },
    onclickTour : function(c,e,h){
        var tour = introJs();
        tour.setOption('tooltipPosition', 'auto');
        tour.setOption('positionPrecedence', ['left', 'right', 'top', 'bottom']);
        tour.start();
    },
    nextScreen : function(c,e,h){
        h.showSpinner(c);
        h.next(c);
        h.hideSpinner(c);
        h.refreshCountdownComp(c,e);
    },
    onClickMentee : function(c,e,h){
        h.showSpinner(c);
        h.getMenteeAssigmentInfo(c,e,false);
        h.hideSpinner(c);
    },
    onClickPrevious : function(c,e,h){
        h.showSpinner(c);
        h.previous(c);
        h.hideSpinner(c);
        h.refreshCountdownComp(c,e);
    },
    onNewProgramCreated : function(c,e,h){
        h.showSpinner(c);
        h.previous(c);
        var newOnboardingProgramLC = c.find('newOnboardingProgramLC');
        var ceatedProgram = newOnboardingProgramLC.get('v.createdProgram');
        var ceatedTaskList = newOnboardingProgramLC.get('v.createdTaskList');
        var createdUserRoles = newOnboardingProgramLC.get('v.createdUserRoles');
        h.hideSpinner(c);
    },
    onStepReopen : function(c,e,h){
        h.showSpinner(c);
        var milestoneInformationComp = c.find("milestoneInformation"+c.get('v.milestonInformationCompCount'));
        var reopenedTaskId = milestoneInformationComp.get('v.reopenTaskId');
        var selectedProgram = milestoneInformationComp.get('v.selectedProgram');
        var menteeAssignmentInformation = c.get('v.menteeAssignmentInformation');
        for(var i=0;i<menteeAssignmentInformation.length;i++){
            for(var j=0;j<menteeAssignmentInformation[i].programs.length;j++){
                var programDetail = menteeAssignmentInformation[i].programs[j];
                if(programDetail.Id == selectedProgram.Id){
                    for(var k =0;k<programDetail.Child_Assigned_Tasks__r.length;k++){
                        var childAssignedTask = programDetail.Child_Assigned_Tasks__r[k];
                        if(childAssignedTask.Id == reopenedTaskId){
                            childAssignedTask.Status__c == 'In-Progress';
                        }
                    }
                }
            }
            c.set('v.menteeAssignmentInformation',menteeAssignmentInformation);
        }
        h.hideSpinner(c);
    },
    onClickMilestone : function(c,e,h){
        h.showSpinner(c);
        var scrollOptions = {
            top: 500,
            behavior: 'smooth'
        };
        window.scrollTo(scrollOptions);
        h.refreshCountdownComp(c,e);
        c.set("v.milestonInformationCompCount",c.get('v.milestonInformationCompCount') + 1);
        c.set('v.selectedMilestoneName',c.find('menteeProgressPathCmp').get('v.selectedMilestoneName'));
        c.set('v.selectedMilestonePrograms',c.find('menteeProgressPathCmp').get('v.selectedMilestonePrograms'));
        $A.createComponent(
            "c:MilestoneInformation",
            {
                "aura:id" : "milestoneInformation"+c.get('v.milestonInformationCompCount'),
                "selectedMilestoneName": c.get('v.selectedMilestoneName'),
                "milestonePrograms" : c.get('v.selectedMilestonePrograms'),
                "onDataChange" : c.getReference("c.updateOnDataChange")
            },
            function(newButton, status, errorMessage){
                if (status === "SUCCESS") {
                    var body = [];
                    body.push(newButton);
                    c.set("v.milestoneInformationBody", body);
                    h.hideSpinner(c);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    h.hideSpinner(c);
                }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        h.hideSpinner(c);
                    }
            }
        );
        
    }
})