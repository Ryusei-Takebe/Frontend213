/*クリックされたタブの情報を受け取って、適切な要素を表示する関数の作成
  まず、いったんタブ（tabs-menu 直下の div）のすべてからactiveクラスを削除
  さらに、タブの内容（.tabs-content 直下の div）のすべてを非表示
  そのあとで、クリックされたタブにactiveクラスをつけ、そのタブの内容を表示
*/
//関数の定義
const showTab = (selector) => {
  console.log(selector);

  //タブの選択状態のリセット
  $('.tabs-menu > div').removeClass('active');
  $('.tabs-content > div').hide();

  //tabs-menu divでselectorに該当するものにだけactive
  $(`.tabs-menu div[id="${selector}"]`).addClass('active');

  $(selector).show();
  
  if(selector == 'tab-menu-a'){
    console.log('#tabs-a');
    $('#tabs-a').show();
  } else if(selector == 'tab-menu-b') {
    console.log('#tabs-b');
    $('#tabs-b').show();
  } else if(selector == 'tab-menu-c') {
    console.log('#tabs-c');
    $('#tabs-c').show();
  }

};

/*タブがクリックされたら1の関数を実行するイベント処理の作成
  クリックされたタブのidを取得し、そのタブの情報を引数に指定して1の関数を呼び出す
  今回はリンク（<a>）ではないので、e.preventDefault(); の記述は不要
*/

$('.tabs-menu div').on('click', (e) => {
  const selector = $(e.target).attr('id');
  showTab(selector);
});

/*ページのロード時に1の関数を実行して、最初のタブ（タブa）を表示する
  1の関数の引数に「タブa」の情報を指定して呼び出す1行を書くだけ
*/

showTab('tab-menu-a');