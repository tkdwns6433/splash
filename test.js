class Test{
	constructor (name){
		this.name = name;
	}

	go() {
		console.log(this.name);
	}
}

var go = function(){
	console.log('gaga');
}

module.exports = {
	Test: Test,
	go: go
}


