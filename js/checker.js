// jQuery objects
//
var startButton = $('.hw4-start-button'), // 「開始掃描」按鈕
    results = $('.hw4-result'); // 「掃描結果」 table

// 設定 Facebook AppID
window.fbAsyncInit = function(){
  FB.init({
    appId: '699520453426867', // 若可以，請換成自己的 App ID !
    status: true
  });

  // 比對每個使用者的 group 是否有在 junkGroups 中出現
  //
  startButton.click(function(){
    results.empty(); // 清除結果內容
    $('.hw4-complete').remove(); // 移除「掃描完成」

    // 1. 讓使用者登入此 Facebook App (FB.login)
    FB.login(function(){
      // 2. 以 FB.api 拿到使用者的 group 列表
      // 拿到使用者 group 列表的 response 之後：
      FB.api('/me/friends', function(friends){
        var i;
        for(i=0; i<friends.data.length; i+=1){

          FB.api('/' + friends.data[i].id + '/albums', function(friendAlbums){
            var i;
            for(i=0; i<friendAlbums.data.length; i+=1){
              FB.api('/' + friendAlbums.data[i].id + '/photos', function(photos){
                var i, maxPhoto, maxCount = 0;
                for(i=0; i<photos.data.length; i+=1){
                  if(maxCount < photos.data[i].likes.data.length){
                    maxCount = photos.data[i].likes.data.length;
                    maxPhoto = photos.data[i];
                  }
                }
                results.append('<div class="col-md-3"><figure><a href="'+maxPhoto.link+'"><img src="'+maxPhoto.picture+'"></a><figcaption>'+maxPhoto.from.name+'</figcaption></div>');
              });
            }
          });
        }
        results.after('<div class="hw4-complete alert alert-info">掃描完成</div>');
      });
    }, {scope: 'user_friends,friends_photos'});

  });
};