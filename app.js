angular.module('bookApp', ['ngCookies','ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/main.html', // Update to the correct path
                controller: 'MainController'
            })
            .when('/favorites', {
                templateUrl: 'templates/favorites.html', // Update to the correct path
                controller: 'FavoritesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('MainController', function ($scope, $http, $cookies, $location) {

        console.log('MainController invoked');

        $scope.isLoggedIn = false;
        $scope.username = '';
        $scope.password = '';
        $scope.rememberMe = false; 

        $scope.searchQuery = '';
        $scope.books = window.booksData || [];
        $scope.displayedBooks = [];

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;

        $scope.favorites = $cookies.getObject('favorites') || [];
    
        /*
        var rememberMeCookie = $cookies.get('rememberMe');
        if (rememberMeCookie ==='true') {
            // If the rememberMe cookie is set to true, automatically log in
            $scope.login();
        }
        */

        
        $scope.goToFavorites = function () {
            $location.path('/favorites');
         };


        $scope.loadPage = function(){
           
            // Load books from the JSON file
            /*$http.get('./books.json').then(function (response) {
                $scope.books = response.data;
                $scope.updateDisplayedBooks();
            });*/
            $scope.favorites = $cookies.getObject('favorites') || [];
            $scope.books = window.booksData || []; // Assuming window.booksData is defined in booksData.js 
            $scope.updateDisplayedBooks();
        }

        $scope.login = function () {
            // For now, we're just setting isLoggedIn to true
            $scope.isLoggedIn = true;

            // Save rememberMe value in a cookie with a 10 hour lifetime
            if ($scope.rememberMe == true || $cookies.get('rememberMe') ==='true') {
                $cookies.put('rememberMe', 'true', { expires: new Date(Date.now() + 36000000) });
            }
            $scope.loadPage();
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
            var index = $scope.favorites.indexOf(book.id);
            if (index === -1) {
                // If the book is not in favorites, add it
                $scope.favorites.push(book.id);
            } else {
                // If the book is already in favorites, remove it
                $scope.favorites.splice(index, 1);
            }

            //console.log( $scope.favorites);

            // Store the updated favorites in cookies
            $cookies.putObject('favorites', $scope.favorites);

            // If on the favorites page, update the stored favorites there as well
            /*if ($location.path() === '/favorites') {
                $scope.storeFavorites();
            }*/
        };
        
        $scope.isFavorite = function (book) {
            // Check if the book is in the favorites list
            //console.log(book);
            //console.log('isFavorite? '+ $scope.favorites.indexOf(book));

            return $scope.favorites.indexOf(book.id) !== -1;
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

        if($scope.isLoggedIn || $cookies.get('rememberMe') === 'true'){
            $scope.isLoggedIn = true;
            $scope.loadPage();
        }
    })

    .controller('FavoritesController', function ($scope, $cookies) {

        console.log('FavoritesController invoked');

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10; 
        $scope.books = window.booksData || [];
        $scope.favorites = $cookies.getObject('favorites') || [];

        $scope.displayedBooks = $scope.books.filter(function (book) {
            return $scope.favorites.indexOf(book.id) !== -1;
        }) || [];
        $scope.selectedBook =  {};

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
            $scope.displayedBooks = $scope.books.filter(function (book) {
                return $scope.favorites.indexOf(book.id) !== -1;
            });

            var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
            $scope.displayedBooks = $scope.displayedBooks.slice(startIndex, startIndex + $scope.itemsPerPage);

            //console.log($scope.displayedBooks);
        };

        $scope.toggleFavorite = function (book) {
           
            var index = $scope.favorites.indexOf(book.id);
            if (index === -1) {
                // If the book is not in favorites, add it
                $scope.favorites.push(book.id);
            } else {
                // If the book is already in favorites, remove it
                $scope.favorites.splice(index, 1);
                $scope.updateDisplayedBooks();
            }
            $cookies.putObject('favorites', $scope.favorites);
        };

        $scope.isFavorite = function (book) {
            return $scope.favorites.indexOf(book.id) !== -1;
        };

        $scope.showDetails = function (book) {
            $scope.selectedBook =  angular.copy(book);
            $('#favoriteBookDetailsModal').modal('show');
        };

        $scope.closeModal = function () {
            $('#favoriteBookDetailsModal').modal('hide');
        };

        $scope.goToHome = function(){
            $location.path('/');
        };

        $scope.updateDisplayedBooks();


    });
