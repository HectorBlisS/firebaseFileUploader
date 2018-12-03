
class blissUploader{

    constructor(id, ref){
        this.id = id || 'el'
        this.completed = 0
        this.img = 'http://pngimages.net/sites/default/files/upload-png-image-31812.png'
        this.ref = ref || 'media/files'
        this.bucketRef = firebase.storage().ref(this.ref)
        this.getElements()
    }

    getElements(){
        this.form = document.getElementById(this.id)
        this.submit = this.form.querySelector('input[type="submit"]')
        //create elements
        this.div = document.createElement('div')
        this.loader = document.createElement('div')
        this.input = document.createElement('input')
        this.div.appendChild(this.loader)
        this.div.appendChild(this.input).type = "file"
        //colocarlos
        this.form.insertBefore(this.div, this.submit)
        this.setStyles()
        this.setListeners()
    }

    setStyles(){
        this.input.style = ` 
        display:none;
        `
        this.div.style = `
        width:100px;
        height:100px;
        background-image:url('${this.img}');
        background-size:cover;
        cursor:pointer;
        `
        this.loader.style = `
        width:${this.completed}%;
        height:100%;
        background:orange;
        opacity:.5;
        transition:all .3s ease;
        `
    }

    setListeners(){
        this.div.addEventListener('click', e=>{
          this.input.click()
        })
        this.input.addEventListener('change', e=>{
            this.file = e.target.files[0]
            this.type = e.target.files[0].type.split('/')[0]
            this.setPreview()
        })
        this.form.addEventListener('submit', e=>{
            e.preventDefault()
            this.uploadFile()
            //console.log(this.form)
        })
    }

    setPreview(){
        if(this.type === "video") {
            this.img = "https://www.imris.com/wp-content/uploads/2017/11/Video-Icon.png"
            this.setStyles()
            return
        }
        const reader = new FileReader()
        const previewLink = reader.readAsDataURL(this.file)
        reader.onload = ()=>{
            this.img = reader.result
            this.setStyles()
            //console.log(reader.result)
        }
    }

    uploadFile(){
        const task = this.bucketRef.child(this.file.name).put(this.file)
        task.on('state_changed', snap=>{
            this.completed = (snap.bytesTransferred / snap.totalBytes) * 100
            this.setStyles()
        }, e=>{}, ()=>{
            task.snapshot.ref.getDownloadURL().then(downloadURL=>{
                
                this.link = downloadURL
                console.log(this.link)
                this.img = "https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/172-512.png"
                this.setStyles()
                this.done()
            })
        })
    }

    done(){
        console.log(this.link)
    }

}

//instancia
// var uploader = new blissUploader("form")
// uploader.done = ()=>{
//     const body = {
//         username: uploader.form.username.value,
//         email: uploader.form.email.value,
//         file: uploader.link
//     }
//     //axios
//     console.log(body)
// }