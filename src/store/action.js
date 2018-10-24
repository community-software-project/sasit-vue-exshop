import {getUser, getAddressList} from '../service/getData';
import {GET_USERINFO, SAVE_ADDRESS} from './mutation-types.js';
import {getStore} from '../config/mUtils';

export default {

	async getUserInfo({
		commit,
		state
	}) {
		let res = await getUser();
		commit(GET_USERINFO, res)
	},

  async getCustomerInfo({commit, state}) {
    let res = await getUser();
    let phoneNumber = getStore('phoneNumber');
    commit(GET_USERINFO, phoneNumber)
  },

	async saveAddress({
		commit,
		state
	}) {

		if(state.removeAddress.length > 0) return;

		let addres = await getAddressList(state.userInfo.user_id);
		commit(SAVE_ADDRESS, addres);
	},
}
