// ==========================================================================
// このファイルでは、以下の機能を実装しています。
// 1. ハンバーガーメニューの開閉（スマホ用ナビゲーション）
// 2. ナビゲーションリンクをクリックした時のスムーズスクロール
// 3. ヘッダーのスクロール時のデザイン変化
// 4. ページトップへ戻るボタンの表示・非表示
// 5. スクロールに合わせた要素のフェードインアニメーション
// 6. スキルバーのアニメーション（画面内に入ったら伸びる）
// ==========================================================================


// ページの読み込みが完了してからJavaScriptを実行する
document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------------
     1. ハンバーガーメニューの開閉
     ------------------------------------------------------------------ */

  // ハンバーガーボタンとナビゲーションを取得
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  // ハンバーガーボタンがクリックされたら、メニューの開閉を切り替える
  hamburger.addEventListener("click", () => {
    // is-activeクラスの有無を切り替える（ボタンの見た目「×」用）
    hamburger.classList.toggle("is-active");
    // is-openクラスの有無を切り替える（ナビゲーションの表示用）
    nav.classList.toggle("is-open");
  });


  /* ------------------------------------------------------------------
     2. ナビゲーションリンクをクリックした時のスムーズスクロール
     ------------------------------------------------------------------ */

  // すべてのナビゲーションリンクを取得
  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // リンク先のID（例： "#about" ）を取得
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // デフォルトの「すぐに移動する」挙動を止める
        event.preventDefault();

        // ヘッダーの高さを考慮して、少し上にずらした位置までスクロールする
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        // スムーズにスクロールさせる
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // スマホ表示でメニューが開いていたら、リンククリック後に閉じる
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          hamburger.classList.remove("is-active");
        }
      }
    });
  });


  /* ------------------------------------------------------------------
     3. ヘッダーのスクロール時のデザイン変化
        4. ページトップへ戻るボタンの表示・非表示
     ------------------------------------------------------------------ */

  const header = document.getElementById("header");
  const toTopButton = document.getElementById("toTop");

  // スクロールイベントが発生するたびに実行する処理
  window.addEventListener("scroll", () => {
    // 現在のスクロール位置（ページ上端からの距離）を取得
    const scrollY = window.scrollY;

    // 50pxより多くスクロールしたら、ヘッダーに影をつけるクラスを追加
    if (scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // 300pxより多くスクロールしたら、ページトップへ戻るボタンを表示
    if (scrollY > 300) {
      toTopButton.classList.add("is-visible");
    } else {
      toTopButton.classList.remove("is-visible");
    }
  });


  /* ------------------------------------------------------------------
     5. スクロールに合わせた要素のフェードインアニメーション
        6. スキルバーのアニメーション
     ------------------------------------------------------------------ */

  // IntersectionObserver：要素が画面内に入ったかどうかを監視してくれる仕組み
  // → スクロールイベントを自分で監視するより、パフォーマンスが良い
  const observerOptions = {
    root: null, // ビューポート（画面）を基準にする
    rootMargin: "0px",
    threshold: 0.15, // 要素が15%見えたら「画面内に入った」と判定する
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // 画面内に入った要素に対して処理を行う
      if (entry.isIntersecting) {
        const target = entry.target;

        // フェードインアニメーション用のクラスを追加
        target.classList.add("is-visible");

        // もしこの要素がスキルバー（.skill）だった場合は、バーを伸ばす処理を行う
        if (target.classList.contains("skill")) {
          // .skill__bar-inner要素を取得
          const barInner = target.querySelector(".skill__bar-inner");
          // data-width属性に設定された数値（例："90"）を取得
          const width = barInner.getAttribute("data-width");
          // widthスタイルを設定することで、CSSのtransitionによりアニメーションする
          barInner.style.width = width + "%";
        }

        // 一度表示されたら、もう監視する必要がないので監視を解除する
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // フェードインさせたい要素（.fade-in）をすべて取得して監視を開始
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el) => {
    observer.observe(el);
  });

  // スキル項目（.skill）も同じくIntersectionObserverで監視する
  // ※ .fade-inクラスがついていない場合に備えて、別途監視を追加
  const skillElements = document.querySelectorAll(".skill");
  skillElements.forEach((el) => {
    observer.observe(el);
  });

});
