/*
 * L.TileLayer.Grayscale is a regular tilelayer with grayscale makeover.
 */

L.TileLayer.Grayscale = L.TileLayer.extend({
  options: {
    quotaRed: 21,
    quotaGreen: 71,
    quotaBlue: 8,
    quotaDividerTune: 0,
    quotaDivider: function () {
      return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
    }
  },

  initialize: function (url, options) {
    options = options || {}
    options.crossOrigin = true;
    L.TileLayer.prototype.initialize.call(this, url, options);

    this.on('tileload', function (e) {
      this._makeGrayscale(e.tile);
    });
  },

  _createTile: function () {
    var tile = L.TileLayer.prototype._createTile.call(this);
    tile.crossOrigin = "Anonymous";
    return tile;
  },

  _makeGrayscale: function (img) {
    if (img.getAttribute('data-grayscaled')) return;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    // 反向滤镜
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixelData = imageData.data;
    let obj = {}
    for (var i = 0; i < canvas.width * canvas.height; i++) {
      var r = pixelData[4 * i + 0];
      var g = pixelData[4 * i + 1];
      var b = pixelData[4 * i + 2];
      // if (!obj[`${r}-${g}-${b}`]) {
      //   obj[`${r}-${g}-${b}`] = 1
      // } else {
      //   obj[`${r}-${g}-${b}`] += 1
      // }
      if (r == 164 && g == 205 && b == 255) {   // 单独处理海洋的颜色
        pixelData[4 * i + 0] = 15;
        pixelData[4 * i + 1] = 50;
        pixelData[4 * i + 2] = 95;
      }
      else if (r == 252 && g == 249 && b == 243) {   // 单独处理陆地颜色
        pixelData[4 * i + 0] = 34;
        pixelData[4 * i + 1] = 45;
        pixelData[4 * i + 2] = 59;
      }
      else if (r == 201 && g == 229 && b == 158) {   // 单独处理草地颜色  
        pixelData[4 * i + 0] = 45;
        pixelData[4 * i + 1] = 54;
        pixelData[4 * i + 2] = 67;
      }
      
      else if ((r == 233 && g == 231 && b == 226) || (r == 251 && g == 250 && b == 243)) {   // 单独处理公共设施颜色  
        pixelData[4 * i + 0] = 47;
        pixelData[4 * i + 1] = 57;
        pixelData[4 * i + 2] = 73;
      }
      else if (r == 216 && g == 231 && b == 238) {   // 单独处理教育体育颜色  
        pixelData[4 * i + 0] = 20;
        pixelData[4 * i + 1] = 34;
        pixelData[4 * i + 2] = 48;
      }
      else if (r == 236 && g == 217 && b == 223) {   // 单独处理医疗卫生颜色  
        pixelData[4 * i + 0] = 20;
        pixelData[4 * i + 1] = 34;
        pixelData[4 * i + 2] = 48;
      }
      else if (r == 240 && g == 228 && b == 208) {   // 单独处理文化颜色  
        pixelData[4 * i + 0] = 20;
        pixelData[4 * i + 1] = 34;
        pixelData[4 * i + 2] = 48;
      }
      else if (r == 234 && g == 225 && b == 238) {   // 单独处理商业场所颜色  
        pixelData[4 * i + 0] = 45;
        pixelData[4 * i + 1] = 54;
        pixelData[4 * i + 2] = 67;
      }

      else if (r == 255 && g == 164 && b == 91) {   // 单独处理高速公路颜色  
        pixelData[4 * i + 0] = 44;
        pixelData[4 * i + 1] = 56;
        pixelData[4 * i + 2] = 76;
      }
      else if (r == 187 && g == 227 && b == 221) {   // 单独处理交通枢纽颜色  
        pixelData[4 * i + 0] = 20;
        pixelData[4 * i + 1] = 34;
        pixelData[4 * i + 2] = 48;
      }
      else if (r == 242 && g == 208 && (b == 94 || b == 93)) {   // 单独处理城市环线颜色  
        pixelData[4 * i + 0] = 42;
        pixelData[4 * i + 1] = 49;
        pixelData[4 * i + 2] = 61;
      }
      else if (r == 248 && g == 211 && b == 146) {   // 单独处理国道颜色  
        pixelData[4 * i + 0] = 44;
        pixelData[4 * i + 1] = 56;
        pixelData[4 * i + 2] = 76;
      }
      else if (r == 246 && g == 228 && b == 164) {   // 单独处理省道颜色  
        pixelData[4 * i + 0] = 44;
        pixelData[4 * i + 1] = 56;
        pixelData[4 * i + 2] = 76;
      }
      // else if (r == 235 && g == 185 && b == 1) {   // 单独处理地铁颜色  
      //   pixelData[4 * i + 0] = 44;
      //   pixelData[4 * i + 1] = 56;
      //   pixelData[4 * i + 2] = 76;
      // }
      else if (r == 254 && (g == 254 || g == 253) && (b == 254 || b == 253)) {   // 单独处理二级公路颜色  
        pixelData[4 * i + 0] = 38;
        pixelData[4 * i + 1] = 60;
        pixelData[4 * i + 2] = 89;
      }

      else {
        pixelData[4 * i + 0] = 255 - r + 20;
        pixelData[4 * i + 1] = 255 - g + 20;
        pixelData[4 * i + 2] = 255 - b + 20;
      }
    }
    // for (let key in obj) {
    //   if (obj[key] < 1000) {
    //     delete obj[key]
    //   }
    // }
    // console.log(obj)
    ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
    img.setAttribute('crossorigin', 'anonymous');
    img.setAttribute('data-grayscaled', true);
    img.src = canvas.toDataURL();
  }
});


L.tileLayer.grayscale = function (url, options) {
  return new L.TileLayer.Grayscale(url, options);
};
