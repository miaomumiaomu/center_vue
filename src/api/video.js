import request from '@/utils/request'

// 获取拾联通道摄像头配置列表
export function postChanList(data){
  return request({
    url:'/api/device/deviceCameras/chanInfos',
    method:'post',
    data:[],
    banLoading: true
  })
}


// 获取拾联盒子设备信息
export function getDeviceInfo(deviceSerial){
  return request({
    url:`/api/video/shiLianBox/infos/${deviceSerial}`,
    method:'get',
    banLoading: true
  })
}

// 通过通道平台号查看是否在线
export function getCheckOnline(chanDpid){
  return request({
    url:`/api/video/shiLianBox/checkOnline/${chanDpid}`,
    method:'get',
    banLoading: true
  })
}

//获取抓拍视频(生成)
export function getReqVideo(snapId){
  return request({
    url:`/api/video/shiLianBox/reqVideo/${snapId}`,
    method:'get',
    banLoading: true
  })
}

// 拾联回调接口
export function getBoxNotify(snapId){
  return request({
    url:`/api/video/shiLianBoxnotify/${snapId}`,
    method:'get',
    banLoading: true
  })
}

// 获取播放视频url
export function getPlayVideo(snapId, isLoading){
  return request({
    url:`/api/video/shiLianBox/playVideo/${snapId}`,
    method:'get',
    banLoading: isLoading ? false : true
  })
}

// 获取H5视频播放基础配置
export function getVideoConfig(){
  return request({
    url:'/api/video/shiLianBox/config',
    method:'get',
    banLoading: true
  })
}