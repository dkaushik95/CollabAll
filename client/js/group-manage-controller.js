(function () {
    'use strict';

    angular.module('GroupManageControllerModule', [])

        .controller('groupManageController', ['$scope', 'AuthService', '$state', '$http', '$stateParams',
            function ($scope, AuthService, $state, $http, $stateParams) {

                $scope.title = "CollabAll - Create Group";
                $scope.validation = [];
                $scope.groupID = $stateParams.groupID;
                $scope.groupName = '';

                $scope.allUsers = [];
                $scope.cardUsers = [];

                $scope.selectedAllUsers = [];
                $scope.selectedCardUsers = [];


                document.getElementById("overlayScreen").style.width = "100%";
                document.getElementById("overlayScreen").style.height = "100%";

                if ($scope.groupID != "") {
                    $http.get('services/group/get-group-by-id', {params: {GroupId: $scope.groupID}})
                        .then(function (response) {
                            $scope.groupName = response.data.group.Name;
                        });
                }

                $http.get('services/user/get-all-active-users')
                    .then(function (response) {
                        $scope.allUsers = response.data.users;
                        $scope.allUsers.sort(compare);

                    }).then(function () {
                    $http.get('services/group/get-group-members', {params: {GroupId: $scope.groupID}})
                        .then(function (response) {
                            $scope.cardUsers = response.data.users;
                            $scope.cardUsers.sort(compare);

                            for (var i = 0; i < $scope.cardUsers.length; i++) {
                                for (var j = 0; j < $scope.allUsers.length; j++) {
                                    if ($scope.cardUsers[i].ID == $scope.allUsers[j].ID) {
                                        $scope.allUsers.splice(j, 1);
                                        break;
                                    }
                                }
                            }

                            document.getElementById("overlayScreen").style.width = "0%";
                            document.getElementById("overlayScreen").style.height = "0%";
                        });
                });

                $scope.saveGroup = function () {
                    if (isFormValid()) {
                        document.getElementById("overlayScreen").style.width = "100%";
                        document.getElementById("overlayScreen").style.height = "100%";

                        $scope.status = "Creating Group....";

                        if ($scope.groupID != "") {
                            $http.post('services/group/update-group',
                                {
                                    GroupId: $scope.groupID,
                                    GroupName: $scope.groupName,
                                    UserIds: $scope.cardUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    // $state.go('inside.view-papers');
                                });
                        }
                        else {
                            $http.post('services/group/create-group',
                                {
                                    GroupName: $scope.groupName,
                                    UserIds: $scope.cardUsers
                                })
                                .then(function (response) {
                                    document.getElementById("overlayScreen").style.width = "0%";
                                    document.getElementById("overlayScreen").style.height = "0%";

                                    // $state.go('inside.view-papers');
                                });
                        }

                    }
                };

                $scope.addToGroup = function () {
                    for (var i = 0; i < $scope.selectedAllUsers.length; i++) {
                        for (var j = 0; j < $scope.allUsers.length; j++) {
                            if ($scope.selectedAllUsers[i].ID == $scope.allUsers[j].ID) {
                                $scope.cardUsers.push($scope.allUsers[j]);
                                $scope.cardUsers.sort(compare);
                                $scope.allUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
                };

                $scope.removeFromGroup = function () {
                    for (var i = 0; i < $scope.selectedCardUsers.length; i++) {
                        for (var j = 0; j < $scope.cardUsers.length; j++) {
                            if ($scope.selectedCardUsers[i].ID == $scope.cardUsers[j].ID) {
                                $scope.allUsers.push($scope.cardUsers[j]);
                                $scope.allUsers.sort(compare);
                                $scope.cardUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
                };


                function compare(a, b) {
                    if (a.FirstName < b.FirstName)
                        return -1;
                    if (a.FirstName > b.FirstName)
                        return 1;
                    return 0;
                }

                function isFormValid() {
                    $scope.validation = [];

                    if ($scope.cardUsers.length <= 0) {
                        $scope.validation.push("There needs to be a minimum of one user assigned to the group");
                    }


                    if ($scope.validation.length >= 1) {
                        console.log('form not valid');
                        return false;
                    }

                    return true;
                }

            }]);


}());
