var priApp = angular.module('priApp', ['angularMoment']);

priApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
            apiKey: "AIzaSyBlQuibtEZ-B-D-lztUvdV37XBP-f3imYM",
            authDomain: "lion00098-4f2af.firebaseapp.com",
            projectId: "lion00098-4f2af",
            storageBucket: "lion00098-4f2af.appspot.com",
            messagingSenderId: "696698867184",
            appId: "1:696698867184:web:d49986d4a6ecd50f2b6135",
            measurementId: "G-2T3HZL3SW3"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
        } catch (error) {}
    },
]);

priApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.user = {};
    $scope.applicants = [];
    loadWinners();

    $scope.onDelete = function(p) {

        if (confirm("Are you sure, you want to delete record?")) {
            $rootScope.db
                .collection('winners')
                .doc(`${p.id}`)
                .delete()
                .then(() => {
                    loadApplicants();
                })
                .catch(error => {
                    alert('Error deleting record: ', error);
                });

        }


    }

    $scope.submitForm = function() {
        var guid = createGuid();
        $rootScope.db
            .collection('winners')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                firstName: `${$scope.user.firstName}`,
                lastName: `${$scope.user.lastName}`,
                winning: `${$scope.user.winning}`,
                tax: `${$scope.user.tax}`,
                status: `${$scope.user.status}`,
            })
            .then(() => {
                $scope.user = {};
                alert(`Winners was  successfully posted!`);
                $window.location.href = "./add_applicant.html";

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });
    }




    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadWinners() {

        try {
            $rootScope.db.collection('winners').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.applicants = data;
                    console.log(data);


                });
            });

        } catch (error) {

        }

    }

});

priApp.controller('Main2Controller', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.applicants = [];
    loadApplicants();


    $scope.onDelete = function(p) {

        if (confirm("Are you sure, you want to delete record?")) {
            $rootScope.db
                .collection('application_form')
                .doc(`${p.id}`)
                .delete()
                .then(() => {
                    loadApplicants();
                })
                .catch(error => {
                    alert('Error deleting record: ', error);
                });

        }


    }

    function loadApplicants() {

        try {
            $rootScope.db.collection('application_form').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                $scope.$apply(function() {
                    $scope.applicants = data;
                });
            });

        } catch (error) {

        }

    }

});