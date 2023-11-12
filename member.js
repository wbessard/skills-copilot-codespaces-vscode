function skillsMember() {
    return {
        restrict: 'E',
        templateUri: 'modules/skills/views/member.html',
        controller: 'SkillsMemberCOntroller',
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            member: '='
        }
    };
}