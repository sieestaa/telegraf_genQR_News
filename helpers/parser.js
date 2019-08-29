let needle = require('needle');
let cheerio = require('cheerio')

async function getHtml(url){	
	try{
		let result = await needle('get', url);
		return result.body
	}catch (e){
		console.log(e)
		return 'error.'
	}
}

function parse(html, selectors){
	let result = [];
	const $ = cheerio.load(html, { decodeEntities: false });	 
	$(selectors).each(function(){
		result.push($(this).text())
	});
	return result;
}

module.exports = {
	getYandexNews: async function(){
		const url = 'https://yandex.ru/';
		const selector = 'ol>.list__item>a';
		let html = await getHtml(url)
		return parse(html, selector)
	}
}