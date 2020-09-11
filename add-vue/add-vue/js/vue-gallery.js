// Flickr API key
const API_KEY = 'eed714026a7beb61bcf867d674114bdd';

/**
 * ----------------------------------
 * Tooltipを表示するカスタムディレクティブ
 * ----------------------------------
 */

Vue.directive('tooltip', {
  bind(el, binding) {
    $(el).tooltip({
      title: binding.value,
      placement: 'bottom',
    });
  },
  unbind(el) {
    $(el).tooltip('dispose');
  },
});

//コンポーネントのローカル登録
//猫の画像を表示
let catPhotosContent = {
  props: {
    cats: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean, //真偽値
      required: true,
    },
  },
  template: `
    <div v-if="status" class="image-gallery">
    <div class="image-gallery__item" v-for="cat in cats">
      <a
        v-bind:key="cat.id"
        v-bind:href="cat.pageURL"
        v-tooltip="cat.text"
        class="d-inline-block"
        target="_blank"
      >
      <img
        v-bind:src="cat.imageURL"
        v-bind:alt="cat.text"
        width="150"
        height="150"
      >
      </a>
    </div>
  </div>
  `,
};
//犬の画像を表示
let dogPhotosContent = {
  props: {
    dogs: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div v-if="status" class="image-gallery">
    <div class="image-gallery__item" v-for="dog in dogs">
      <a
        v-bind:key="dog.id"
        v-bind:href="dog.pageURL"
        v-tooltip="dog.text"
        class="d-inline-block"
        target="_blank"
      >
      <img
        v-bind:src="dog.imageURL"
        v-bind:alt="dog.text"
        width="150"
        height="150"
      >
      </a>
    </div>
  </div>
  `,
};

let photosArray = {
  props: {
    dogs: {
      type: Array,
      required: true,
    },
    cats: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    'cat-photos-content': catPhotosContent,
    'dog-photos-content': dogPhotosContent,
  },
  template: `
  <div>
    <cat-photos-content v-bind:cats="cats" v-bind:status="status"></cat-photos-content>
    <dog-photos-content v-bind:dogs="dogs" v-bind:status="status"></dog-photos-content>
  </div>
  `,
};
/**
 * ※参考：コードのひな形
 * ここまで学習した内容を基に、Vueのコードを書くときの「ひな形」を用意しました。課題に取り組む際の参考にしてください。
 */

new Vue({
  el: '#gallery', // elオプションの値に '#gallery' を設定

  components: {
    // ローカル登録するコンポーネントを設定
    // ( コンポーネントを利用しない場合は components: {}, は削除すること )
    "photos-array": photosArray,
  },

  data: function() {
    // 利用するデータを設定
    return {
      total: 0,
      catPhotos: [],
      dogPhotos: [],
      currentState: false,
    };
  },

  created() {
    // Vueが読み込まれたときに実行する処理を定義
    const urlCat = this.getRequestURL('cat');
    const urlDog = this.getRequestURL('dog');

    //猫の写真を取得
    $.getJSON(urlCat, (data) => {
      //写真の取得に失敗した場合
      if (data.stat !== 'ok') {
        console.log('取得に失敗');
        return;
      }

      //該当の画像データが存在しない場合
      if (data.photos.photo.length === 0) {
        console.log('写真はありません');
        return;
      }

      this.catPhotos = data.photos.photo.map(photo => ({
        id: photo.id,
        imageURL: this.getFlickrImageURL(photo, 'q'),
        pageURL: this.getFlickrPageURL(photo),
        text: this.getFlickrText(photo),
      }));
      if (this.catPhotos) {
        console.log(this.catPhotos);
        this.currentState = true;
      }
    });

    //犬の写真を取得
    $.getJSON(urlDog, (data) => {
      //写真の取得に失敗した場合
      if (data.stat !== 'ok') {
        console.log('取得に失敗');
        return;
      }

      //該当の画像データが存在しない場合
      if (data.photos.photo.length === 0) {
        console.log('写真はありません');
        return;
      }

      this.dogPhotos = data.photos.photo.map(photo => ({
        id: photo.id,
        imageURL: this.getFlickrImageURL(photo, 'q'),
        pageURL: this.getFlickrPageURL(photo),
        text: this.getFlickrText(photo),
      }));
      if (this.dogPhotos) {
        console.log(this.dogPhotos);
      }
    });

    //犬と猫の写真を取得すると表示
    if (this.catPhotos || this.dogPhotos) {
      this.currentState = true;
    }
  },

  methods: {
    // 呼び出して利用できる関数を定義( aaa や bbb の関数名を書き換えること。関数の追加も可能 )
    // 検索テキストに応じたデータを取得するためのURLを作成して返す
    getRequestURL(searchText) {
      const parameters = $.param({
        method: 'flickr.photos.search',
        api_key: API_KEY,
        text: searchText, // 検索テキスト
        sort: 'interestingness-desc', // 興味深さ順
        per_page: 4, // 取得件数
        license: '4', // Creative Commons Attributionのみ
        extras: 'owner_name,license', // 追加で取得する情報
        format: 'json', // レスポンスをJSON形式に
        nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
      });
      const url = `https://api.flickr.com/services/rest/?${parameters}`;
      return url;
    },

    // photoオブジェクトから画像のURLを作成して返す
    getFlickrImageURL(photo, size) {
      let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`;
      if (size) {
        // サイズ指定ありの場合
        url += `_${size}`;
      }
      url += '.jpg';
      return url;
    },

    // photoオブジェクトからページのURLを作成して返す
    getFlickrPageURL(photo) {
      const pageUrls = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
      return pageUrls;
    },

    // photoオブジェクトからaltテキストを生成して返す
    getFlickrText(photo) {
      let text = `"${photo.title}" by ${photo.ownername}`;
      if (photo.license === '4') {
        // Creative Commons Attribution（CC BY）ライセンス
        text += ' / CC BY';
      }
      return text;
    },
  },
});
