import { getFaceLibraryList, getCarLibraryList } from "@/api/common";
import { getTagList } from "@/api/libTagsManage";
import { postChanList } from "@/api/video";

export default {
  namespaced: true,
  state: {
    faceLibraryData: null, // 人脸库数据（用于类型遍历）
    carLibraryData: {}, // 车辆库数据(用于类型遍历)
    chanListData:[]
  },
  mutations: {
    // 设置人脸库数据
    SET_FACE_LIBRARY_DATA(state, data) {
      state.faceLibraryData = data;
    },
    // 设置人脸库数据
    SET_Car_LIBRARY_DATA(state, data) {
      state.carLibraryData = data;
    },
    SET_CHAN_LIST_DATA(state,data){
      state.chanListData=data;
    }
  },
  actions: {
    // 获取人脸库数据
    async getFaceLibraryData({ commit }, data) {
      let json = {};
      await getTagList().then(res => {
        res.data.map(item => {
          json[item.id] = {
            name: item.name,
            color: item.color,
            shortName: item.shortName
          };
        });
        commit('SET_FACE_LIBRARY_DATA', json);
      }).catch(err => {
        commit('SET_FACE_LIBRARY_DATA', json);
      })
    },
    // 获取车辆库数据
    getCarLibraryData: ({ commit }, data) => {
      let json = {};
      getCarLibraryList().then(res => {
        res.data.map(item => {
          json[item.num] = {
            name: item.name,
            color: item.color,
            shortName: item.shortName
          };
        });
        commit('SET_Car_LIBRARY_DATA', json);
      }).catch(err => {
        commit('SET_Car_LIBRARY_DATA', json);
      })
    },
    postChanListData:({ commit }, data) => {
      postChanList([]).then(res => {
        commit('SET_CHAN_LIST_DATA',res.data)
      }).catch(err => {
        commit('SET_CHAN_LIST_DATA', res.data);
      })
    }
  }
}
