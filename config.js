// youmenosay CF 設定ファイル
// 管理画面(admin.html)から編集・エクスポートできます

window.YMS_CONFIG = {
  version: '1.2.0',

  // ソレオスへのリンク
  soreosUrl: '',

  // 現在の支援総額（管理画面の「進捗管理」から更新）
  currentAmount: 0,
  currentAmountUpdatedAt: '',   // ISO 8601形式 例: '2025-05-08T12:00:00'

  // テーマ設定
  theme: {
    colorPrimary:   '#e879b0',
    colorSecondary: '#7c3aed',
    colorAccent:    '#f5a623',
    colorBg:        '#0f0b1e',
    colorSurface:   '#1e1a35',
    colorBorder:    '#2e2a50',
    colorText:      '#f0ecff',
    colorTextMuted: '#9d96c0',
    fontHeading:    "'Zen Maru Gothic', sans-serif",
    fontBody:       "'Noto Sans JP', sans-serif",
  },

  // 編集可能テキスト（空文字の場合はHTMLのデフォルト表示を使用）
  content: {
    heroTitle:       '',   // 例: 'アニメ化プロジェクト'
    heroLead:        '',   // ヒーローの説明文
    goalAmount:      '5,000,000',
    aboutMain:       '',   // 「はじめに」本文（改行は\nで表記）
    projectMain:     '',   // 「実現したいこと」本文
    producerMessage: '',   // プロデューサーメッセージ
  },

  // リワード公開設定
  rewards: {
    startDash: { visible: true,  comingSoon: false, periodText: '2025年5月8日(木) 〜 5月11日(日) 23:59まで' },
    zaitaku:   { visible: true,  comingSoon: true,  periodText: '5月11日(日) 以降 順次公開予定' },
    taiken:    { visible: true,  comingSoon: false, periodText: '' },
    creative:  { visible: true,  comingSoon: false, periodText: '' },
    special:   { visible: true,  comingSoon: false, periodText: '' },
    hojin:     { visible: true,  comingSoon: false, periodText: '' },
  },
};
