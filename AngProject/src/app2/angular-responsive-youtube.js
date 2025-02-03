youtube_player = angular.module('citrullin.ryoutube', []);
youtube_player.directive('youtubeVideo', function(){
    return{
        restrict: 'E',
        scope: {
            video_id: '@video-id'
        },
        link: function($scope, element, attrs){
            $scope.height = Math.round((element[0].offsetWidth)/(16/9));
        },
        controller: function($scope, $sce){
            $scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+$scope.video_id);
            $scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+$scope.video_id);
        },
        template: '<iframe height="{{height}}" ng-src="{{url}}" style="width: 100%" frameborder="0" allowfullscreen></iframe>'
    }
});
