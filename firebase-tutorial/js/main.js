/* jshint curly:true, debug:true */
/* globals $, firebase */

// 初期値を設定
let num = 0;

// ログインユーザのUID
let currentUID = null;

const getValue = () => {
  // 現在のmykeyの値を取得
  firebase
    .database()
    .ref('mykey')
    .on('value', (snapshot) => {
      // データの取得が完了すると実行される

      const snapshotValue = snapshot.val();

      // 取得した値が数値かを判定
      if (Number.isFinite(snapshotValue)) {
        num = snapshotValue;
      }

      console.log(`Got value: ${num}`);
    });
};

const setValue = () => {
  num += 1;
  console.log(`set: ${num}`);

  // Firebase上のmykeyの値を更新
  firebase
    .database()
    .ref('mykey')
    .set(num);
};

const logIn = (mail, pass) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(mail, pass) // ログイン実行
    .then((user) => {
      // ログインに成功したときの処理
      console.log('ログインしました', user);
    })
    .catch((error) => {
      // ログインに失敗したときの処理
      console.error('ログインエラー', error);
    });
};

const logOut = () => {
  firebase
    .auth()
    .signOut() // ログアウト実行
    .then(() => {
      // ログアウトに成功したときの処理
      console.log('ログアウトしました');
    })
    .catch((error) => {
      // ログアウトに失敗したときの処理
      console.error('ログアウトエラー', error);
    });
};

const changeView = () => {
  if (currentUID != null) {
    // ログイン状態のとき
    $('.visible-on-login')
      .removeClass('hidden-block')
      .addClass('visible-block');

    $('.visible-on-logout')
      .removeClass('visible-block')
      .addClass('hidden-block');
  } else {
    // ログアウト状態のとき
    $('.visible-on-login')
      .removeClass('visible-block')
      .addClass('hidden-block');

    $('.visible-on-logout')
      .removeClass('hidden-block')
      .addClass('visible-block');
  }
};

const downloadImage = (fileName) => {
  firebase
    .storage()
    .ref(fileName)
    .getDownloadURL() // 画像のURLを取得
    .then((url) => {
      // URLの取得に成功したときの処理
      $('#upload-image-preview').attr('src', url); // ページ上に画像を表示
    })
    .catch((error) => {
      // URLの取得に失敗したときの処理
      console.error('URL取得エラー', error);
    });
};

const uploadImage = (file) => {
  const fileName = 'sample/test';
  firebase
    .storage()
    .ref(fileName)
    .put(file) // ファイルアップロードを実行
    .then(() => {
      // アップロード処理に成功したときの処理
      downloadImage(fileName);
    })
    .catch((error) => {
      // アップロード処理に失敗したときの処理
      console.error('ファイルアップロードエラー', error);
    });
};

// ユーザのログイン状態が変化したら呼び出される、コールバック関数を登録
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('状態：ログイン中');
    currentUID = user.uid;
    changeView();
    getValue();
  } else {
    console.log('状態：ログアウト');
    currentUID = null;
    changeView();
  }
});

// id="my-button"をクリックしたら呼び出される、イベントハンドラを登録
$('#my-button').on('click', () => {
  setValue();
});

// id="login-button"をクリックしたら呼び出される、イベントハンドラを登録
$('#login-button').on('click', () => {
  const mail = $('#user-mail').val();
  const pass = $('#user-pass').val();

  logIn(mail, pass);
});

// id="logout-button"をクリックしたら呼び出される、イベントハンドラを登録
$('#logout-button').on('click', () => {
  logOut();
});

// id="upload-image"でファイルが選択されたら、イベントハンドラを登録
$('#upload-image').on('change', (e) => {
  const { files } = e.target;

  if (files.length === 0) {
    // ファイルが選択されていないなら何もしない
    return;
  }

  const file = files[0];

  // Storageにアップロード
  uploadImage(file);
});