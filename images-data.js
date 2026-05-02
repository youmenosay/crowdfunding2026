// youmenosay CF 画像データファイル v1.3
// 管理画面(admin.html)の「images-data.js DL」から生成されました

window.YMS_IMAGES = {
  heroAbove:   "",
  heroBelow:   "",
  hero:        "",
  comparison:  "",
  rewardImages:  [],

  members: {
    kano:  "",
    sari:  "",
    reina: "",
    haru:  "",
    yuka:  "",
  },

  projectImages: [],

  rewardCards: {
    startdash_1000:     "",
    startdash_3000:     "",
    zaitaku_3000:       "",
    zaitaku_5000:       "",
    zaitaku_10000:      "",
    zaitaku_30000:      "",
    taiken_women30:     "",
    taiken_men30:       "",
    taiken_photo30:     "",
    taiken_offkai50:    "",
    creative_intro30:   "",
    creative_song200:   "",
    creative_design30:  "",
    creative_craft30:   "",
    creative_video30:   "",
    creative_yt30:      "",
    special_mv200:      "",
    special_support300: "",
    hojin_ume200:       "",
    hojin_take500:      "",
    hojin_matsu1000:    "",
  },

  contentBlockImages: (function() {
    const ci = imgData.contentBlockImages || {};
    const entries = Object.entries(ci).filter(([,v]) => v);
    if (!entries.length) return '{}';
    return '{
' + entries.map(([k,v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',').join('
') + '
  }';
  })(),

  slots: {
    aboutBanner:     "",
    projectTop:      "",
    projectBottom:   "",
    milestoneBanner: "",
    scheduleBanner:  "",
  },
};
