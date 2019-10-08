import EXIF from 'exif-js'

export const imageHandle = {
  getOrientation: (file) => {
    return new Promise((resolve) => {
      EXIF.getData(file, function () {
        const orient = EXIF.getTag(this, 'Orientation')
        resolve(orient)
      })
    })
  },

  dataURLtoFile: (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },

  rotateImage: (image, width, height) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.save()
    canvas.width = height
    canvas.height = width
    ctx.rotate(90 * Math.PI / 180)
    ctx.drawImage(image, 0, -height)
    ctx.restore()
    return canvas.toDataURL("image/jpeg")
  }
}

export default function imgCalibration(file) {
  return new Promise((resolve) => {
    imageHandle.getOrientation(file).then((orient) => {
      if (orient && orient === 6) {
        let reader = new FileReader()
        let img = new Image()
        reader.onload = (e) => {
          img.src = e.target.result
          img.onload = function () {
            const data = imageHandle.rotateImage(img, img.width, img.height)
            const newFile = imageHandle.dataURLtoFile(data, file.name)
            resolve(newFile)
          }
        }
        reader.readAsDataURL(file)
      } else {
        resolve(file)
      }
    })
  })
}