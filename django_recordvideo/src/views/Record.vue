        <template>
            <h1>Record video from the browser</h1>
            <div class="row">
                <div v-for="record in recordingList" class="card" style="width: 18rem;">
                    <div class="col-sm-4">
                        <video controls width="250">
                            <source v-bind:src="[[ record.video ]]" type="video/mp4">
                            <source v-bind:src="[[ record.video ]]" type="video/webm">
                            <p>Your browser doesn't support HTML5 video. Here is
                            <a href="[[ record.video ]]">link to the video</a> instead.</p>
                        </video>
                        <button class="btn btn-danger" v-on:click="deletevideo(`${ record.id }`, `${ record }`)">Delete</button>
                        <button class="btn btn-primary" v-on:click="editvideo(`${ record.id }`)">edit</button>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <button v-on:click="startrecord">Start</button>
                <h2>Preview</h2>
                <video id="preview" ref="preview" width="160" height="120" autoplay muted></video>
            </div>
            <div class="form-group">
                <button v-on:click="stopButton">
                    Stop
                </button>
            </div>
            <a id="downloadButton" ref="downloadButton">
                Download
            </a>

            <form v-on:submit.prevent="Addvideo()" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <h2>Recording</h2>
                    <video id="recording" ref="recording" :value="recording" :disabled="!isEditing"
           :class="{view: !isEditing}" width="160" height="120" controls></video>
                    <div id="log" ref="log"></div>
                </div>
                <button type="submit" class="btn btn-primary">Haruka</button>
            </form>
        </template>
        <script>
            let recordingTimeMS = 5000;
            let recordedBlob;
            export default {
                delimiters: ['[[',']]'],
                data() {
                    return {
                        isEditing: false,
                        recordingList: [],
                    }
                },
                mounted: function(){
                    this.GetMessage();
                },
                methods: {
                    getCookie(name) {
                        let cookieValue = null;
                        if (document.cookie && document.cookie !== '') {
                            const cookies = document.cookie.split(';');
                            for (let i = 0; i < cookies.length; i++) {
                                const cookie = cookies[i].trim();
                                // Does this cookie string begin with the name we want?
                                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    },

                    log(msg) {
                        this.$refs.log.innerHTML += msg + "\n";
                    },

                    wait(delayInMS) {
                        return new Promise(resolve => setTimeout(resolve, delayInMS));
                    },

                    startRecording(stream, lengthInMS) {
                        let recorder = new MediaRecorder(stream);
                        let data = [];

                        recorder.ondataavailable = event => data.push(event.data);
                        recorder.start();
                        this.log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");

                        let stopped = new Promise((resolve, reject) => {
                            recorder.onstop = resolve;
                            recorder.onerror = event => reject(event.name);
                        });

                        let recorded = this.wait(lengthInMS).then(
                            () => recorder.state == "recording" && recorder.stop()
                        );

                        return Promise.all([
                            stopped,
                            recorded
                        ])
                        .then(() => data);
                    },
                    stop(stream) {
                        stream.getTracks().forEach(track => track.stop());
                    },
                    stopButton(){
                        this.stop(this.$refs.preview.srcObject);
                    },
                    startrecord(){
                        navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true
                        }).then( stream => {
                            this.$refs.preview.srcObject = stream;
                            this.$refs.downloadButton.href = stream;
                            this.$refs.preview.captureStream = this.$refs.preview.captureStream || this.$refs.preview.mozCaptureStream;
                            return new Promise(resolve => this.$refs.preview.onplaying = resolve);
                        }).then(() => this.startRecording(this.$refs.preview.captureStream(), recordingTimeMS))
                        .then (recordedChunks => {
                            recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
                            this.$refs.recording.src = URL.createObjectURL(recordedBlob);
                            this.$refs.downloadButton.href = this.$refs.recording.src;
                            this.$refs.downloadButton.download = "RecordedVideo.webm";

                            this.log("Successfully recorded " + recordedBlob.size + " bytes of " +
                            recordedBlob.type + " media.");
                        }).catch(log);
                    },
                    GetMessage(){
                        fetch('/video/blogs/',{
                            method: "GET",
                        })
                        .then(res => res.json())
                        .then((response) => {
                            this.recordingList = response;
                            console.log(response)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    },
                    Addvideo(){
                        const formData = new FormData();
                        formData.append('video', recordedBlob, "RecordedVideo.webm");
                        fetch('/video/blogs/',{
                            method: 'POST', // or 'PUT'
                            mode : 'same-origin',
                            credentials: "same-origin",
                            headers: {
                                "X-CSRFToken": this.getCookie("csrftoken"),
                            },
                            body: formData,
                        })
                        .then((response) => {
                            this.GetMessage();
                            console.log(response);
                            
                        }).catch((err) =>{
                            console.log(err);
                        })
                    },
                    deletevideo(id, video){
                        fetch(`/video/blogs/${ id }/`,{
                            credentials: 'same-origin',
                            method: 'DELETE', // or 'PUT'
                            headers: {
                                "X-CSRFToken": this.getCookie("csrftoken"),
                                'Content-Type': 'application/json; charset=UTF-8',
                            },
                            body: JSON.stringify(video)
                         })
                        .then((response) => {
                            this.GetMessage();
                            console.log(response);
                        }).catch((err) =>{
                            console.log(err);
                        })
                         //axios.delete(`/video/blogs/${ id }/`)
                            //.then(response => (console.log(response)))
                            ///.catch(error => (console.log(error.response)));
                    },
                    editvideo(id){
                        fetch(`/video/blogs/${ id }/`, {
                            method: 'GET',

                        })
                        .then(res => res.json())
                        .then((response) => {
                            this.$refs.recording.src = response.video;
                            console.log(response)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    },

                }
            }

        </script>
