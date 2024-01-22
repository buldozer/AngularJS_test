angular.module('bookApp', ['ngCookies','ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/favorites', {
                templateUrl: 'favorites.html',
                controller: 'FavoritesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('MainController', function ($scope, $http, $cookies, $location) {
        $scope.isLoggedIn = false;
        $scope.username = '';
        $scope.password = '';
        $scope.rememberMe = false; 

        $scope.searchQuery = '';
        $scope.books = window.booksData || [];
        $scope.displayedBooks = [];

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;

        $scope.favorites = [];
    
        var rememberMeCookie = $cookies.get('rememberMe');
        if (rememberMeCookie ==='true') {
            // If the rememberMe cookie is set to true, automatically log in
            $scope.login();
        }

        $scope.login = function () {
            // For now, we're just setting isLoggedIn to true
            $scope.isLoggedIn = true;
            // Save rememberMe value in a cookie with a one-hour lifetime
            $cookies.put('rememberMe', $scope.rememberMe.toString(), { expires: new Date(Date.now() + 3600000) });
            $scope.updateDisplayedBooks();
            // Load books from the JSON file
            /*$http.get('./books.json').then(function (response) {
                $scope.books = response.data;
                $scope.updateDisplayedBooks();
            });*/

            $scope.books = window.booksData || []; // Assuming window.booksData is defined in booksData.js
        };

        $scope.searchBooks = function () {
            // Filter books based on the entire list
            $scope.displayedBooks = $scope.books.filter(function (book) {
                return book.name.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                    book.description.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                    String(book.id).toLowerCase().includes($scope.searchQuery.toLowerCase());
            });
           // $scope.displayedBooks = $scope.displayedBooks.slice(1, 1 + $scope.itemsPerPage);
            //$scope.updateDisplayedBooks();
        };


        $scope.showDetails = function (book) {
            $scope.selectedBook =  angular.copy(book);
            $('#bookDetailsModal').modal('show');
        };

        $scope.toggleFavorite = function (book) {
            // Toggle the favorite status of the book
            var index = $scope.favorites.indexOf(book);
            if (index === -1) {
                // If the book is not in favorites, add it
                $scope.favorites.push(book);
            } else {
                // If the book is already in favorites, remove it
                $scope.favorites.splice(index, 1);
            }
        };
        
        $scope.isFavorite = function (book) {
            // Check if the book is in the favorites list
            return $scope.favorites.indexOf(book) !== -1;
        };
        $scope.changePage = function (direction) {
            if (direction === 'prev' && $scope.currentPage > 1) {
                $scope.currentPage--;
            } else if (direction === 'next' && $scope.currentPage < $scope.totalPages()) {
                $scope.currentPage++;
            }

            $scope.updateDisplayedBooks();
        };

        $scope.totalPages = function () {
            return Math.ceil($scope.books.length / $scope.itemsPerPage);
        };

        $scope.updateDisplayedBooks = function () {
            var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
            $scope.displayedBooks = $scope.books.slice(startIndex, startIndex + $scope.itemsPerPage);
        };

        $scope.closeModal = function () {
            $('#bookDetailsModal').modal('hide');
        };

        $scope.goToFavorites = function () {
            // Navigate to the favorites page
            $location.path('/favorites');
        };
    })

    .controller('FavoritesController', function ($scope, $cookies) {
        // Initialize favorites from cookies or an empty array
        $scope.favorites = $cookies.getObject('favorites') || [];

        // ... (add other functions if needed)
    });
