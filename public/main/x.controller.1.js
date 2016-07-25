'use strict';

angular.module('nightLife')
.controller('xCtrl2', function ($scope, $cookies, $sanitize, $http, $window) {
    $scope.events = [];
    $scope.eventsOriginal = [];
    $scope.currentEvents = [];
    $scope.myEvents = [];
    $('.loader').hide(); 
    $scope.loggingIn = false;
    $scope.events = [];
    $scope.userInfo;
    $scope.alertBox;
    $scope.geoLat = '';
    $scope.geoLng = '';
    $scope.lat='';
    $scope.lng='';
    
    $('.my-account-box').hide();
    
    $http({
        url:'/api/id',
        method:'GET'
    }).success(function(data) {
        
        console.log('----------------->Init FETCH');
        if(data.username){
            $scope.userInfo = data;
            $scope.loggingIn = true;
            $cookies.remove('search');
            $scope.fetchData();
         }
    });
    
    $scope.fetchData = function(){
        $scope.currentEvents = [];
        $scope.myEvents = [];
        if($scope.userInfo !== undefined){
                    var username = $scope.userInfo.username;
                    $http.get('/api/events/' + username)
                    .success(function(data2){
                          $scope.myEvents = data2; //all events
                          
                          //$scope.subArray2 = function (arr1,arr2){ //to find current events out of all events
                          //      return arr2.filter(function(value){
                          //              // console.log(value);
                          //              return arr1.filter(function(value2){
                          //                  // console.log(value2);
                          //                  return value.eventId === value2.eventId;
                          //              }).length===0;
                          //      });
                          //};
                          
                        //   console.log($scope.myEvents);
                        //   console.log($scope.eventsOriginal);
                          for( var index in $scope.myEvents){
                              if($scope.currentDate() == $scope.myEvents[index].date){
                                  if(!$scope.containsObject($scope.myEvents[index],$scope.currentEvents))
                                    $scope.currentEvents.push($scope.myEvents[index]); //add to current
                                  //$scope.myEvents.splice(index,1); //remove from all events
                                //   console.log('->PUSHED');
                              }
                            //   console.log($scope.currentEvents);
                          }
                          
                          //$scope.myEvents = $scope.subArray2($scope.currentEvents,$scope.myEvents);
                          
                          //$scope.events = chunk($scope.subArray($scope.myEvents,$scope.eventsOriginal),3); //not required
                          // console.log($scope.eventsOriginal);
                          // console.log($scope.myEvents);
                          console.log("ammended---FETCH CALLED");
                      });
        }
    };
    
    $scope.submit = function(location,lat,lng){
        setTimeout(function(){
        console.log('****************Fired**********');
        var lat1 = $('#lat').val();
        var lng1 = $('#lng').val();
        if(lat1=='' || lng1=='')
        {
            var lat1=$scope.lat;
            var lng1 = $scope.lng;
        }
        console.log('LAT '+lat1+' LONG '+lng1);
        if(lat1!='' && lng1!='')
        {
            $('.loader').show();
            
            var locationO = $('#autocomplete').val();
            //$('.form-search').animate({top:'-200px'},"slow");
            $('.fl').animate({top:'-200px'},"slow");
            // $cookies.put('search',locationO);
            var ll = lat1+','+lng1;
            $http({
                url:'https://api.foursquare.com/v2/venues/explore',
                method:'GET',
                params: {
                        client_id:'SILQ2D52N1ELWIMITWQHN350KN3VUTQMEPI4GKH0WQFJGAHC',
                        client_secret:'AX1IPI520FC1SHAOJMFRH15AOM0SEEHHVMSQGYH53GRUZTPD',
                        ll:ll,
                        // near:location,
                        v:20130815,
                        query:'Bar,Pub,Disc',
                        venuePhotos:true
                    }
            }).success(function(data) {  
                $('.loader').hide();
                console.log("fetched");
                //$scope.events = data.response.venues;
                // console.log(data.response.groups[0].items);
        
                $scope.eventsOriginal =  data.response.groups[0].items;   
                $scope.events = chunk(data.response.groups[0].items, 3);
                
            
                //$scope.events = data.response.groups[0].items;
                //$scope.events.forEach(setVenuePhoto);
                
                $scope.getTier = function(num){
                    return new Array(num);
                };
                $scope.i=1;
        
                $scope.sanitize = function(str){
                    //console.log('-->  '+str==undefined);
                    if(str == undefined)
                        return '';
                    else{
                        str = str.replace("'", "");
                        return str;
                    }
        
                };
        
                $scope.exploreFlag = 0;
        
                $scope.explore = function(venue){
                    //$scope.exploreFlag = 1;
                    //alert(id);
                    $scope.venue = venue;
                    var id = venue.id;
                    $('.weird-loader').show();
                        $http({
                            url:'https://api.foursquare.com/v2/venues/'+id+'/photos',
                            method:'GET',
                            params: {
                                client_id:'SILQ2D52N1ELWIMITWQHN350KN3VUTQMEPI4GKH0WQFJGAHC',
                                client_secret:'AX1IPI520FC1SHAOJMFRH15AOM0SEEHHVMSQGYH53GRUZTPD',
                                limit:50,
                                v:20130815
                            }
                        }).success(function(res) {
                            $scope.exploreFlag = 1;
                            $scope.photos = res.response.photos.items;
                            $('body').addClass('no-scroll');
                            $('.weird-loader').hide();
                        });
                    };
        
                $scope.exploreClose = function(){
                    $scope.exploreFlag = 0;
                    $('body').removeClass('no-scroll');
                };
        
                $scope.fetchData();
                    
        
                });
        }
        },500);
    };

    $scope.login = function(){
        $window.location.href = '/auth/github';
    };
    
    if($cookies.get('search') !== undefined && $scope.userInfo === undefined){
        $scope.submit($cookies.get('search'));
        $scope.location = $cookies.get('search');
        console.log('cookie-serch');
    }
    
    $scope.currentDate = function(){
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];          
            var d = new Date();
            
            return (d.getDate()+','+monthNames[d.getMonth()]+' '+d.getFullYear());
    };
    
    $scope.subArray = function (arr1,arr2){
                                return arr2.filter(function(value){
                                        // console.log(value);
                                        return arr1.filter(function(value2){
                                            // console.log(value2);
                                            return value.venue.id === value2.eventId;
                                        }).length===0;
                                });
                          };
    
    $scope.addMe = function(index){
        if($scope.userInfo !== undefined){
            var eventId = $scope.eventsOriginal[index].venue.id;
            var username = $scope.userInfo.username;
            var place = $scope.eventsOriginal[index].venue.name;
            var featuredPhotoUrl = $scope.eventsOriginal[index].venue.featuredPhotos.items[0].prefix +'400x400'+ $scope.eventsOriginal[index].venue.featuredPhotos.items[0].suffix;
            var venueAddress = $scope.eventsOriginal[index].venue.location.address;
            
            var date = $scope.currentDate();
            
            // $scope.myEvents.push({eventId:eventId, username:username, place:place, imgUrl:featuredPhotoUrl, venueAddress:venueAddress, date:date});
            //var tmp = {eventId:eventId, username:username, place:place, imgUrl:featuredPhotoUrl, venueAddress:venueAddress, date:date};
            //console.log('=====>');
            //console.log($scope.currentEvents);
            //if(!$scope.containsObject(tmp,$scope.currentEvents))
            //{
            //     $scope.currentEvents.push({eventId:eventId, username:username, place:place, imgUrl:featuredPhotoUrl, venueAddress:venueAddress, date:date});
            //      console.log('PUSHED');
            //}
            
            $http.post('/api/events', {eventId:eventId, username:username, place:place , imgUrl:featuredPhotoUrl, venueAddress:venueAddress, date:date})
                .success(function(data){
                    $scope.alertBox = place;
                    $('.alertBox').show();
                    //$cookies.remove('search');
                    $scope.eventsOriginal.splice(index, 1);
                    //console.log("data submitted and cookies removed");
                    $scope.fetchData();
                });
            }
            else{
                alert("Please Login!");
                $scope.login();
            }
    };
    
    $('.viewAll').click(function(){
       $('.events').show(); 
       $('.alertBox').fadeOut(); 
    });
    
    $('.myAccountClose').click(function(){
        $('.my-account-box').hide();
        $('body').removeClass('no-scroll');
    })
    
    $('.alertboxClose').click(function(){
        $('.alertBox').hide();
    })
    
    $scope.removeMe = function(id){
        $http.delete('/api/events/' + $scope.userInfo.username + "/" + id)
        .success(function(){
            //angular.forEach($scope.currentEvents, function(x, i){
            //   if(x.eventId === id){
            //       $scope.currentEvents.splice(i, 1);
            //   }
            //});
            $scope.fetchData();
        });
    };
    
    function chunk(arr, size) {
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
    }
    
    $scope.toggleMyAccount = function(){
        $('.my-account-box').toggle();
        
        if($('body').hasClass("no-scroll"))
            $('body').removeClass('no-scroll');
        else    
            $('body').addClass('no-scroll');
        // $('.fl').animate({top:'0px'},"slow");
    };
    
    $scope.ifEmpty = function(data,type){
        // console.log(data);
        if(data == undefined || data == "")
        {
            if(type == 'img_part_1'){
                return "./img/";
            }
            else
            if(type == 'img_part_2'){
                return "/image_na.jpg";
            }
            else
            if(type=='rating')
            {
                return 'N/A';
            }
            else
            if(type=='status')
            {
                return 1;
            }
        }
        else
            return data;
    }
    
    $scope.tab = 1;

    $scope.setTab = function(setTab){
        $scope.tab = setTab;
    };
    
    $scope.currentTab = function(checkTab){
        return $scope.tab == checkTab;
    };
    
    $scope.containsObject = function (obj, list) {
        //console.log('%%%%%LIST%%%%%%');
        // console.log(list[0]);
        var i;
        var flag=0;
        for (i = 0; i < list.length; i++) {
            //console.log(obj);
            //console.log(list[i]);
            //console.log('==================');
            if (list[i] === obj) {
                
                flag++;
                
            }
            
        }
        
        if(flag>0)
        {   //console.log('------------->TRUEEEE'); 
        return true;}
        else
        {    //console.log('------------->Falsee'); 
        return false;}
        
    };
    
    
  })
//   .controller('viewEvents', function($scope, $http){
//     $scope.eventViewFlag = 1;
//     $scope.tab = 1;

//     $scope.setTab = function(setTab){
//         $scope.tab = setTab;
//     };
//     $scope.currentTab = function(checkTab){
//         return $scope.tab == checkTab;
//     };
//   })
    .filter('formatNumber',function(){
        return function(num){
            if(num%1 == 0)
            {
                return num+".0";
            }
            else
            {
                return num;
            }
        }
    })
    .directive('backUrl', function(){
    return function(scope, element, attrs){
        var url = attrs.backUrl;
        element.css({
            'background': 'url('+ url +') bottom right 15% no-repeat #46B6AC'
        });
    };
    });
