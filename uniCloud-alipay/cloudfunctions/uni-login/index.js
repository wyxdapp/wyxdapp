'use strict';
exports.main = async (event, context) => {
	// URL化调用时，参数在 event.body 中（JSON字符串）
	// 客户端直接调用时，参数直接在 event 上
	let params = event
	if (event.body) {
		try {
			params = JSON.parse(event.body)
		} catch (e) {
			params = event
		}
	}
	
	// 调用 uniCloud 内置方法，通过 access_token 换取真实手机号
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__0B0B4BB',
		provider: 'univerify',
		access_token: params.access_token,
		openid: params.openid
	})
	return res
};
