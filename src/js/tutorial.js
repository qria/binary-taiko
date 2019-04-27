class Tutorial{
	constructor(fromSongSel, songId){
		this.fromSongSel = fromSongSel
		this.songId = songId
		loader.changePage("tutorial", true)
		assets.sounds["bgm_setsume"].playLoop(0.1, false, 0, 1.054, 16.054)
		this.endButton = document.getElementById("tutorial-end-button")
		
		var tutorialTitle = document.getElementById("tutorial-title")
		tutorialTitle.innerText = strings.howToPlay
		tutorialTitle.setAttribute("alt", strings.howToPlay)
		var tutorialContent = document.getElementById("tutorial-content")
		var keys = ["F", "J", "D", "K", "Q", "SHIFT", "CTRL"]
		var keyIndex = 0
		strings.tutorial.basics.forEach(string => {
			var par = document.createElement("p")
			var stringKeys = string.split("%s")
			stringKeys.forEach((stringKey, i) => {
				if(i !== 0){
					this.insertKey(keys[keyIndex++], par)
				}
				this.insertText(stringKey, par)
			})
			tutorialContent.appendChild(par)
		})
		var par = document.createElement("p")
		var span = document.createElement("span")
		span.style.fontWeight = "bold"
		span.innerText = strings.tutorial.otherControls
		par.appendChild(span)
		strings.tutorial.otherTutorial.forEach(string => {
			par.appendChild(document.createElement("br"))
			var stringKeys = string.split("%s")
			stringKeys.forEach((stringKey, i) => {
				if(i !== 0){
					this.insertKey(keys[keyIndex++], par)
				}
				this.insertText(stringKey, par)
			})
		})
		tutorialContent.appendChild(par)
		this.endButton.innerText = strings.tutorial.ok
		this.endButton.setAttribute("alt", strings.tutorial.ok)
		
		pageEvents.once(this.endButton, ["mousedown", "touchstart"]).then(this.onEnd.bind(this))
		pageEvents.keyOnce(this, 13, "down").then(this.onEnd.bind(this))
		
		this.gamepad = new Gamepad({
			"confirm": ["start", "b", "ls", "rs"]
		}, this.onEnd.bind(this))
		pageEvents.send("tutorial")
	}
	insertText(text, parent){
		parent.appendChild(document.createTextNode(text))
	}
	insertKey(key, parent){
		var kbd = document.createElement("kbd")
		kbd.innerText = key
		parent.appendChild(kbd)
	}
	onEnd(event){
		var touched = false
		if(event && event.type === "touchstart"){
			event.preventDefault()
			touched = true
		}
		this.clean()
		assets.sounds["se_don"].play()
		localStorage.setItem("tutorial", "true")
		setTimeout(() => {
			new SongSelect(this.fromSongSel ? "tutorial" : false, false, touched, this.songId)
		}, 500)
	}
	clean(){
		this.gamepad.clean()
		assets.sounds["bgm_setsume"].stop()
		pageEvents.remove(this.endButton, ["mousedown", "touchstart"])
		pageEvents.keyRemove(this, 13)
		delete this.endButton
	}
}
