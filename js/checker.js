// jQuery objects
//
var startButton = $('.hw4-start-button'), // 「開始掃描」按鈕
    results = $('.hw4-result'); // 「掃描結果」 table

// 垃圾社團列表
var junkGroups = [];

// 用 Ajax 自 http://spamgroup.tonyq.org/groups/jsonp 取得垃圾社團列表

$.ajax('http://spamgroup.tonyq.org/groups/jsonp', {
  dataType: 'jsonp',
  jsonp: 'jsonp',
  success: function(data){
    // 將每筆資料的 GID 放進 junkGroups 陣列中。
    data.forEach(function(record){
      junkGroups.push(record.GID);
    });

    startButton.removeAttr('disabled').removeClass('disabled');
  }
});

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
      FB.api('/me/groups', function(resp){
        var i;
        for(i=0; i<resp.data.length; i+=1){
          if( junkGroups.indexOf( resp.data[i].id ) !== -1 ){
            // resp.data[i] 是垃圾社團！
            // 在表格裡面顯示
            results.append('<tr><td>'+resp.data[i].id+'</td><td>'+resp.data[i].name+'</td></tr>');
          }
        }
        results.after('<div class="hw4-complete alert alert-info">掃描完成</div>');
      });
    }, {scope: 'user_groups'});

  });
};