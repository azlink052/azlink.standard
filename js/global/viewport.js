const viewportSettings = {
  width: 1280,
  globalUA: window.navigator.userAgent.toLowerCase()
};

if ((viewportSettings.globalUA.indexOf('android') > 0 && viewportSettings.globalUA.indexOf('mobile') == -1) || viewportSettings.globalUA.indexOf('ipad') > -1 || (viewportSettings.globalUA.indexOf('macintosh') > -1 && 'ontouchend' in document)) {
  // tablet
  document.write('<meta name="viewport" content="width=' + viewportSettings.width + '">');
} else {
  // タブレット端末ではない場合の処理
  document.write('<meta name="viewport" content="width=device-width">');
}
