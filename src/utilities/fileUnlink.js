// Required Modules
const path = require('path')
const { unlink } = require('fs')

/**
 * @desc Unlink Single Image User Defined Function
 * @AcceptedParams (FullImagePath)
 * @returns {Boolean}
 */

const unlinkSingleImage = async (imagePath) => {
  try {
    let slicedPath = imagePath.split('/').slice(3).join('/')
    let removedPath = path.join(__dirname, '../../public/', slicedPath)
    await unlink(removedPath, (error) => {
      if (error) {
      }
    })
    return true
  } catch (error) {
    return false
  }
}

// Export Mudule
module.exports = { unlinkSingleImage }
